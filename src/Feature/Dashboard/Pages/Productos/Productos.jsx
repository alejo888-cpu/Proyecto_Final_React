import { useEffect, useState } from "react";
import { ProductosServices } from "./Services/Products.Services.js";
import { Trash, Pencil, Plus } from "lucide-react";

function Productos() {

    const [productos, setProductos] = useState([])
    const [abrirCrear, setAbrirCrear] = useState(false)
    const [abrirEditar, setAbrirEditar] = useState(false)

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
                await ProductosServices.crearProducto(formulario);
                alert("Producto creado correctamente");
                setAbrirCrear(false);
                obtenerProductos();
                setProductoSeleccionado(null);
            }
        } catch (error) {
            console.error(error);
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

    return (
        <>
            <div className="min-h-screen text-black m-[50px]">
                <div className="flex justify-between px-3 pb-6">
                    <h1 className="text-2xl font-semibold text-black">Administración de productos</h1>
                    <div className="flex items-center bg-green-400 hover:bg-green-500 px-3 py-2 rounded-lg text-white font-bold cursor-pointer gap-1">
                        <Plus />
                        <button type="button" onClick={() => setAbrirCrear(true)}>Nuevo Producto</button>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="border border-gray-200 px-2 py-3">ID</th>
                            <th className="border border-gray-200 px-2 py-3">Producto</th>
                            <th className="border border-gray-200 px-2 py-3">Descripción</th>
                            <th className="border border-gray-200 px-2 py-3">Precio</th>
                            <th className="border border-gray-200 px-2 py-3">Stock</th>
                            <th className="border border-gray-200 px-2 py-3">Categoría</th>
                            <th className="border border-gray-200 px-2 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.idProducto} className="hover:bg-gray-100">
                                <td className="border px-3 py-3 text-black">{producto.idProducto}</td>
                                <td className="border px-3 py-3 text-black">{producto.nombre}</td>
                                <td className="border px-3 py-3 text-black">{producto.descripcion}</td>
                                <td className="border px-3 py-3 text-black">$ {producto.precio}</td>
                                <td className="border px-3 py-3 text-black">{producto.stock}</td>
                                <td className="border px-3 py-3 text-black">{producto.categoria}</td>
                                <td className="border px-3 py-3">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            className="p-2 text-blue-600 hover:bg-blue-200 rounded-lg"
                                            onClick={() => {
                                                setProductoSeleccionado(producto);
                                                setFormulario(producto);
                                                setAbrirEditar(true);
                                            }}
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-red-600 hover:bg-red-200 rounded-lg"
                                            onClick={() => eliminarProducto(producto.idProducto)}
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

            {/* Modal Crear */}
            {abrirCrear && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                    <div className="bg-white rounded-2xl w-96 p-6">
                        <h2 className="text-xl font-bold mb-6 text-black">Registrar nuevo producto</h2>
                        <form className="flex flex-col gap-3" onSubmit={manejarFormulario}>
                            <input type="text" placeholder="ID" name="idProducto" onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="text" placeholder="Nombre" name="nombre" onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="text" placeholder="Descripción" name="descripcion" onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="number" placeholder="Precio" name="precio" onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="number" placeholder="Stock" name="stock" onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="text" placeholder="Categoría" name="categoria" onChange={manejarInput} required className="border p-2 rounded-lg text-black" />

                            <div className="flex justify-center gap-3 mt-4">
                                <button type="button" onClick={() => setAbrirCrear(false)} className="bg-gray-500 px-4 py-2 rounded-lg text-white">Cancelar</button>
                                <button type="submit" className="bg-green-500 px-4 py-2 rounded-lg text-white">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar */}
            {abrirEditar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                    <div className="bg-white rounded-2xl w-96 p-6">
                        <h2 className="text-xl font-bold mb-6 text-black">Modificar producto</h2>
                        <form className="flex flex-col gap-3" onSubmit={manejarFormulario}>
                            <input type="text" name="idProducto" value={formulario.idProducto} onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="text" name="nombre" value={formulario.nombre} onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="text" name="descripcion" value={formulario.descripcion} onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="number" name="precio" value={formulario.precio} onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="number" name="stock" value={formulario.stock} onChange={manejarInput} required className="border p-2 rounded-lg text-black" />
                            <input type="text" name="categoria" value={formulario.categoria} onChange={manejarInput} required className="border p-2 rounded-lg text-black" />

                            <div className="flex justify-center gap-3 mt-4">
                                <button type="button" onClick={() => setAbrirEditar(false)} className="bg-gray-500 px-4 py-2 rounded-lg text-white">Cancelar</button>
                                <button type="submit" className="bg-green-500 px-4 py-2 rounded-lg text-white">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Productos;