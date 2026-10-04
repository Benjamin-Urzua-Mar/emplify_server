// Configuracion central. Los valores por defecto mantienen el comportamiento actual;
// en produccion se recomienda definirlos como variables de entorno.
const env = Object.freeze({
    puerto: Number(process.env.PORT) || 4000,
    host: process.env.HOST || "127.0.0.1",
    mongoUri: process.env.MONGO_URI || "mongodb://benjaminUrzua:benjaminUrzua@127.0.0.1:27017/emplify",
    sessionSecret: process.env.SESSION_SECRET || "workit",
    propiedadesCacheTtlMs: Number(process.env.PROPIEDADES_CACHE_TTL_MS) || 60 * 1000
})

module.exports = env
