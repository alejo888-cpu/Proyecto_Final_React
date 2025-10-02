import { useEffect, useState } from "react";
import { UsersServices } from "./Services/Users.Services";
import { Users, Shield, UserCheck, AlertTriangle, Eye, Mail, Crown, User } from "lucide-react";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [usuarioViewing, setUsuarioViewing] = useState(null);

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
    }, []);

    // Funciones para estadísticas
    const getTotalUsuarios = () => usuarios.length;
    const getAdministradores = () => usuarios.filter(u => u.rol === 'admin').length;
    const getUsuariosRegulares = () => usuarios.filter(u => u.rol !== 'admin').length;
    const getPorcentajeAdmins = () => {
        if (usuarios.length === 0) return 0;
        return ((getAdministradores() / usuarios.length) * 100).toFixed(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            👥 Gestión de Usuarios
                        </h1>
                        <p className="text-gray-600 mt-2">Administra y visualiza todos los usuarios del sistema</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>Total: {getTotalUsuarios()} usuarios</span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 relative z-10">
                    <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Desktop Table */}
            <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden relative z-10">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Rol</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-lg font-medium">No hay usuarios para mostrar</p>
                                        <p className="text-sm">Los usuarios aparecerán aquí una vez que se registren</p>
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{usuario.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-medium text-sm">
                                                        {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{usuario.nombre}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                {usuario.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                usuario.rol === 'admin'
                                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                                    : 'bg-green-100 text-green-800 border border-green-200'
                                            }`}>
                                                {usuario.rol === 'admin' ? (
                                                    <Crown className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <User className="h-3 w-3 mr-1" />
                                                )}
                                                {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => {
                                                        setUsuarioViewing(usuario);
                                                        setShowViewModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 relative z-10">
                {usuarios.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg border border-white/20">
                        <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900 mb-2">No hay usuarios para mostrar</p>
                        <p className="text-sm text-gray-600">Los usuarios aparecerán aquí una vez que se registren</p>
                    </div>
                ) : (
                    usuarios.map((usuario) => (
                        <div key={usuario.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium">
                                            {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-semibold text-gray-900">{usuario.nombre}</h3>
                                        <p className="text-sm text-gray-500">#{usuario.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setUsuarioViewing(usuario);
                                        setShowViewModal(true);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                >
                                    <Eye size={16} />
                                </button>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                    {usuario.email}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        usuario.rol === 'admin'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {usuario.rol === 'admin' ? (
                                            <Crown className="h-3 w-3 mr-1" />
                                        ) : (
                                            <User className="h-3 w-3 mr-1" />
                                        )}
                                        {usuario.rol === 'admin' ? 'Admin' : 'Usuario'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Ver Usuario */}
            {showViewModal && usuarioViewing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    👤 Detalles del Usuario
                                    <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        #{usuarioViewing.id}
                                    </span>
                                </h2>
                                <p className="text-gray-600 mt-1">Información completa del usuario</p>
                            </div>
                            <button 
                                onClick={() => setShowViewModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Eye size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center mb-6">
                                <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">
                                        {usuarioViewing.nombre ? usuarioViewing.nombre.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">{usuarioViewing.nombre}</h3>
                                <p className="text-gray-600">ID de Usuario: #{usuarioViewing.id}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Correo Electrónico
                                </label>
                                <p className="text-lg font-medium text-gray-900">{usuarioViewing.email}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    {usuarioViewing.rol === 'admin' ? (
                                        <Crown className="h-4 w-4 mr-2" />
                                    ) : (
                                        <User className="h-4 w-4 mr-2" />
                                    )}
                                    Rol del Sistema
                                </label>
                                <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                                    usuarioViewing.rol === 'admin'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {usuarioViewing.rol === 'admin' ? (
                                        <Crown className="h-4 w-4 mr-2" />
                                    ) : (
                                        <User className="h-4 w-4 mr-2" />
                                    )}
                                    {usuarioViewing.rol === 'admin' ? 'Administrador' : 'Usuario Regular'}
                                </span>
                            </div>

                            {usuarioViewing.rol === 'admin' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 text-red-500 mr-2" />
                                        <p className="text-sm text-red-700 font-medium">
                                            Este usuario tiene privilegios de administrador
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Usuarios;