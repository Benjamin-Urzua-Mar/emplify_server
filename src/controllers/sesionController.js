const { iniciarSesion, cerrarSesion } = require("../utils/sesion")
const { exito } = require("../views/respuesta")

// Login comun: autentica, abre la sesion y agrega los datos propios de cada tipo de usuario
const crearLogin = (authService, { campoIdentificador, tipoUsuario, datosExtra = () => ({}) }) =>
    async (req, res) => {
        const usuario = await authService.autenticar(req.body[campoIdentificador], req.body.contrasena)
        await iniciarSesion(req, usuario._id)
        exito(res, "Sesión iniciada con éxito", {
            ...datosExtra(usuario),
            sessionId: req.session.user,
            tipoUsuario
        })
    }

const logout = async (req, res) => {
    await cerrarSesion(req)
    exito(res, "Sesión cerrada con éxito")
}

module.exports = { crearLogin, logout }
