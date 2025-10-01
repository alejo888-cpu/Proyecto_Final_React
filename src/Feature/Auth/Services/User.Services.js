import axios from "axios"

const server = "http://localhost:3000"

export const UserServices = {

    async CreateUser(userData) {
        try {
            const { data } = await axios.post(server + "/api/auth/registrar", userData)
            return data
        } catch (error) {
            throw error.response?.data || error.message
        }
    },

    async ListUser(credentials) {
        try {
            const { data } = await axios.post(server + "/api/auth/login", credentials)
            return data
        } catch (error) {
            throw error.response?.data || error.message            
        }
    }

}