import React from 'react';
import './App.css';
import { mergeStyleSets } from 'office-ui-fabric-react';
import BusMap from './components/BusMap'
import { riders } from './data/riders'
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
                        riders: {
                            ...this.state.riders,
                            [studentID]: true
                        }
                    })
                    console.log(this.state.riders)
                    break
                default:
                    console.error('Unknown event', event)
            }
        })
    }

    render() {
        return (
            <div className="App">

                <div style={{ height: '500px', width: '100%', display: 'flex' }}>
                    {/* Route Updates */}
                    <div style={{ width: '400px', padding: '10px', height: '100%', overflow: 'scroll' }}>
                        <div style={{ border: 'dashed black 2px' }}>
                            <h2>Live Route Updates</h2>
                            <div>
                                {this.state.events.map((event, idx) => (
                                    <pre key={idx}>{JSON.stringify(event)}</pre>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Realtime Map */}
                    <div style={{ flexBasis: 2, flexGrow: 3, padding: '10px' }}>
                        <BusMap dispatcher={this.dispatcher} />
                    </div>
                </div>

                {/* Riders List */}
                <div>
                    <ul>
                        {Object.keys(this.state.riders).map((id, idx) => {
                            let profile = riders[id] || {}
                            return (
                                <li key={idx}>
                                    <img src={profile.image} />
                                </li>
                            )
                        })}
                    </ul>
                </div>

            </div>
        );
    }
}

export default App;
