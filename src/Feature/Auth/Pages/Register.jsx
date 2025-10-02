import { useState } from "react";
import { UserServices } from "../Services/User.Services";
import './Register.css';
import { useNavigate } from "react-router-dom";

export const Register = () => {

    const [formData, setFormData] = useState({
        id: "",
        nombre: "",
        email: "",
        password: "",
        rol: ""
    })
    const navigate = useNavigate();

    const ChangeData = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newUser = await UserServices.CreateUser(formData)
            alert("Usuario registrado con éxito")
            setFormData({
                id: "",
                nombre: "",
                email: "",
                password: "",
                rol: ""
            })
            navigate("/")
        } catch (error) {
            alert(error.response?.data?.message || "Error al registrar usuario");
        }
    }

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-form-section">
                    <h2 className="register-title">Registro</h2>
                    <form onSubmit={handleSubmit} className="register-form">

                        <div className="form-group">
                            <label className="form-label">Documento:</label>
                            <input type="text" name="id" value={formData.id} onChange={ChangeData} className="form-input" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nombre:</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={ChangeData} className="form-input" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={ChangeData} className="form-input" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password:</label>
                            <input type="password" name="password" value={formData.password} onChange={ChangeData} className="form-input" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Rol:</label>
                            <select name="rol" value={formData.rol} onChange={ChangeData} className="form-input" required>
                                <option value="">-- Selecciona un rol --</option>
                                <option value="admin">Admin</option>
                                <option value="cliente">Usuario</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-button">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}