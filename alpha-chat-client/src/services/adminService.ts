import api from "@/lib/api"
import { ResponseDTO } from "@/extenstions/models"



const getAll = async () => {
    const response = await api.get<ResponseDTO>('/admin/users')
    return response.data
}
const deleteUser = async (id: number) => {
    const response = await api.delete<ResponseDTO>(`/admin/user/delete/${id}`)
    return response.data
}
const getUser = async (id: number) => {
    const response = await api.get<ResponseDTO>(`/admin/user/${id}`)
    return response.data
}
const updateUser = async (request: any) => {
    const response = await api.put<ResponseDTO>('/admin/user/update', request)
    return response.data
}

const addUser = async (request: any) => {
    const response = await api.post<ResponseDTO>('/admin/user/add', request)
    return response.data
}

const adminService = {
    getAll,
    deleteUser,
    getUser,
    updateUser,
    addUser
}

export default adminService