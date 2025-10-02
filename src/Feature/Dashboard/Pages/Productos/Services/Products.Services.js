import axios from "axios";

const server = "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

export const ProductosServices = {
 
  async obtenerProductos() {
    try {
      const response = await axios.get(server + "/api/productos", {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  async obtenerProductoPorId(idProducto) {
    try {
      const response = await axios.get(
        `${server}/api/productos/${idProducto}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener producto ${idProducto}:`, error);
      throw error;
    }
  },

  async crearProducto(producto) {
    try {
      const response = await axios.post(server + "/api/productos", producto, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear producto:", error);
      console.error("📊 Status:", error.response?.status);
      console.error("📝 Mensaje:", error.response?.data);
      throw error;
    }
  },

  async actualizarProducto(idProducto, producto) {
    try {
      const response = await axios.put(
        `${server}/api/productos/${idProducto}`,
        producto,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar producto ${idProducto}:`, error);
      throw error;
    }
  },

  async eliminarProducto(idProducto) {
    try {
      const response = await axios.delete(
        `${server}/api/productos/${idProducto}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar producto ${idProducto}:`, error);
      throw error;
    }
  },
};