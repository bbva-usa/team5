import {openWebSocket} from './websocket'

const wsHost = 'ws://34.70.173.43:1880/ws/front-end'

const makeLocationEmitter = (socket) => ({lat, lng, busID, timestamp}) => {
  socket.send(JSON.stringify({
    key: 'location',
    payload: {lat, lng, busID},
    timestamp,
  }))
}

const emitLocation = makeLocationEmitter(openWebSocket(wsHost))





// {"key":"location","payload":{"busID":1,"lat":40,"lng":-80}}
