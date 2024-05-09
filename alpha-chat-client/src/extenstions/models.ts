export interface ResponseDTO {
    status: boolean,
    message: string,
    data: any
}

export interface User {
    id: number,
    fullName: string,
    email: string,
    status: string,
    avatar: string,
    roles: Array<string>
}
export interface Layout {
    sidebarSize: number,
    chatBoxSize: number
}

export interface MessageDTO {
    recipientId: number,
    content: string
}