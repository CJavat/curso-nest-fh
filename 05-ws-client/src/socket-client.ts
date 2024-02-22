import { Manager, Socket } from "socket.io-client"

export const connectToServer = () => {
  const manager = new Manager('localhost:3000/socket.io/socket.io.js');
  
  const socket = manager.socket('/');
  
  addListeners(socket);

}


const addListeners = ( socket: Socket ) => {
  const serverStatusLabel = document.querySelector('#server-status')!;
  const clientsUl = document.querySelector('#client-id');
  const messageForm = document.querySelector<HTMLFormElement>('#message-form');
  const messageInput = document.querySelector<HTMLInputElement>('#message-input');
  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul');

  socket.on('connect', () => {
    serverStatusLabel.innerHTML = 'CONNECTED';  
  }); 

  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'DISCONNECTED';
  });
  
  socket.on('clients-updated', ( clients: string[] ) => {
    let clientsHtml = '';

    clients.forEach( clientId => {
      clientsHtml += `
        <li>${ clientId }</li>
      `;
    });

    clientsUl!.innerHTML = clientsHtml;
  });

  messageForm!.addEventListener('submit', (event) => {
    event.preventDefault();
    if( messageInput!.value.trim().length <= 0 ) return;
    
    socket.emit('message-from-client', {
      id: 'yo',
      message: messageInput!.value
    });

    messageInput!.value = '';
  });

  socket.on('messages-from-server', ( payload: { fullName: string, message: string } ) => {
    const newMessage = `
      <li>
        User: <strong>${ payload.fullName }</strong> <br />
        Message: <span>${ payload.message }</span>
      </li>
    `;
    const li = document.createElement('li');
    li.innerHTML = newMessage;
    messagesUl?.append(li);
  });

};