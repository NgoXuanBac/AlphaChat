import { User } from "@/extenstions/models";

export interface AuthState {
    isAuthenticated?: boolean,
    isInitialized?: boolean,
    user: User | null
}