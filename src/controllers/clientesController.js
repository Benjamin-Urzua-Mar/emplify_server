const { crearLogin, logout } = require("./sesionController")
const { exito, sinResultados, consulta, operacion } = require("../views/respuesta")
const { primerNombre } = require("../utils/sesion")
const { TIPO_USUARIO } = require("../utils/Constantes")

const MENSAJES_BUSQUEDA = Object.freeze({
    encontrado: "Han habido coincidencias",
    noEncontrado: "No han habido coincidencias"
})

const crearClientesController = ({ authService, clienteService, especialistaService, trabajoService }) => ({
    login: crearLogin(authService, {
        campoIdentificador: "email",
        tipoUsuario: TIPO_USUARIO.CLIENTE,
        datosExtra: cliente => ({ userName: primerNombre(cliente.nombres) })
    }),

    logout,

    register: async (req, res) => {
        await clienteService.registrar(req.body)
        exito(res, "Registro exitoso")
    },

    getCuenta: async (req, res) => consulta(res, await clienteService.obtenerPorId(req.body._id)),

    editarCuenta: async (req, res) => {
        const { _id, ...cambios } = req.body
        const actualizado = await clienteService.actualizar(_id, cambios)
        operacion(res, actualizado, "Usuario actualizado correctamente", "No hubieron coincidencias")
    },

    solicitarTrabajo: async (req, res) => {
        const especialista = await trabajoService.solicitar(req.body)
        if (!especialista) return sinResultados(res, "No se ha hecho la reserva")
        exito(res, "Reserva concretada", { data: especialista })
    },

    buscarEspecialista: async (req, res) =>
        consulta(res, await especialistaService.buscar(req.body), MENSAJES_BUSQUEDA)
})

module.exports = crearClientesController
