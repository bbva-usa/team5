
export const NodeRedWs = () => {

    // TODO(chris77) - Move to config file.
    const wsHost = 'ws://34.70.173.43:1880/ws/front-end'

    return new WebSocket(wsHost)
}