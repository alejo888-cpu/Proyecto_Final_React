import { useState, useEffect } from "react"
import { ServicioPedidos } from "./Services/Services.Pedido.js"
import { ProductosServices } from "../Productos/Services/Products.Services.js"
import { Plus, Eye, Pencil, X, FileText } from "lucide-react"

const customStyles = `
@keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
`

// Agregar estilos al documento
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = customStyles
    document.head.appendChild(styleSheet)
}

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([])
    const [loading, setLoading] = useState(true)

    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedPedido, setSelectedPedido] = useState(null)

    const [formData, setFormData] = useState({
        idPedido: "",
        idUsuario: "",
        estado: "activo",
        detalles: [],
    })

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const data = await ServicioPedidos.obtenerPedidos();
                setPedidos(data)
            } catch (err) {
                console.error("Error cargando pedidos:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchPedidos()
    }, [])


    const calculateTotal = () => {
        return formData.detalles.reduce(
            (sum, d) => sum + Number(d.cantidad) * Number(d.precioUnitario),
            0
        )
    }

    const handleAddDetalle = () => {
        setFormData({
            ...formData,
            detalles: [
                ...formData.detalles,
                { idProducto: "", cantidad: 1, precioUnitario: 0 },
            ],
        })
    }

    const handleDetalleChange = async (i, field, value) => {
        const updated = [...formData.detalles]
        updated[i][field] = value

        if (field === "idProducto" && value.trim() !== "") {
            try {
                const producto = await ProductosServices.obtenerProductoPorId(value)
                updated[i]["precioUnitario"] = producto.precio || 0
            } catch (error) {
                console.error("Error al obtener producto:", error)
                updated[i]["precioUnitario"] = 0
            }
        }

        setFormData({ ...formData, detalles: updated })
    }

    const handleRemoveDetalle = (i) => {
        setFormData({
            ...formData,
            detalles: formData.detalles.filter((_, idx) => idx !== i),
        })
    }

    const generarSiguienteId = () => {
        if (pedidos.length === 0) {
            return "1"
        }

        const idsNumericos = pedidos
            .map(p => parseInt(p.idPedido))
            .filter(id => !isNaN(id))
            .sort((a, b) => b - a)

        const maxId = idsNumericos.length > 0 ? idsNumericos[0] : 0
        return String(maxId + 1)
    }


    const handleSubmitAdd = async () => {
        try {
            const nuevo = {
                ...formData,
                total: calculateTotal(),
                createdAt: new Date(),
            };
            const creado = await ServicioPedidos.crearPedido(nuevo)
            setPedidos([...pedidos, creado])
            setShowAddModal(false)
        } catch (err) {
            console.error("Error creando pedido:", err)
        }
    }

    const handleSubmitEdit = async () => {
        try {
            const actualizado = {
                ...formData,
                total: calculateTotal(),
                createdAt: selectedPedido.createdAt,
            };
            await ServicioPedidos.actualizarPedido(formData.idPedido, actualizado);
            setPedidos(
                pedidos.map((p) => (p.idPedido === formData.idPedido ? actualizado : p))
            );
            setShowEditModal(false);
        } catch (err) {
            console.error("Error actualizando pedido:", err);
        }
    }

    const handleDelete = async (idPedido) => {
        if (!window.confirm("¿Eliminar este pedido?")) return;
        try {
            await ServicioPedidos.eliminarPedido(idPedido);
            setPedidos(pedidos.filter((p) => p.idPedido !== idPedido));
        } catch (err) {
            console.error("Error eliminando pedido:", err);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Gestión de Pedidos</h1>
                        <p className="text-gray-600 mt-2 text-lg">💼 Administra todos los pedidos del sistema de forma eficiente</p>
                    </div>
                    <button
                        onClick={() => {
                            const siguienteId = generarSiguienteId();
                            setFormData({
                                idPedido: siguienteId,
                                idUsuario: "",
                                estado: "activo",
                                detalles: [],
                            });
                            setShowAddModal(true);
                        }}
                        className="group relative flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                        <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-semibold">✨ Nuevo Pedido</span>
                    </button>
                </div>

            {/* Tabla */}
            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-4">
                {pedidos.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <FileText size={40} className="text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 ¡Comienza tu aventura!</h3>
                        <p className="text-gray-600 mb-6">No hay pedidos aún. ¡Crea tu primer pedido y comienza a gestionar!</p>
                        <button
                            onClick={() => {
                                const siguienteId = generarSiguienteId();
                                setFormData({
                                    idPedido: siguienteId,
                                    idUsuario: "",
                                    estado: "activo",
                                    detalles: [],
                                });
                                setShowAddModal(true);
                            }}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <Plus size={20} className="mr-2" />
                            🚀 Crear Mi Primer Pedido
                        </button>
                    </div>
                ) : pedidos.map((p) => (
                    <div key={p.idPedido} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-blue-500">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">#{p.idPedido}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Pedido #{p.idPedido}</h3>
                                        <p className="text-gray-600 text-sm">👤 {p.idUsuario}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    p.estado === 'activo' 
                                        ? 'bg-green-100 text-green-700 border border-green-200' 
                                        : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                    {p.estado === 'activo' ? '✅ Activo' : '❌ Cancelado'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-2xl font-bold text-green-600">
                                    💰 ${p.total?.toFixed(2)}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedPedido(p);
                                            setShowViewModal(true);
                                        }}
                                        className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200"
                                        title="Ver detalles"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFormData(p);
                                            setSelectedPedido(p);
                                            setShowEditModal(true);
                                        }}
                                        className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-200"
                                        title="Editar pedido"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-xl">
                <table className="min-w-full table-auto">
                    <thead className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white">
                        <tr>
                            <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                                🆔 ID Pedido
                            </th>
                            <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                                👤 Usuario
                            </th>
                            <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                                📊 Estado
                            </th>
                            <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                                💰 Total
                            </th>
                            <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-wider">
                                ⚡ Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pedidos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <FileText size={32} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
                                        <p className="text-gray-500 mb-4">Comienza creando tu primer pedido</p>
                                        <button
                                            onClick={() => {
                                                const siguienteId = generarSiguienteId();
                                                setFormData({
                                                    idPedido: siguienteId,
                                                    idUsuario: "",
                                                    estado: "activo",
                                                    detalles: [],
                                                });
                                                setShowAddModal(true);
                                            }}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus size={18} className="mr-2" />
                                            Crear Primer Pedido
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : pedidos.map((p) => (
                            <tr key={p.idPedido} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">#{p.idPedido}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                    <div className="text-sm text-gray-900">{p.idUsuario}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                        p.estado === 'activo' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {p.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-green-600">
                                        ${p.total?.toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedPedido(p);
                                                setShowViewModal(true);
                                            }}
                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200"
                                            title="Ver detalles"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFormData(p);
                                                setSelectedPedido(p);
                                                setShowEditModal(true);
                                            }}
                                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-all duration-200"
                                            title="Editar pedido"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">🆕 Agregar Nuevo Pedido</h2>
                                <p className="text-gray-600 mt-1">Crea un nuevo pedido en el sistema</p>
                            </div>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        🆔 ID del Pedido
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border-2 border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-800 font-medium"
                                        value={formData.idPedido}
                                        readOnly
                                        title="ID generado automáticamente"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Generado automáticamente</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        👤 Documento del Usuario *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese el documento del usuario"
                                        className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-lg text-gray-800 transition-colors"
                                        value={formData.idUsuario}
                                        onChange={(e) =>
                                            setFormData({ ...formData, idUsuario: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    📊 Estado del Pedido
                                </label>
                                <select
                                    className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-lg text-gray-800 transition-colors"
                                    value={formData.estado}
                                    onChange={(e) =>
                                        setFormData({ ...formData, estado: e.target.value })
                                    }
                                >
                                    <option value="activo">✅ Activo</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                🛒 Detalles del Pedido
                                <span className="ml-2 text-sm text-gray-500">({formData.detalles.length} productos)</span>
                            </h3>
                            
                            {formData.detalles.length === 0 ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <p className="text-gray-500 mb-2">🛍️ No hay productos agregados</p>
                                    <p className="text-sm text-gray-400">Haz clic en "Agregar Producto" para comenzar</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {formData.detalles.map((d, i) => (
                                        <div key={i} className="bg-gray-50 p-4 rounded-lg border">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">ID Producto</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ej: PROD001"
                                                        className="w-full border-2 border-gray-200 focus:border-blue-500 p-2 rounded text-gray-800 transition-colors"
                                                        value={d.idProducto}
                                                        onChange={(e) =>
                                                            handleDetalleChange(i, "idProducto", e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        placeholder="1"
                                                        className="w-full border-2 border-gray-200 focus:border-blue-500 p-2 rounded text-gray-800 transition-colors"
                                                        value={d.cantidad}
                                                        onChange={(e) =>
                                                            handleDetalleChange(i, "cantidad", e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Precio Unitario</label>
                                                    <div className="flex items-center">
                                                        <span className="text-sm text-gray-500 mr-1">$</span>
                                                        <span className="font-semibold text-green-600">
                                                            {d.precioUnitario?.toFixed(2) || '0.00'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">Auto-calculado</p>
                                                </div>
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Subtotal</label>
                                                        <span className="text-lg font-bold text-blue-600">
                                                            ${(d.cantidad * d.precioUnitario).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveDetalle(i)}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Eliminar producto"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={handleAddDetalle}
                            className="mt-4 w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                        >
                            <Plus size={20} className="mr-2" />
                            🛍️ Agregar Producto
                        </button>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-sm text-gray-600">Total del Pedido</p>
                                    <span className="text-2xl font-bold text-green-600">
                                        💰 ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmitAdd}
                                        disabled={!formData.idUsuario || formData.detalles.length === 0}
                                        className="flex-1 sm:flex-none flex items-center justify-center bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg transition-all font-medium disabled:cursor-not-allowed"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        🚀 Crear Pedido
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showViewModal && selectedPedido && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    👁️ Detalles del Pedido
                                    <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        #{selectedPedido.idPedido}
                                    </span>
                                </h2>
                                <p className="text-gray-600 mt-1">Información completa del pedido seleccionado</p>
                            </div>
                            <button 
                                onClick={() => setShowViewModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Información General */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">🆔</span>
                                    </div>
                                    <div>
                                        <p className="text-blue-800 text-sm font-medium">ID Pedido</p>
                                        <p className="text-blue-900 text-lg font-bold">#{selectedPedido.idPedido}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">👤</span>
                                    </div>
                                    <div>
                                        <p className="text-green-800 text-sm font-medium">Usuario</p>
                                        <p className="text-green-900 text-lg font-bold">{selectedPedido.idUsuario}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">📅</span>
                                    </div>
                                    <div>
                                        <p className="text-purple-800 text-sm font-medium">Fecha</p>
                                        <p className="text-purple-900 text-lg font-bold">
                                            {new Date(selectedPedido.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estado del Pedido */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-700 font-medium">Estado:</span>
                                <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
                                    selectedPedido.estado === 'activo' 
                                        ? 'bg-green-100 text-green-800 border-2 border-green-200' 
                                        : 'bg-red-100 text-red-800 border-2 border-red-200'
                                }`}>
                                    {selectedPedido.estado === 'activo' ? '✅ Activo' : '❌ Cancelado'}
                                </span>
                            </div>
                        </div>

                        {/* Lista de Productos */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                🛒 Productos del Pedido
                                <span className="ml-2 text-sm text-gray-500">({selectedPedido.detalles.length} productos)</span>
                            </h3>
                            
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-bold">🏷️ ID Producto</th>
                                                <th className="px-6 py-4 text-center text-sm font-bold">📦 Cantidad</th>
                                                <th className="px-6 py-4 text-center text-sm font-bold">💰 Precio Unit.</th>
                                                <th className="px-6 py-4 text-center text-sm font-bold">🧮 Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedPedido.detalles.map((d, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <span className="text-blue-600 text-xs font-bold">{i + 1}</span>
                                                            </div>
                                                            <span className="font-medium text-gray-900">{d.idProducto}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                                                            {d.cantidad} unidades
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="text-green-600 font-semibold">
                                                            ${Number(d.precioUnitario).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="text-lg font-bold text-blue-600">
                                                            ${(d.cantidad * d.precioUnitario).toFixed(2)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Total Final */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-green-700 text-sm font-medium">Total del Pedido</p>
                                    <p className="text-green-900 text-sm">Incluye todos los productos</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-green-600 flex items-center">
                                        💰 ${selectedPedido.total?.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    ✏️ Editar Pedido
                                    <span className="ml-3 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                                        #{formData.idPedido}
                                    </span>
                                </h2>
                                <p className="text-gray-600 mt-1">Modifica la información del pedido seleccionado</p>
                            </div>
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        🆔 ID del Pedido
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border-2 border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-800 font-medium cursor-not-allowed"
                                        value={formData.idPedido}
                                        disabled
                                        title="No se puede editar el ID del pedido"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Campo no editable</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        👤 Documento del Usuario *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese el documento del usuario"
                                        className="w-full border-2 border-gray-200 focus:border-orange-500 p-3 rounded-lg text-gray-800 transition-colors"
                                        value={formData.idUsuario}
                                        onChange={(e) =>
                                            setFormData({ ...formData, idUsuario: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    📊 Estado del Pedido
                                </label>
                                <select
                                    className="w-full border-2 border-gray-200 focus:border-orange-500 p-3 rounded-lg text-gray-800 transition-colors"
                                    value={formData.estado}
                                    onChange={(e) =>
                                        setFormData({ ...formData, estado: e.target.value })
                                    }
                                >
                                    <option value="activo">✅ Activo</option>
                                    <option value="cancelado">❌ Cancelado</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                ✏️ Editar Detalles del Pedido
                                <span className="ml-2 text-sm text-gray-500">({formData.detalles.length} productos)</span>
                            </h3>
                            
                            {formData.detalles.length === 0 ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <p className="text-gray-500 mb-2">🛍️ No hay productos agregados</p>
                                    <p className="text-sm text-gray-400">Haz clic en "Agregar Producto" para comenzar</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {formData.detalles.map((d, i) => (
                                        <div key={i} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">ID Producto</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ej: PROD001"
                                                        className="w-full border-2 border-gray-200 focus:border-orange-500 p-2 rounded text-gray-800 transition-colors"
                                                        value={d.idProducto}
                                                        onChange={(e) =>
                                                            handleDetalleChange(i, "idProducto", e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        placeholder="1"
                                                        className="w-full border-2 border-gray-200 focus:border-orange-500 p-2 rounded text-gray-800 transition-colors"
                                                        value={d.cantidad}
                                                        onChange={(e) =>
                                                            handleDetalleChange(i, "cantidad", e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">Precio Unitario</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        className="w-full border-2 border-gray-200 focus:border-orange-500 p-2 rounded text-gray-800 transition-colors"
                                                        value={d.precioUnitario}
                                                        onChange={(e) =>
                                                            handleDetalleChange(i, "precioUnitario", e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Subtotal</label>
                                                        <span className="text-lg font-bold text-orange-600">
                                                            ${(d.cantidad * d.precioUnitario).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveDetalle(i)}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Eliminar producto"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleAddDetalle}
                            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            + Agregar
                        </button>

                        <div className="flex justify-between items-center mt-4">
                            <span className="font-bold">
                                Total: ${calculateTotal().toFixed(2)}
                            </span>
                            <button
                                onClick={handleSubmitEdit}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
    )
}

export default Pedidos
