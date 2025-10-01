import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Building, FileText, Bell, Settings, Users, LogOut } from "lucide-react";

export const Sidebar = () => {
    const [open, setOpen] = useState(true)
    const location = useLocation()

    const handleLogout = () => {
        window.location.href = '/'
    }

    const isActive = (path) => {
        return location.pathname === path;
    }

    // Función para obtener las clases de un enlace
    const getLinkClasses = (path) => {
        const baseClasses = `flex items-center ${open ? 'gap-3' : 'justify-center'} p-3 rounded-lg transition-colors`
        const activeClasses = isActive(path)
            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
            : 'hover:bg-gray-100 text-gray-600'
        return `${baseClasses} ${activeClasses}`
    }

    return (
        <div className={`${open ? "w-64" : "w-20"} bg-white h-screen shadow-md transition-all duration-300 flex flex-col flex-shrink-0`}>

            {/* Header con Logo y Toggle */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white hover:text-white transition-colors"
                    >
                        <span className="text-sm font-bold">{open ? "‹" : "›"}</span>
                    </button>
                </div>
            </div>

            {/* Navegación Principal */}
            <nav className="flex-1 py-4">
                <div className={`${open ? 'px-3' : 'px-2'} space-y-1`}>
                    <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
                        <Home size={20} />
                        {open && <span>Inicio</span>}
                    </Link>

                    <Link to="/dashboard/Productos" className={getLinkClasses('/dashboard/Productos')}>
                        <Building size={20} />
                        {open && <span>Productos</span>}
                    </Link>

                    <Link to="/dashboard/Pedidos" className={getLinkClasses('/dashboard/Pedidos')}>
                        <FileText size={20} />
                        {open && <span>Pedidos</span>}
                    </Link>
                </div>

                {/* Sección de configuración */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className={`${open ? 'px-3' : 'px-2'} space-y-1`}>
                        <Link to="/dashboard/alertas" className={getLinkClasses('/dashboard/alertas')}>
                            <Bell size={20} />
                            {open && <span>Alertas</span>}
                        </Link>

                        <Link to="/dashboard/configuracion" className={getLinkClasses('/dashboard/configuracion')}>
                            <Settings size={20} />
                            {open && <span>Configuración</span>}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Footer con Usuario */}
            <div className="border-t border-gray-200 p-4">
                {/* Botón de cerrar sesión */}
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center ${open ? 'gap-2 px-3' : 'justify-center px-1'} py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200`}
                >
                    <LogOut size={16} />
                    {open && <span>Cerrar Sesión</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;