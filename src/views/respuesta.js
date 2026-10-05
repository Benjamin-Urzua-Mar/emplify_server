const { CODIGO } = require("../utils/Constantes")

// Vista de la API: todas las respuestas usan HTTP 200 y el front interpreta `codigo`
const enviar = (res, codigo, msg, extra = {}) => res.status(200).json({ codigo, msg, ...extra })

const exito = (res, msg, extra) => enviar(res, CODIGO.EXITO, msg, extra)

const sinResultados = (res, msg, extra) => enviar(res, CODIGO.SIN_RESULTADOS, msg, extra)

const MENSAJES_CONSULTA = Object.freeze({
    encontrado: "Hubieron coincidencias",
    noEncontrado: "No hubieron coincidencias"
})

const hayDatos = datos => (Array.isArray(datos) ? datos.length > 0 : datos != null)

// Responde con los datos encontrados o con codigo SIN_RESULTADOS si no hay
const consulta = (res, datos, mensajes = MENSAJES_CONSULTA) => (hayDatos(datos)
    ? exito(res, mensajes.encontrado, { data: datos })
    : sinResultados(res, mensajes.noEncontrado))

// Responde segun si la operacion modifico algun documento
const operacion = (res, resultado, msgExito, msgFallo = "Algo ha ocurrido. No hubieron cambios") => (resultado
    ? exito(res, msgExito)
    : sinResultados(res, msgFallo))

module.exports = { enviar, exito, sinResultados, consulta, operacion, MENSAJES_CONSULTA }
