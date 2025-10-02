import axios from "axios";

const server = "http://localhost:3000"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const UsersServices = {

  async obtenerUsuarios() {
    try {
      const response = await axios.get(server + "/api/auth/registrar", {
        headers: getAuthHeaders(),
      })
      const data = response.data
      const usuariosArray = Array.isArray(data) ? data : (data.usuarios || data.data || [])
      
      return usuariosArray
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
      throw error
    }
  }

}