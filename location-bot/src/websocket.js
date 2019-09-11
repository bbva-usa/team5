const WebSocketClient = require('websocket').w3cwebsocket

const openWebSocket = (host, callback) => {
  const client = new WebSocketClient(host)
  
  client.addEventListener('open', () => {
    console.log('Opened WebSocket connection')
  })
  
  client.addEventListener('close', () => {
    console.error('WebSocket connection closed')
    setTimeout(() => openWebSocket(host, callback), 2000)
  })
  
  client.addEventListener('error', (error) => {
    console.error('General WebSocket error: ', error)
    setTimeout(() => openWebSocket(host, callback), 2000)
  })

  callback(client)
}

module.exports = {openWebSocket}