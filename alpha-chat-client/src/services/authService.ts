import api from "@/lib/api"
import { ResponseDTO } from "@/extenstions/models"


const login = async (email: string, password: string) => {
    var response = await api.post<ResponseDTO>("/auth/login", { email, password })
    return response.data
}

const signup = async (email: string, password: string) => {
    var response = await api.post<ResponseDTO>("/auth/signup", { email, password })
    return response.data
}

const signout = async () => {
    var response = await api.post<ResponseDTO>("/auth/logout")
    return response.data
}

const refesh = async () => {
    var response = await api.post<ResponseDTO>('auth/refresh')
    return response.data
}

const forgotPassword = async (email: string) => {
    const response = await api.post<ResponseDTO>('/auth/forgot', { email })
    return response.data
}

const resetPassword = async (password: string, token: string) => {
    const response = await api.post<ResponseDTO>('/auth/reset', { code: token, newPassword: password })
    return response.data
}

const verifyRegister = async (token: string | null) => {
    const response = await api.post<ResponseDTO>('/auth/verify', { code: token })
    return response.data
}

const AuthService = {
    login,
    signup,
    signout,
    refesh,
    forgotPassword,
    resetPassword,
    verifyRegister
}

export default AuthService 