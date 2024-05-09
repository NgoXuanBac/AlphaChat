import api from "@/lib/api"
import { MessageDTO, ResponseDTO } from "@/extenstions/models"

const findByEmail = async (email: string) => {
    var response = await api.get<ResponseDTO>('user/' + email)
    return response.data
}
const getChats = async () => {
    var response = await api.get<ResponseDTO>('user/chats')
    return response.data
}
const makeChats = async (chatId: number) => {
    var response = await api.post<ResponseDTO>('user/chat/' + chatId)
    return response.data
}

const removeChat = async (chatId: number) => {
    var response = await api.delete<ResponseDTO>('user/chat/' + chatId)
    return response.data
}

const getMessages = async (recipientId: number) => {
    var response = await api.get<ResponseDTO>('messages/' + recipientId)
    return response.data
}

const sendMessages = async (message: any) => {
    var response = await api.post<ResponseDTO>('messages/send', message)
    return response.data
}

const removeMessage = async (id: number) => {
    var response = await api.delete<ResponseDTO>('messages/' + id)
    return response.data
}

const chatService = {
    findByEmail,
    getChats,
    getMessages,
    sendMessages,
    removeMessage,
    makeChats,
    removeChat
}

export default chatService