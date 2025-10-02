import axios from "axios";

const server = "http://localhost:3000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return token
        ? { Authorization: `Bearer ${token}` }
        : {}
}

const getHeaders = () => ({
    "Content-Type": "application/json",
    ...getAuthHeaders(),
})

export const ServicioPedidos = {
    obtenerPedidos: async () => {
        const { data } = await axios.get(`${server}/api/pedidos`, {
            headers: getHeaders(),
        })
        return data
    },

    obtenerPedidoPorId: async (idPedido) => {
        const { data } = await axios.get(`${server}/api/pedidos/${idPedido}`, {
            headers: getHeaders(),
        })
        return data
    },

    crearPedido: async (pedido) => {
        const { data } = await axios.post(`${server}/api/pedidos`, pedido, {
            headers: getHeaders(),
        })
        return data
    },

    actualizarPedido: async (idPedido, pedido) => {
        const { data } = await axios.put(`${server}/api/pedidos/${idPedido}`, pedido, {
            headers: getHeaders(),
        });
        return data;
    },

    eliminarPedido: async (idPedido) => {
        const { data } = await axios.delete(`${server}/api/pedidos/${idPedido}`, {
            headers: getHeaders(),
        })
        return data;
    },
}

export default ServicioPedidos