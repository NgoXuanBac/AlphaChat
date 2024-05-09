import Loading from '@/app/loading';
import { websocket } from '@/lib/websocket';
import React, { createContext, useState, useEffect } from 'react';

interface WebSocketContextType {
    websocket: websocket | null;
}

export const WebSocketContext = createContext<WebSocketContextType>({ websocket: null });

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<websocket | null>(null);


    useEffect(() => {
        const ws = new websocket();

        const onConnected = () => {
            setSocket(ws);
        };

        ws.connect(onConnected);

        return () => {
            socket && ws.disconnect(() => console.log("Disconnect to websocket server"));
        };
    }, []);

    if (socket == null) return <Loading />
    return (
        <WebSocketContext.Provider value={{ websocket: socket }}>
            {children}
        </WebSocketContext.Provider>
    );
};