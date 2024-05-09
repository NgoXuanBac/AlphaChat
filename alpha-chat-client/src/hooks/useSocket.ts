
import { WebSocketContext } from "@/contexts/SocketContext";
import { useContext } from "react";

export function useSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("Auth context must be inside AuthProvider")
    }
    return context
}