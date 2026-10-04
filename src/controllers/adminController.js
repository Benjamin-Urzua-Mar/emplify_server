const { crearLogin, logout } = require("./sesionController")
const { consulta, operacion } = require("../views/respuesta")
const { TIPO_USUARIO } = require("../utils/Constantes")

// Acciones de moderacion identicas para clientes y especialistas
const crearModeracion = usuarioService => ({
    listar: async (req, res) => consulta(res, await usuarioService.listar()),

    obtener: async (req, res) => consulta(res, await usuarioService.obtenerPorId(req.body.id)),

    cambiarEstado: async (req, res) => {
        const banear = req.body.operacion === "ban"
        const resultado = await usuarioService.cambiarEstado(req.body.id, !banear)
        operacion(res, resultado, banear ? "Usuario baneado" : "Usuario desbaneado")
    },

    eliminar: async (req, res) => operacion(res, await usuarioService.eliminar(req.body.id), "Usuario eliminado")
})

const crearAdminController = ({ authService, clienteService, especialistaService }) => ({
    login: crearLogin(authService, { campoIdentificador: "user", tipoUsuario: TIPO_USUARIO.ADMIN }),
    logout,
    clientes: crearModeracion(clienteService),
    especialistas: crearModeracion(especialistaService)
})

module.exports = crearAdminController
