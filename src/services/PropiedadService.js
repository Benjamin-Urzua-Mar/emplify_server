// Lee propiedades de configuracion desde base de datos con una cache en memoria
class PropiedadService {
    constructor(repositorio, { ttlMs }) {
        this.repositorio = repositorio
        this.ttlMs = ttlMs
        this.cache = new Map()
    }

    async listarPublicas() {
        const propiedades = await this.repositorio.buscarTodos({ publica: true }, "id value")
        return propiedades.map(({ id, value }) => ({ id, value }))
    }

    async obtenerPublica(clave) {
        const propiedad = await this.#obtener(clave)
        return propiedad?.publica ? { id: propiedad.id, value: propiedad.value } : null
    }

    // Valor separado por comas como lista, sin espacios ni "/" final
    async obtenerLista(clave) {
        const propiedad = await this.#obtener(clave)
        return (propiedad?.value ?? "")
            .split(",")
            .map(valor => valor.trim().replace(/\/$/, ""))
            .filter(Boolean)
    }

    // Si la base de datos falla se usa el ultimo valor conocido
    async #obtener(clave) {
        const enCache = this.cache.get(clave)
        if (enCache && Date.now() < enCache.expira) return enCache.propiedad

        try {
            const propiedad = await this.repositorio.buscarUno({ id: clave })
            this.cache.set(clave, { propiedad: propiedad?.toObject() ?? null, expira: Date.now() + this.ttlMs })
            return this.cache.get(clave).propiedad
        } catch (error) {
            console.error(`Error cargando la propiedad ${clave}:`, error.message)
            return enCache?.propiedad ?? null
        }
    }
}

module.exports = PropiedadService
