const { interval, from } = require('rxjs')
const { pairwise, map, flatMap, zip } = require('rxjs/operators')

const mockData = [
  [33.459474, -86.931613],
  [33.458541, -86.933948],
  [33.459545, -86.934005],
  [33.463055, -86.933830],
  [33.462646, -86.931283],
  [33.465273, -86.916580],
  [33.460048, -86.918647],
  [33.465015, -86.918008],
  [33.462456, -86.921228],
  [33.463756, -86.924299],
  [33.465758, -86.926435],
  [33.490192, -86.908096],
]

const toRadians = x => x * Math.PI / 180

const distance = ([lat1, lng1], [lat2, lng2]) => {
  // This is the haversine formula.
  const R = 6371e3; // radius of Earth in meters
  const φ1 = toRadians(lat1)
  const φ2 = toRadians(lat2)
  const Δφ = toRadians(lat2 - lat1)
  const Δλ = toRadians(lng2 - lng1)

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const lerp = (from, to, t) => from + t * (to - from)

const lerpCoord = ([lat1, lng1], [lat2, lng2], t) => {
  return [lerp(lat1, lat2, t), lerp(lng1, lng2, t)]
}

// updateDelay in milliseconds, typicalVelocity in meters/second
const locationStream = (coords, updateDelay, typicalVelocity) => {
  return from(coords)
    .pipe(
      pairwise(),
      map(([from, to]) => {
        const numSamples = 1000 * distance(from, to) / (typicalVelocity * updateDelay)
        const result = []
        for (let i = 0; i < numSamples; i++) {
          const sample = lerpCoord(from, to, i / numSamples)
          result.push(sample)
        }
        return result
      }),
      flatMap(x => x),
      zip(interval(updateDelay)),
      map(([coord, _]) => coord)
    )
}

module.exports = {
  mockData, locationStream
}