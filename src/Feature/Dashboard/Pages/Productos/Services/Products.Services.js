import axios from "axios";

const server = "http://localhost:3000";

// Función para obtener headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const ProductosServices = {
 
  // OBTENER TODOS LOS PRODUCTOS
 
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

  // OBTENER PRODUCTO POR ID
  
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

  // CREAR PRODUCTO
  async crearProducto(producto) {
    try {
      const response = await axios.post(server + "/api/productos", producto, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },

  
  // ACTUALIZAR PRODUCTO

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

  // ELIMINAR PRODUCTO
  
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