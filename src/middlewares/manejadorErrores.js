const ErrorNegocio = require("../errors/ErrorNegocio")
const { CODIGO } = require("../utils/Constantes")
const { enviar } = require("../views/respuesta")

// Express reconoce el middleware de errores por sus 4 parametros
const manejadorErrores = (error, req, res, next) => {
    if (error instanceof ErrorNegocio) {
        return enviar(res, error.codigo, error.message)
    }
    console.error("Ha ocurrido una excepción: ", error)
    enviar(res, CODIGO.EXCEPCION, `Ha ocurrido una excepción: ${error}`)
}

module.exports = manejadorErrores
