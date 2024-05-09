import axios from 'axios'
import { API_BASE_URL } from '../extenstions/constants'
import AuthService from '@/services/authService'


const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const { response, config } = error
        const status = response?.status

        if (status === 401 && !config._retry) {
            config._retry = true;
            try {
                await AuthService.refesh()
                console.log("==>Refresh access token successfully.")
                return axios(config)

            } catch (error) {
                console.log("==>Refresh token is expired. Please login again.")
                // return (window.location.href = "/login")
            }
        }
        return Promise.reject(error);
    }
)

export default api
