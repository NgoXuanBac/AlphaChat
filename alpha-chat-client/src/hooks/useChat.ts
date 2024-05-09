import { ChatContext } from "@/contexts/ChatContext";
import { useContext } from "react";

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("Auth context must be inside AuthProvider")
    }
    return context
}