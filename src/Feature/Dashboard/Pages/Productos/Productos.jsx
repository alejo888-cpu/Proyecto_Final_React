import { useEffect, useState } from "react";
import { ProductosServices } from "./Services/Products.Services.js";
import { Trash, Pencil, Plus, Package, TrendingUp, DollarSign, AlertTriangle, X, Eye } from "lucide-react";

function Productos() {

    const [productos, setProductos] = useState([])
    const [abrirCrear, setAbrirCrear] = useState(false)
    const [abrirEditar, setAbrirEditar] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [productoViewing, setProductoViewing] = useState(null)

    const [formulario, setFormulario] = useState({
        idProducto: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: ""
    })

    const [productoSeleccionado, setProductoSeleccionado] = useState(null)

    const manejarInput = (e) => {
        const { name, value } = e.target
        setFormulario({
            ...formulario,
            [name]: value
        })
    };

    const manejarFormulario = async (e) => {
        e.preventDefault();
        
        try {
            if (productoSeleccionado) {
                await ProductosServices.actualizarProducto(productoSeleccionado.idProducto, formulario);
                alert("Producto modificado correctamente");
                setAbrirEditar(false);
                obtenerProductos();
                setProductoSeleccionado(null);
            } else {
                const resultado = await ProductosServices.crearProducto(formulario);
                alert("Producto creado correctamente");
                setAbrirCrear(false);
                obtenerProductos();
                setProductoSeleccionado(null);
            }
        } catch (error) {
            console.error("❌ Error al procesar formulario:", error);
            alert("Error: " + (error.response?.data?.message || error.message || "Error desconocido"));
        }
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async () => {
        try {
            const response = await ProductosServices.obtenerProductos();
            setProductos(response);
        } catch (error) {
            console.error(error);
        }
    };

    const eliminarProducto = async (idProducto) => {
        try {
            await ProductosServices.eliminarProducto(idProducto);
            alert(" Producto eliminado correctamente");
            obtenerProductos();
        } catch (error) {
            console.error(error);
        }
    };

    // Funciones para estadísticas
    const getTotalProductos = () => productos.length;
    const getStockBajo = () => productos.filter(p => p.stock < 10).length;
    const getPromedioPrecios = () => {
        if (productos.length === 0) return 0;
        const total = productos.reduce((sum, p) => sum + parseFloat(p.precio || 0), 0);
        return (total / productos.length).toFixed(2);
    };
    const getValorInventario = () => {
        return productos.reduce((sum, p) => sum + (parseFloat(p.precio || 0) * parseInt(p.stock || 0)), 0).toFixed(2);
    };

    const resetearFormulario = () => {
        setFormulario({
            idProducto: "",
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            categoria: ""
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                📦 Gestión de Productos
                            </h1>
                            <p className="text-gray-600 mt-2">Administra tu inventario de forma eficiente</p>
                        </div>
                        <button 
                            onClick={() => {
                                resetearFormulario();
                                setAbrirCrear(true);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <Plus size={20} />
                            Nuevo Producto
                        </button>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Producto</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Precio</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Categoría</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {productos.map((producto) => (
                                    <tr key={producto.idProducto} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{producto.idProducto}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{producto.nombre}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{producto.descripcion}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                                                ${producto.precio}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium ${
                                                producto.stock < 10 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : producto.stock < 20 
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {producto.stock} unidades
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
                                                {producto.categoria}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setProductoViewing(producto);
                                                        setShowViewModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setProductoSeleccionado(producto);
                                                        setFormulario(producto);
                                                        setAbrirEditar(true);
                                                    }}
                                                    className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => eliminarProducto(producto.idProducto)}
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {productos.map((producto) => (
                        <div key={producto.idProducto} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>
                                    <p className="text-sm text-gray-500">#{producto.idProducto}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setProductoViewing(producto);
                                            setShowViewModal(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setProductoSeleccionado(producto);
                                            setFormulario(producto);
                                            setAbrirEditar(true);
                                        }}
                                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => eliminarProducto(producto.idProducto)}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{producto.descripcion}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                                    ${producto.precio}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                                    producto.stock < 10 
                                        ? 'bg-red-100 text-red-800' 
                                        : producto.stock < 20 
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    Stock: {producto.stock}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                                    {producto.categoria}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Crear Producto */}
            {abrirCrear && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    ✨ Nuevo Producto
                                </h2>
                                <p className="text-gray-600 mt-1">Añade un nuevo producto a tu inventario</p>
                            </div>
                            <button 
                                onClick={() => setAbrirCrear(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={manejarFormulario} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ID del Producto</label>
                                    <input
                                        type="text"
                                        name="idProducto"
                                        value={formulario.idProducto}
                                        onChange={manejarInput}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Ej: PROD001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formulario.nombre}
                                        onChange={manejarInput}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Nombre del producto"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formulario.descripcion}
                                    onChange={manejarInput}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Describe las características del producto..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio ($)</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formulario.precio}
                                        onChange={manejarInput}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formulario.stock}
                                        onChange={manejarInput}
                                        required
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                                    <input
                                        type="text"
                                        name="categoria"
                                        value={formulario.categoria}
                                        onChange={manejarInput}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Ej: Electrónicos"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setAbrirCrear(false)}
                                    className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 sm:flex-none flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all font-medium"
                                >
                                    <Plus size={18} className="mr-2" />
                                    ✨ Crear Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar Producto */}
            {abrirEditar && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    ✏️ Editar Producto
                                    <span className="ml-3 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                                        #{formulario.idProducto}
                                    </span>
                                </h2>
                                <p className="text-gray-600 mt-1">Modifica la información del producto seleccionado</p>
                            </div>
                            <button 
                                onClick={() => setAbrirEditar(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={manejarFormulario} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ID del Producto</label>
                                    <input
                                        type="text"
                                        name="idProducto"
                                        value={formulario.idProducto}
                                        onChange={manejarInput}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formulario.nombre}
                                        onChange={manejarInput}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formulario.descripcion}
                                    onChange={manejarInput}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio ($)</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formulario.precio}
                                        onChange={manejarInput}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formulario.stock}
                                        onChange={manejarInput}
                                        required
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                                    <input
                                        type="text"
                                        name="categoria"
                                        value={formulario.categoria}
                                        onChange={manejarInput}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setAbrirEditar(false)}
                                    className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 sm:flex-none flex items-center justify-center bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all font-medium"
                                >
                                    <Pencil size={18} className="mr-2" />
                                    ✏️ Actualizar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Ver Producto */}
            {showViewModal && productoViewing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    👁️ Detalles del Producto
                                    <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        #{productoViewing.idProducto}
                                    </span>
                                </h2>
                                <p className="text-gray-600 mt-1">Información completa del producto</p>
                            </div>
                            <button 
                                onClick={() => setShowViewModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">{productoViewing.nombre}</h3>
                                <p className="text-gray-600">{productoViewing.descripcion}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 rounded-lg p-3">
                                    <label className="block text-sm font-medium text-green-700 mb-1">Precio</label>
                                    <p className="text-xl font-bold text-green-800">${productoViewing.precio}</p>
                                </div>
                                <div className={`rounded-lg p-3 ${
                                    productoViewing.stock < 10 
                                        ? 'bg-red-50' 
                                        : productoViewing.stock < 20 
                                        ? 'bg-yellow-50'
                                        : 'bg-green-50'
                                }`}>
                                    <label className={`block text-sm font-medium mb-1 ${
                                        productoViewing.stock < 10 
                                            ? 'text-red-700' 
                                            : productoViewing.stock < 20 
                                            ? 'text-yellow-700'
                                            : 'text-green-700'
                                    }`}>Stock Disponible</label>
                                    <p className={`text-xl font-bold ${
                                        productoViewing.stock < 10 
                                            ? 'text-red-800' 
                                            : productoViewing.stock < 20 
                                            ? 'text-yellow-800'
                                            : 'text-green-800'
                                    }`}>{productoViewing.stock} unidades</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-3">
                                <label className="block text-sm font-medium text-blue-700 mb-1">Categoría</label>
                                <p className="text-lg font-semibold text-blue-800">{productoViewing.categoria}</p>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-3">
                                <label className="block text-sm font-medium text-purple-700 mb-1">Valor Total en Stock</label>
                                <p className="text-xl font-bold text-purple-800">
                                    ${(parseFloat(productoViewing.precio) * parseInt(productoViewing.stock)).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setProductoSeleccionado(productoViewing);
                                    setFormulario(productoViewing);
                                    setAbrirEditar(true);
                                }}
                                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all"
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Productos;