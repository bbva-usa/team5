import React from 'react';
import './App.css';
import { PrimaryButton } from 'office-ui-fabric-react'
import { Spinner } from 'office-ui-fabric-react/lib/Spinner'
import * as Quagga from 'quagga'
import Swal from 'sweetalert2'
import {Subject} from 'rxjs'
import {debounceTime} from 'rxjs/operators'


class App extends React.Component {

    constructor() {
        super()
        this.state = { tracking: false }
        this.checkIn$ = new Subject()
        this.webSocket = new WebSocket('ws://34.70.173.43:1880/ws/bus-app')
        this.webSocket.addEventListener('open', () => console.log('Connected.'))

        // Debound check-in requests.
        this.checkIn$.pipe(
            debounceTime(100)
        ).subscribe((event) => {
            this.webSocket.send(JSON.stringify({
                key: 'check-in',
                timestamp: (new Date()).getTime(),
                payload: {
                    studentID: event.studentID
                }
            }))
        })
    }

    componentDidMount() {
        this.initScanner()
    }

    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'center', padding: '30px'}}>
                <div className="App" style={{maxWidth: '800px'}}>

                    {this.state.tracking ? <Spinner label="Broadcasting Location..." ariaLive="assertive" labelPosition="left" /> : null}

                    <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-evenly' }}>
                        <PrimaryButton onClick={() => this.startTracking()}>Start Tracking</PrimaryButton>
                        <PrimaryButton onClick={() => this.stopTracking()}>Stop Tracking</PrimaryButton>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <div id="scanner-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    updateLocation({ lat, lng }) {
        this.setState({ lat, lng })
        this.webSocket.send(JSON.stringify({
            key: 'location',
            timestamp: (new Date()).getTime(),
            payload: { lat, lng }
        }))
    }

    checkIn(studentID) {
        this.checkIn$.next({ studentID })
    }

    startTracking() {
        if (window.navigator.geolocation) {
            this.setState({
                tracking: window.navigator.geolocation.watchPosition((position) => {
                    let { latitude, longitude } = position.coords
                    this.updateLocation({ lat: latitude, lng: longitude })
                })
            })
        }
    }

    stopTracking() {
        window.navigator.geolocation.clearWatch(this.state.tracking)
        this.setState({ tracking: null })
    }

    initScanner() {

        const startScanner = () => {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#scanner-container'),
                    constraints: {
                        width: 500,
                        height: 500,
                        facingMode: "environment"
                    },
                },
                decoder: {
                    readers: [
                        "code_128_reader",
                        // "ean_reader",
                        // "ean_8_reader",
                        // "code_39_reader",
                        // "code_39_vin_reader",
                        // "codabar_reader",
                        // "upc_reader",
                        // "upc_e_reader",
                        // "i2of5_reader"
                    ],
                    debug: {
                        showCanvas: true,
                        showPatches: true,
                        showFoundPatches: true,
                        showSkeleton: true,
                        showLabels: true,
                        showPatchLabels: true,
                        showRemainingPatchLabels: true,
                        boxFromPatches: {
                            showTransformed: true,
                            showTransformedBox: true,
                            showBB: true
                        }
                    }
                },

            }, function (err) {
                if (err) return console.log(err)
                console.log("Initialization finished. Ready to start");
                Quagga.start();
            });

            Quagga.onProcessed(function (result) {
                var drawingCtx = Quagga.canvas.ctx.overlay,
                    drawingCanvas = Quagga.canvas.dom.overlay;

                if (result) {
                    if (result.boxes) {
                        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                        result.boxes.filter(function (box) {
                            return box !== result.box;
                        }).forEach(function (box) {
                            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                        });
                    }

                    if (result.box) {
                        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                    }

                    if (result.codeResult && result.codeResult.code) {
                        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                    }
                }
            });

            Quagga.onDetected((result) => {
                Swal.fire({
                    type: 'success',
                    title: result.codeResult.code,
                    text: 'You\'re checked in!'
                })
                this.checkIn(result.codeResult.code)
                console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
            });
        }

        startScanner()
    }
}

export default App;
