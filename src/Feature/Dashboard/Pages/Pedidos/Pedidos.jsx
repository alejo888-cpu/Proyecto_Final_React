import { useState, useEffect } from "react";
import { ServicioPedidos } from "./Services/Services.Pedido.js";
import { Plus, Eye, Pencil, X } from "lucide-react";

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    // Pedido seleccionado
    const [selectedPedido, setSelectedPedido] = useState(null);

    // Formulario
    const [formData, setFormData] = useState({
        idPedido: "",
        idUsuario: "",
        estado: "activo",
        detalles: [],
    });

    // Cargar pedidos al inicio
    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const data = await ServicioPedidos.obtenerPedidos();
                setPedidos(data);
            } catch (err) {
                console.error("Error cargando pedidos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPedidos();
    }, []);

    // -------------------------
    // Funciones auxiliares
    // -------------------------
    const calculateTotal = () =>
        formData.detalles.reduce(
            (sum, d) => sum + Number(d.cantidad) * Number(d.precioUnitario),
            0
        );

    const handleAddDetalle = () => {
        setFormData({
            ...formData,
            detalles: [
                ...formData.detalles,
                { idProducto: "", cantidad: 1, precioUnitario: 0 },
            ],
        });
    };

    const handleDetalleChange = (i, field, value) => {
        const updated = [...formData.detalles];
        updated[i][field] = value;
        setFormData({ ...formData, detalles: updated });
    };

    const handleRemoveDetalle = (i) => {
        setFormData({
            ...formData,
            detalles: formData.detalles.filter((_, idx) => idx !== i),
        });
    };

    // -------------------------
    // CRUD
    // -------------------------
    const handleSubmitAdd = async () => {
        try {
            const nuevo = {
                ...formData,
                total: calculateTotal(),
                createdAt: new Date(),
            };
            const creado = await ServicioPedidos.crearPedido(nuevo);
            setPedidos([...pedidos, creado]);
            setShowAddModal(false);
        } catch (err) {
            console.error("Error creando pedido:", err);
        }
    };

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
    };

    const handleDelete = async (idPedido) => {
        if (!window.confirm("¿Eliminar este pedido?")) return;
        try {
            await ServicioPedidos.eliminarPedido(idPedido);
            setPedidos(pedidos.filter((p) => p.idPedido !== idPedido));
        } catch (err) {
            console.error("Error eliminando pedido:", err);
        }
    };

    // -------------------------
    // Render
    // -------------------------
    if (loading) return <p>Cargando pedidos...</p>;

    return (
        <div className="p-6 text-black m-[10px]">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-bold text-black">Gestión de Pedidos</h1>
                <button
                    onClick={() => {
                        setFormData({
                            idPedido: "",
                            idUsuario: "",
                            estado: "activo",
                            detalles: [],
                        });
                        setShowAddModal(true);
                    }}
                    className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg"
                >
                    <Plus size={18} className="mr-2" />
                    Nuevo Pedido
                </button>
            </div>

            {/* Tabla */}
            <table className="min-w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border text-black">ID Pedido</th>
                        <th className="p-2 border text-black">Usuario</th>
                        <th className="p-2 border text-black">Estado</th>
                        <th className="p-2 border text-black">Total</th>
                        <th className="p-2 border text-black">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((p) => (
                        <tr key={p.idPedido} className="border-t">
                            <td className="p-2 border text-black">{p.idPedido}</td>
                            <td className="p-2 border text-black">{p.idUsuario}</td>
                            <td className="p-2 border text-black">{p.estado}</td>
                            <td className="p-2 border text-black">${p.total?.toFixed(2)}</td>
                            <td className="p-2 border flex gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedPedido(p);
                                        setShowViewModal(true);
                                    }}
                                    className="text-blue-600"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData(p);
                                        setSelectedPedido(p);
                                        setShowEditModal(true);
                                    }}
                                    className="text-green-600"
                                >
                                    <Pencil size={18} />
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL: Agregar */}

            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-[600px] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-black">Agregar Nuevo Pedido (POST)</h2>
                            <button onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="ID Pedido"
                                className="border p-2 rounded"
                                value={formData.idPedido}
                                onChange={(e) =>
                                    setFormData({ ...formData, idPedido: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                placeholder="ID Usuario"
                                className="border p-2 rounded"
                                value={formData.idUsuario}
                                onChange={(e) =>
                                    setFormData({ ...formData, idUsuario: e.target.value })
                                }
                            />
                            <select
                                className="border p-2 rounded col-span-2"
                                value={formData.estado}
                                onChange={(e) =>
                                    setFormData({ ...formData, estado: e.target.value })
                                }
                            >
                                <option>activo</option>
                                <option>cancelado</option>
                            </select>
                        </div>

                        <h3 className="mt-4 font-semibold">Detalles del Pedido</h3>
                        {formData.detalles.map((d, i) => (
                            <div key={i} className="grid grid-cols-4 gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="IdProducto"
                                    className="border p-2 rounded"
                                    value={d.idProducto}
                                    onChange={(e) =>
                                        handleDetalleChange(i, "idProducto", e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    min="1"
                                    className="border p-2 rounded"
                                    value={d.cantidad}
                                    onChange={(e) =>
                                        handleDetalleChange(i, "cantidad", e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    min="0"
                                    className="border p-2 rounded"
                                    value={d.precioUnitario}
                                    onChange={(e) =>
                                        handleDetalleChange(i, "precioUnitario", e.target.value)
                                    }
                                />
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        ${(d.cantidad * d.precioUnitario).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveDetalle(i)}
                                        className="text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
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
                                onClick={handleSubmitAdd}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Crear Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Ver Detalles */}

            {showViewModal && selectedPedido && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-[600px] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Detalles del Pedido</h2>
                            <button onClick={() => setShowViewModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <p>
                            <strong>ID Pedido:</strong> {selectedPedido.idPedido}
                        </p>
                        <p>
                            <strong>Usuario:</strong> {selectedPedido.idUsuario}
                        </p>
                        <p>
                            <strong>Estado:</strong> {selectedPedido.estado}
                        </p>
                        <p>
                            <strong>Fecha:</strong>{" "}
                            {new Date(selectedPedido.createdAt).toLocaleDateString()}
                        </p>

                        <h3 className="mt-4 font-semibold">Productos</h3>
                        <table className="w-full border mt-2">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">ID Producto</th>
                                    <th className="border p-2">Cantidad</th>
                                    <th className="border p-2">Precio Unit.</th>
                                    <th className="border p-2">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedPedido.detalles.map((d, i) => (
                                    <tr key={i}>
                                        <td className="border p-2">{d.idProducto}</td>
                                        <td className="border p-2">{d.cantidad}</td>
                                        <td className="border p-2">
                                            ${Number(d.precioUnitario).toFixed(2)}
                                        </td>
                                        <td className="border p-2">
                                            ${(d.cantidad * d.precioUnitario).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 font-bold">
                            Total: ${selectedPedido.total?.toFixed(2)}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Editar */}

            {showEditModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-[600px] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Editar Pedido (PUT)</h2>
                            <button onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                className="border p-2 rounded"
                                value={formData.idPedido}
                                disabled
                            />
                            <input
                                type="text"
                                className="border p-2 rounded"
                                value={formData.idUsuario}
                                onChange={(e) =>
                                    setFormData({ ...formData, idUsuario: e.target.value })
                                }
                            />
                            <select
                                className="border p-2 rounded col-span-2"
                                value={formData.estado}
                                onChange={(e) =>
                                    setFormData({ ...formData, estado: e.target.value })
                                }
                            >
                                <option>activo</option>
                                <option>cancelado</option>
                            </select>
                        </div>

                        <h3 className="mt-4 font-semibold">Detalles del Pedido</h3>
                        {formData.detalles.map((d, i) => (
                            <div key={i} className="grid grid-cols-4 gap-2 mt-2">
                                <input
                                    type="text"
                                    className="border p-2 rounded"
                                    value={d.idProducto}
                                    onChange={(e) =>
                                        handleDetalleChange(i, "idProducto", e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    className="border p-2 rounded"
                                    value={d.cantidad}
                                    onChange={(e) =>
                                        handleDetalleChange(i, "cantidad", e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    className="border p-2 rounded"
                                    value={d.precioUnitario}
                                    onChange={(e) =>
                                        handleDetalleChange(i, "precioUnitario", e.target.value)
                                    }
                                />
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        ${(d.cantidad * d.precioUnitario).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveDetalle(i)}
                                        className="text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
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