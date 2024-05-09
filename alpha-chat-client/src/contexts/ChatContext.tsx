import { Chat } from "@/app/data";
import Loading from "@/app/loading";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import chatService from "@/services/chatService";
import { Spinner } from "@material-tailwind/react";
import _ from "lodash";
import React, { useEffect } from "react";
import { createContext } from "react";


export interface ChatContextType {
    selectedChat?: Chat,
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | undefined>>,
    chats: Chat[],
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>

}

const initialState: ChatContextType = {
    chats: [],
    setSelectedChat: () => null,
    setChats: () => null,
}


export const ChatContext = createContext<ChatContextType>(initialState)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { websocket } = useSocket()
    const { user } = useAuth()

    const [selectedChat, setSelectedChat] = React.useState<Chat>()
    const [chats, setChats] = React.useState<Chat[]>([])
    const [loading, setLoading] = React.useState(true)


    useEffect(() => {
        const loadChats = async () => {
            try {
                const response = await chatService.getChats()
                setChats(response.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        };
        const onMessageReceived = (response: any) => {
            const message = response.message
            console.log(message);

            const newChat: Chat = {
                id: message.sender.id,
                name: message.sender.name,
                avatar: message.sender.avatar,
                email: message.sender.email,
                lastMessage: message.content
            }

            setChats(chats => {
                if (chats.length > 0 && newChat.id == chats[0].id) return chats;

                const existingIndex = _.findIndex(chats, { id: newChat.id })

                if (existingIndex !== -1) {
                    chats.splice(existingIndex, 1)
                }

                return ([newChat, ...chats])
            })
        }

        if (!websocket || !user) return
        const subRe = websocket.subscribe(`/user/${user.id}/private`, onMessageReceived)

        loadChats();
        return () => {
            subRe?.unsubscribe()
        }
    }, [])


    if (loading) return (<div className="flex justify-center items-center w-full h-full" ><Spinner /></div >)
    return (
        <ChatContext.Provider value={{ selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    )
}



