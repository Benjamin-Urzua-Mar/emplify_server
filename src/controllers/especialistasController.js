const { crearLogin, logout } = require("./sesionController")
const { exito, sinResultados, operacion, MENSAJES_CONSULTA } = require("../views/respuesta")
const { primerNombre } = require("../utils/sesion")
const { TIPO_USUARIO, CODIGO } = require("../utils/Constantes")
const ErrorNegocio = require("../errors/ErrorNegocio")
const { CARPETAS, parsearFormulario, crearNombradorDocumentos, nombrarFotoPerfil } = require("../utils/formulario")

const leerFormulario = async (req, carpeta, nombrarArchivo) => {
    try {
        return await parsearFormulario(req, carpeta, nombrarArchivo)
    } catch (error) {
        throw new ErrorNegocio(CODIGO.ERROR_ARCHIVOS, `Hubo un problema al subir los archivos: ${error}`)
    }
}

const responderTrabajos = (res, trabajos, msgSinTrabajos) => (trabajos.length > 0
    ? exito(res, "Trabajos encontrados", { data: trabajos })
    : sinResultados(res, msgSinTrabajos, { data: trabajos }))

const crearEspecialistasController = ({ authService, especialistaService, trabajoService }) => ({
    login: crearLogin(authService, {
        campoIdentificador: "email",
        tipoUsuario: TIPO_USUARIO.ESPECIALISTA,
        datosExtra: especialista => ({
            userName: primerNombre(especialista.nombres),
            fotoPerfil: especialista.perfil?.foto
        })
    }),

    logout,

    register: async (req, res) => {
        const { campos, archivos } = await leerFormulario(req, CARPETAS.documentos, crearNombradorDocumentos())
        await especialistaService.registrar(campos, archivos)
        exito(res, "Registro exitoso")
    },

    editarPerfil: async (req, res) => {
        const { campos, archivos } = await leerFormulario(req, CARPETAS.imagenes, nombrarFotoPerfil)
        const actualizado = await especialistaService.configurarPerfil(campos, archivos)
        operacion(res, actualizado, "Perfil configurado con éxito.", "Problema encontrando al usuario")
    },

    getPerfil: async (req, res) => {
        const foto = await especialistaService.obtenerFotoPerfil(req.body._id)
        exito(res, "Ok", { data: foto })
    },

    getSolicitudesTrabajos: async (req, res) => {
        const solicitudes = await trabajoService.listarSolicitudes(req.body._id)
        if (!solicitudes) return sinResultados(res, MENSAJES_CONSULTA.noEncontrado)
        exito(res, "Ok", { data: solicitudes })
    },

    aceptarTrabajo: async (req, res) => {
        const aceptado = await trabajoService.aceptar(req.body.trabajo, req.body.solicitudes)
        operacion(res, aceptado, "Trabajo creado", "Algo ha ocurrido al actualizar solicitudes. No hubieron cambios")
    },

    trabajosEnCurso: async (req, res) =>
        responderTrabajos(res, await trabajoService.listarEnCurso(req.body._id), "No hay trabajos en curso"),

    trabajosTerminados: async (req, res) =>
        responderTrabajos(res, await trabajoService.listarTerminados(req.body._id), "No hay trabajos terminados"),

    finalizarTrabajo: async (req, res) =>
        operacion(res, await trabajoService.finalizar(req.body._id), "Trabajo terminado", MENSAJES_CONSULTA.noEncontrado)
})

module.exports = crearEspecialistasController
