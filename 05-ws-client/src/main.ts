import { connectToServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>WS - Client</h2>
    <input type="text" id="jwt-token" placeholder="JSON Web Token" />
    <button id="btn-connect">Connect</button><br /><br />

    <span id="server-status">offline</span>


    <ul id="client-id"></ul>

    <form id="message-form">
      <input type="text" placeholder="message" id="message-input" />

      <input type="submit" value="Enviar" />
    </form>

    <h3>Messages</h3>
    <ul id="messages-ul"></ul>
  </div>
`

// connectToServer();

const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!;
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!;

btnConnect.addEventListener('click', () => {

  if( jwtToken.value.trim().length <= 0 ) return alert('Enter a valid JWT');

  connectToServer( jwtToken.value.trim() );
});