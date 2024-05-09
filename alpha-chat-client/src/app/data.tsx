export interface Message {
    id?: number;
    sender: User;
    content: string;
    deleted: boolean;
}

export interface User {
    id: number;
    avatar: string;
    name: string;
    email: string;
}

export interface Chat {
    id: number;
    avatar: string;
    name: string;
    email: string;
    lastMessage: string;
}