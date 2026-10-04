// Operaciones comunes a clientes y especialistas
class UsuarioService {
    constructor(repositorio) {
        this.repositorio = repositorio
    }

    listar() {
        return this.repositorio.buscarTodos()
    }

    obtenerPorId(id) {
        return this.repositorio.buscarPorId(id)
    }

    actualizar(id, cambios) {
        return this.repositorio.actualizarPorId(id, cambios)
    }

    cambiarEstado(id, activo) {
        return this.repositorio.actualizarPorId(id, { estado: activo })
    }

    eliminar(id) {
        return this.repositorio.eliminarPorId(id)
    }
}

module.exports = UsuarioService
