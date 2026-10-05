// Catalogos de referencia (comunas, rubros): listado y resolucion de FK
const ES_OBJECT_ID = /^[0-9a-f]{24}$/i

// Orden alfabetico en español, sin distinguir mayusculas ni tildes
const COLACION_ES = { locale: "es", strength: 1 }

class CatalogoService {
    constructor(repositorio) {
        this.repositorio = repositorio
    }

    listar(filtro = {}) {
        return this.repositorio.buscarTodos(filtro, undefined, { sort: { nombre: 1 }, collation: COLACION_ES })
    }

    // Acepta el _id o el nombre (sin distinguir mayusculas ni tildes); devuelve el _id o null
    async resolverId(valor) {
        if (typeof valor !== "string" || valor.trim() === "") return null

        const filtro = ES_OBJECT_ID.test(valor) ? { _id: valor } : { nombre: valor.trim() }
        const registro = await this.repositorio.buscarUno(filtro, "_id", { collation: COLACION_ES })
        return registro?._id ?? null
    }
}

module.exports = CatalogoService
