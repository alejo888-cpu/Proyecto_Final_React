export const AuthService = {
  // Función para hacer login
  login: (email, password) => {
    try {
      // Obtener usuarios registrados del localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Buscar el usuario con email y contraseña coincidentes
      const user = users.find(u => u.Email === email && u.Password === password);
      
      if (user) {
        // Usuario encontrado - login exitoso
        return {
          success: true,
          user: {
            id: user.Id,
            nombre: user.Nombre,
            email: user.Email,
            rol: user.Rol
          },
          message: 'Login exitoso'
        };
      } else {
        // Usuario no encontrado o credenciales incorrectas
        return {
          success: false,
          message: 'Email o contraseña incorrectos'
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error al procesar el login'
      };
    }
  },

  // Función para validar si hay usuarios registrados
  hasUsers: () => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.length > 0;
    } catch (error) {
      return false;
    }
  },

  // Función para obtener todos los usuarios (para testing)
  getAllUsers: () => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch (error) {
      return [];
    }
  }
};