import React from 'react';
import './App.css';
import { ActivityItem, Icon, Link, mergeStyleSets } from 'office-ui-fabric-react';
import { ScrollablePane } from 'office-ui-fabric-react/lib/ScrollablePane';
import { NodeRedWs } from './wsService'

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
        const socket = NodeRedWs()

        this.state = {
            events: []
        }

        socket.addEventListener('message', event => {
            let parsed = JSON.parse(event.data)
            this.setState({
                events: [...this.state.events, parsed]
            })
        })

    }

    render() {
        return (
            <div className="App">

                {/* Event list container. */}
                <div style={{ width: '400px', height: '600px', border: 'dashed black 2px', padding: '10px' }}>
                    <h2>Live Route Updates</h2>
                    <div>
                        {this.state.events.map(event => <pre>{JSON.stringify(event)}</pre>)}
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
