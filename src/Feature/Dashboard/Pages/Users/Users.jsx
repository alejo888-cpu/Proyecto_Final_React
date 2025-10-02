import { useEffect, useState } from "react";
import { UsersServices } from "./Services/Users.Services";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                setError(null);
                const usuariosArray = await UsersServices.obtenerUsuarios();
                setUsuarios(usuariosArray);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
                setError("Error al cargar usuarios");
            }
        };
        
        cargarUsuarios();
    }, [])

    return (
        <div className="min-h-screen text-black m-[10px]">
            <div className="px-3 pb-6">
                <h1 className="text-2xl font-semibold text-black">Lista de Usuarios</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-300">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="border border-gray-300 px-4 py-3 text-center">ID</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Nombre</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Email</th>
                            <th className="border border-gray-300 px-4 py-3 text-center">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error ? (
                            <tr>
                                <td colSpan="4" className="border border-gray-300 px-4 py-8 text-center text-red-600">
                                    {error}
                                </td>
                            </tr>
                        ) : usuarios.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="border border-gray-300 px-4 py-8 text-center text-black">
                                    No hay usuarios para mostrar
                                </td>
                            </tr>
                        ) : (
                            usuarios.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-3 text-black text-center">{usuario.id}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-black">{usuario.nombre}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-black">{usuario.email}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-black text-center">
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${usuario.rol === 'admin'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {usuario.rol}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Usuarios;