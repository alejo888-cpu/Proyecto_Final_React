import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { UserServices } from '../Services/User.Services'

export const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate()

    // Maneja cambios en los inputs
    const ChangeData = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    // Maneja login
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const data = await UserServices.ListUser(formData)
            console.log("Respuesta del servidor:", data)

            if (data.token) {
                localStorage.setItem("token", data.token)
                alert("Inicio de sesión exitoso")
                navigate("/Dashboard")
            } else {
                alert(data.message || "Error al iniciar sesión")
            }
        } catch (error) {
            alert("Error: " + error)
        }
    }

    const handleRegister = (e) => {
        e.preventDefault()
        navigate("/register")
    }

    return (
        <div className='login-container'>
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <h2 className="login-title">Iniciar Sesión</h2>
                        <p className="login-subtitle">Bienvenido</p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input name='email' type='email' placeholder='tu@ejemplo.com' value={formData.email} onChange={ChangeData} className='form-input' required/>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Contraseña</label>
                            <input name='password' type='password' placeholder='••••••••' value={formData.password} onChange={ChangeData} className='form-input' required/>
                        </div>

                        <button type="submit" className="login-button">Iniciar Sesión</button>

                        <button type="button" onClick={handleRegister} className="login-button">Crear Cuenta</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
