import { notification } from "antd";

export const initWebSocket = async (wsUri) => {
    const websocket = new WebSocket(wsUri);
    websocket.onerror = async () => {
        notification.error({
            message: 'Network exception',
            description: 'An exception has occurred in your network. Cannot connect to the server. Please refresh and try again after changing the network environment.',
            duration: null,
        });
        await websocket.close();
    };
    return websocket;
}