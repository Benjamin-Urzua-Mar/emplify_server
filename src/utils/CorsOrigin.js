const modelPropiedad = require("../models/Propiedad")
const { CORS_ORIGIN } = require("./Constantes")

const CACHE_TTL_MS = 60 * 1000 // recarga los origenes desde la BD cada 60s

let cache = { origins: [], expira: 0 }

// Lee la propiedad CORS_ORIGIN; acepta varios origenes separados por coma
const obtenerOrigenes = async () => {
    if (Date.now() < cache.expira) return cache.origins
    try {
        const propiedad = await modelPropiedad.findOne({ id: CORS_ORIGIN }).lean()
        const origins = (propiedad?.value || "")
            .split(",")
            .map(o => o.trim().replace(/\/$/, ""))
            .filter(Boolean)
        cache = { origins, expira: Date.now() + CACHE_TTL_MS }
    } catch (error) {
        console.error("Error cargando CORS_ORIGIN desde BD:", error.message)
    }
    return cache.origins
}

// Funcion origin compatible con el paquete cors y con socket.io
const corsOrigin = (origin, callback) => {
    // Peticiones sin origin (curl, apps moviles, server-to-server)
    if (!origin) return callback(null, true)
    obtenerOrigenes()
        .then(origins => callback(null, origins.includes("*") || origins.includes(origin)))
        .catch(err => callback(err))
}

module.exports = { corsOrigin, obtenerOrigenes }
