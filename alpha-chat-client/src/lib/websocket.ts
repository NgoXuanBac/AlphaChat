import { WS_BASE_URL } from '@/extenstions/constants';
import SockJS from 'sockjs-client';
import Stomp, { Client } from 'stompjs';

export class websocket {
    private client: Client | null = null
    private isConnected = false

    constructor() {
        const socket = new SockJS(WS_BASE_URL)
        this.client = Stomp.over(socket)
    }

    public connect(onConnected: () => void) {
        if (!this.client) return
        this.client.connect({}, onConnected)
        this.isConnected = true
    }

    public disconnect(onDisconnected: () => void) {
        if (!this.client || !this.isConnected) return;
        this.client.disconnect(onDisconnected)
        this.isConnected = false
    }

    public subscribe(topic: string, onReceive: (response: any) => void) {
        if (!this.client || !this.isConnected) return null
        return this.client.subscribe(topic, (message) => {
            onReceive(JSON.parse(message.body))
        })
    }
    public unsubcribe(topic: string) {
        if (!this.client || !this.isConnected) return
        this.client.unsubscribe(topic);
    }

    public send(destination: string, message: any) {
        if (!this.client) return
        this.client.send(destination, {}, JSON.stringify(message))
    }
}
