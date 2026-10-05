const { ESTADO_TRABAJO } = require("../utils/Constantes")

class TrabajoService {
    constructor({ trabajoRepository, especialistaRepository, clienteRepository }) {
        this.trabajos = trabajoRepository
        this.especialistas = especialistaRepository
        this.clientes = clienteRepository
    }

    solicitar(solicitud) {
        return this.especialistas.agregarSolicitudTrabajo(solicitud.especialista, solicitud)
    }

    async listarSolicitudes(especialistaId) {
        const especialista = await this.especialistas.buscarPorId(especialistaId, "solicitudes_trabajo")
        if (!especialista) return null

        const solicitudes = especialista.solicitudes_trabajo
        const nombres = await this.#nombresDeClientes(solicitudes.map(s => s?.cliente).filter(Boolean))
        // Entradas sin cliente (p. ej. ids sueltos) se devuelven sin modificar
        return solicitudes.map(solicitud => (solicitud?.cliente === undefined
            ? solicitud
            : { ...solicitud, nombreCliente: nombres.get(String(solicitud.cliente)) ?? "" }))
    }

    // Crea el trabajo, actualiza las solicitudes pendientes y lo agrega al perfil del especialista
    async aceptar(trabajo, solicitudesPendientes) {
        const especialista = await this.especialistas.buscarPorId(trabajo.especialista, "_id")
        if (!especialista) return false

        const nuevoTrabajo = await this.trabajos.crear(trabajo)
        await this.especialistas.registrarTrabajoAceptado(trabajo.especialista, solicitudesPendientes, nuevoTrabajo._id)
        return true
    }

    listarEnCurso(especialistaId) {
        return this.#listarPorEstado(especialistaId, ESTADO_TRABAJO.ACTIVO)
    }

    listarTerminados(especialistaId) {
        return this.#listarPorEstado(especialistaId, ESTADO_TRABAJO.TERMINADO)
    }

    finalizar(trabajoId) {
        return this.trabajos.actualizarPorId(trabajoId, { estado: ESTADO_TRABAJO.TERMINADO })
    }

    async #listarPorEstado(especialistaId, estado) {
        const trabajos = await this.trabajos.buscarTodos({ especialista: especialistaId, estado })
        const nombres = await this.#nombresDeClientes(trabajos.map(t => t.cliente))
        return trabajos.map(trabajo => ({ ...trabajo.toObject(), nombreCliente: nombres.get(String(trabajo.cliente)) ?? "" }))
    }

    // Una sola consulta para todos los clientes: Map<idCliente, "Nombres Apellidos">
    async #nombresDeClientes(ids) {
        const clientes = await this.clientes.buscarTodos({ _id: { $in: ids } }, "nombres apellidos")
        return new Map(clientes.map(c => [String(c._id), `${c.nombres} ${c.apellidos}`]))
    }
}

module.exports = TrabajoService
