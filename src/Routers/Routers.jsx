import { Route, Routes } from "react-router-dom";
import { Login } from "../Feature/Auth/Pages/Login";
import { Register } from "../Feature/Auth/Pages/Register";
import { Dashboard } from "../Feature/Dashboard/layout";
import Productos from "../Feature/Dashboard/Pages/Productos/Productos";
import Pedidos from "../Feature/Dashboard/Pages/Pedidos/Pedidos";
import Usuarios from "../Feature/Dashboard/Pages/Users/Users";

export const RouterApp = () => {

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Dashboard" element={<Dashboard />}>
                <Route path="Productos" element={<Productos />} />
                <Route path="Pedidos" element={<Pedidos />} />
                <Route path="Usuarios" element={<Usuarios />} />
            </Route>
        </Routes>
    )

}