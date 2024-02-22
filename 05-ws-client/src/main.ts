import { connectToServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>WS - Client</h1>
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

connectToServer();