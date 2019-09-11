const { openWebSocket } = require('./websocket')
const { locationStream, mockData } = require('./location-data')
const { map, tap, catchError } = require('rxjs/operators')

const wsHost = 'ws://34.70.173.43:1880/ws/bus-simulator'

const makeLocationEmitter = (socket) => ({ lat, lng, busID, timestamp }) => {
  const message = JSON.stringify({
    key: 'location',
    payload: { lat, lng, busID },
    timestamp,
  })
  try {
    socket.send(message)
  } catch {/* I know, I know. */}
  console.log(message)
}

const main = (socket) => {
  const emitLocation = makeLocationEmitter(socket)

  locationStream(mockData, 250, 20)
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
      catchError((err) => console.error(err))
    )
    .subscribe()
}

openWebSocket(wsHost, main)
