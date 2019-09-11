const { openWebSocket } = require('./websocket')
const { locationStream, mockData } = require('./location-data')
const { map, tap } = require('rxjs/operators')

const wsHost = 'ws://34.70.173.43:1880/ws/bus-simulator'

const makeLocationEmitter = (socket) => ({ lat, lng, busID, timestamp }) => {
  const message = JSON.stringify({
    key: 'location',
    payload: { lat, lng, busID },
    timestamp,
  })
  socket.send(message)
  console.log(message)
}

const main = (socket) => {
  const emitLocation = makeLocationEmitter(socket)

  locationStream(mockData, 1000, 20)
    .pipe(
      map(([lat, lng]) => {
        return {
          lat,
          lng,
          busID: 3,
          timestamp: Date.now(),
        }
      }),
      tap(emitLocation),
    )
    .subscribe()
}

openWebSocket(wsHost, main)
