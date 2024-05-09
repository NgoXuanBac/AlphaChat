import api from "@/lib/api"
import { ResponseDTO } from "@/extenstions/models"




const getProfile = async () => {
    let response = await api.get<ResponseDTO>('user/profile')
    return response.data
}

const uploadProfile = async (name: string, avatarUrl: string) => {
    let response = await api.post<ResponseDTO>('user/update', { fullName: name, avatar: avatarUrl })
    return response.data
}


const userService = {
    getProfile,
    uploadProfile,
}

export default userService