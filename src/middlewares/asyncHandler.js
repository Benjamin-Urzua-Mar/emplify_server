// Envia al manejador de errores cualquier excepcion de un controlador async
const asyncHandler = controlador => (req, res, next) =>
    Promise.resolve(controlador(req, res, next)).catch(next)

module.exports = asyncHandler
