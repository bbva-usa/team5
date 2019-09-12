import React from 'react';
import './App.css';
import BusMap from './components/BusMap'
import { riders } from './data/riders'
import { IFacepileProps, Facepile, OverflowButtonType } from 'office-ui-fabric-react/lib/Facepile';
import { facepilePersonas } from '@uifabric/example-data';
import { PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { arrived, batchCheckIn } from './data/events'
import { ActivityItem, Icon, Link, mergeStyleSets } from 'office-ui-fabric-react';

const EventEmitter = require('events')


const classNames = mergeStyleSets({
    exampleRoot: {
        marginTop: '20px'
    },
    nameText: {
        fontWeight: 'bold'
    }
});


class App extends React.Component {
    constructor() {
        super()

        this.dispatcher = new EventEmitter()

        this.state = {
            events: [],
            riders: []
        }

        this.listenForEvents()
    }

    listenForEvents() {
        const socket = new WebSocket('ws://34.70.173.43:1880/ws/front-end')

        socket.addEventListener('open', () => console.log('Connected.'))

        socket.addEventListener('message', event => {
            console.log('Received: ', event)

            let parsed = (() => {
                try {
                    return JSON.parse(event.data)
                } catch (e) {
                    return null
                }
            })()

            switch (parsed.key) {
                case 'location':
                    this.dispatcher.emit('location', {
                        lat: parsed.payload.lat,
                        lng: parsed.payload.lng
                    })
                    this.setState({
                        events: [...this.state.events, parsed]
                    })
                    break
                case 'check-in':
                    let { studentID } = parsed.payload
                    this.setState({
                        events: [...this.state.events, parsed],
                        riders: [...this.state.riders, studentID]
                    })
                    console.log(this.state.riders)
                    break
                default:
                    console.error('Unknown event', event)
            }
        })
    }

    render() {

        const facepileProps = {
            personaSize: 30,
            personas: facepilePersonas.slice(0, this.state.riders.length),
            overflowPersonas: facepilePersonas.slice(this.state.riders.length),
            getPersonaProps: (persona) => {
                return {
                    imageShouldFadeIn: this.state.imagesFadeIn
                };
            },
            ariaDescription: 'To move through the items use left and right arrow keys.'
        };

        let arrivalEvt = arrived('Chris Rocco', 'Union Square', '1 hour ago')
        let checkInEvt = batchCheckIn('Jon Doe', 'Central Park', '30 minutes ago')

        return (
            <div className="App" style={{ padding: '20px' }}>

                <h1>Fairfield Schools Bus Portal (Route One)</h1>

                {/* Riders List */}
                <div style={{ padding: '30px 10px' }}>
                    <h2>Active Rider List</h2>
                    <Facepile {...facepileProps} />
                </div>

                <div style={{ height: '500px', width: '100%', display: 'flex' }}>
                    {/* Route Updates */}
                    <div style={{ width: '400px', padding: '10px', height: '100%', overflow: 'scroll' }}>
                        <h2>Live Route Updates</h2>
                        <div>
                            {this.state.events.map((event, idx) => {
                                if (event.key === 'check-in') {
                                    if (idx % 2 === 0) {
                                        return <ActivityItem {...arrivalEvt} key={0} className={classNames.exampleRoot} />
                                    }
                                    return <ActivityItem {...checkInEvt} key={1} className={classNames.exampleRoot} />
                                }
                            })}
                        </div>
                    </div>

                    {/* Realtime Map */}
                    <div style={{ flexBasis: 2, flexGrow: 3, padding: '10px' }}>
                        <BusMap dispatcher={this.dispatcher} />
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
