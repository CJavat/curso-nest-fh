import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;
  
  constructor(
    private readonly messagesWsService: MessagesWsService,
  ) {}
  
  handleConnection(client: Socket ) {
    this.messagesWsService.registerClient( client );
    this.wss.emit( 'clients-updated', this.messagesWsService.getConnectedClients() );
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient( client.id );
    this.wss.emit( 'clients-updated', this.messagesWsService.getConnectedClients() );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    console.log(client.id, payload);
    
    //! Emite unicamente al cliente
    // client.emit('messages-from-server', {
    //   fullName: 'CJavatX',
    //   message: payload.message || 'no-message'
    // });

    //! Emitir a todos menos al cliente
    // client.broadcast.emit('messages-from-server', {
    //   fullName: 'CJavatX',
    //   message: payload.message || 'no-message'
    // });

    //! Emitir a todos los clientes connectados (incluso al que lo envió)
    this.wss.emit('messages-from-server', {
      fullName: 'CJavatX',
      message: payload.message || 'no-message'
    });
  }

}
