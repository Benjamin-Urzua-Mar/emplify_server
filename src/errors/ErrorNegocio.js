// Error esperado de una regla de negocio; se responde al front con su codigo y mensaje
class ErrorNegocio extends Error {
    constructor(codigo, mensaje) {
        super(mensaje)
        this.name = "ErrorNegocio"
        this.codigo = codigo
    }
}

module.exports = ErrorNegocio
