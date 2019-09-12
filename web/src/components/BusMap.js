import React from 'react';
import './BusMap.css';
const loadGoogleMapsApi = require('load-google-maps-api')

const busStops = [
    [33.45368, -86.93162],
    [33.45261, -86.9332],
    [33.45511, -86.93512],
    [33.45775, -86.93582],
    [33.45396, -86.93813],
    [33.45631, -86.93896],
    [33.45574, -86.93766],
    [33.45549, -86.93678],
    [33.45428, -86.93319],
    [33.4562, -86.9314],
    [33.45747, -86.93083],
    [33.4575, -86.92913],
    [33.45965, -86.92792],
    [33.46303, -86.92839],
    [33.46655, -86.93359],
    [33.46644, -86.93256],
    [33.46596, -86.93081],
    [33.46859, -86.93099],
    [33.49125, -86.90824]
].map(stop => stop.join(', '))

class BusMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            map: {}
        }
    }

    initMap(googleMaps) {
        /**
         * Init the map element.
         */
        let map = new googleMaps.Map(document.getElementById('map'), {
            center: { lat: 33.45368, lng: -86.93162},
            zoom: 8,
        })
        this.setState({ map })

        var directionsService = new googleMaps.DirectionsService();
        var directionsRenderer = new googleMaps.DirectionsRenderer();
        directionsRenderer.setMap(map)

        let waypoints = busStops.map((stop) => {
            return {
                location: stop,
                stopover: true
            }
        })

        directionsService.route({
            origin: busStops[0],
            destination: busStops[busStops.length - 1],
            waypoints,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, (response, status) => {
            if (status !== 'OK') return alert(status)

            directionsRenderer.setDirections(response)
        })

        /**
         * Update map markers on location update events.
         */
        let markers = {}
        this.props.dispatcher.on('location', (update) => {
            const { busID, lat, lng } = update
            if (!markers[busID]) {
                markers[busID] = new googleMaps.Marker({
                    position: { lat, lng },
                    map: this.state.map,
                    icon: 'school-bus.png'
                })
            }
            markers[busID].setPosition({ lat, lng })
        })
    }

    componentDidMount() {
        loadGoogleMapsApi({ key: 'AIzaSyD3H7Y0WP00X8qUWe9x5eUQonNHA3qgid8' })
            .then((google) => this.initMap(google))
    }

    render() {
        return (
            <div id="map" style={{ height: '500px' }}></div>
        )
    }
}

export default BusMap;
