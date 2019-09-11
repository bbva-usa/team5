const WebSocketClient = require('websocket').w3cwebsocket

const openWebSocket = (host) => {
  const client = new WebSocketClient(host)
  
  client.addEventListener('open', () => {
    console.log('Opened WebSocket connection')
  })
  
  client.addEventListener('close', () => {
    console.error('WebSocket connection closed')
  })
  
  client.addEventListener('error', (error) => {
    console.error('General WebSocket error: ', error)
  })

  return client
}

module.exports = {openWebSocket}