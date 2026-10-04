// Acceso a datos generico sobre un modelo de mongoose.
// `relaciones` son las referencias (FK) que se cargan con populate en cada consulta.
class BaseRepository {
    constructor(modelo, { relaciones = [] } = {}) {
        this.modelo = modelo
        this.relaciones = relaciones
    }

    buscarTodos(filtro = {}, campos, opciones) {
        return this.#poblar(this.modelo.find(filtro, campos, opciones)).exec()
    }

    buscarUno(filtro, campos, opciones) {
        return this.#poblar(this.modelo.findOne(filtro, campos, opciones)).exec()
    }

    buscarPorId(id, campos) {
        return this.#poblar(this.modelo.findById(id, campos)).exec()
    }

    crear(datos) {
        return this.modelo.create(datos)
    }

    // `id ?? null` evita que un id ausente se convierta en un filtro vacio que afecte otro documento
    actualizarPorId(id, cambios) {
        return this.#poblar(this.modelo.findOneAndUpdate({ _id: id ?? null }, cambios)).exec()
    }

    actualizarUno(filtro, cambios) {
        return this.#poblar(this.modelo.findOneAndUpdate(filtro, cambios)).exec()
    }

    eliminarPorId(id) {
        return this.modelo.findOneAndDelete({ _id: id ?? null }).exec()
    }

    #poblar(consulta) {
        return this.relaciones.length > 0 ? consulta.populate(this.relaciones) : consulta
    }
}

module.exports = BaseRepository
