const { PROPIEDAD } = require("../utils/Constantes")

// Funcion `origin` compatible con el paquete cors y con socket.io.
// Los origenes permitidos se leen desde la propiedad CORS_ORIGIN en base de datos.
const crearOrigenCors = propiedadService => (origin, callback) => {
    // Peticiones sin origin (curl, apps moviles, server-to-server)
    if (!origin) return callback(null, true)

    propiedadService.obtenerLista(PROPIEDAD.CORS_ORIGIN)
        .then(origenes => callback(null, origenes.includes("*") || origenes.includes(origin)))
        .catch(callback)
}

module.exports = crearOrigenCors
