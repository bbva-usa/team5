import React from 'react';
import './BusMap.css';
const loadGoogleMapsApi = require('load-google-maps-api')

const linnPark = {lat: 33.520279, lng: -86.809334}

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
        this.setState({
            map: new googleMaps.Map(document.getElementById('map'), {
                center: linnPark,
                zoom: 8,
            })
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
        loadGoogleMapsApi({ key: 'AIzaSyCsTrymE3Zxa2sAnd99vwTOORXXnqY2FGc' })
            .then((google) => this.initMap(google))
    }

    render() {
        return (
            <div id="map" style={{ height: '500px' }}></div>
        )
    }
}

export default BusMap;
