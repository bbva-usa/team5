import io from 'socket.io-client'


export const openWebSocket = (host) => {
  const socket = io(host, {
    transports: ['websocket']
  })
  
  socket.on('connect', () => {
    console.log('Opened WebSocket connection')
  })
  
  socket.on('connect_error', (error) => {
    console.error('Connection error: ', error)
  })
  
  socket.on('connect_timeout', (timeout) => {
    console.error('Timed out: ', timeout)
  })
  
  socket.on('error', (error) => {
    console.error('General WebSocket error: ', error)
  })

  return socket
}
