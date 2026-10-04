// Claves de la tabla Propiedad
const PROPIEDAD = Object.freeze({
    CORS_ORIGIN: "CORS_ORIGIN"
})

// Codigos que el front interpreta en el campo `codigo` de cada respuesta
const CODIGO = Object.freeze({
    EXITO: 1,
    SIN_RESULTADOS: 2,
    CONTRASENA_INCORRECTA: 2,
    USUARIO_INEXISTENTE: 3,
    ERROR_ARCHIVOS: 3,
    EXCEPCION: 10
})

const ESTADO_TRABAJO = Object.freeze({
    ACTIVO: "Activo",
    TERMINADO: "Terminado"
})

const TIPO_USUARIO = Object.freeze({
    ADMIN: "Admin",
    CLIENTE: "Cliente",
    ESPECIALISTA: "Especialista"
})

module.exports = { PROPIEDAD, CODIGO, ESTADO_TRABAJO, TIPO_USUARIO }
