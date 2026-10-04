const BaseRepository = require("./BaseRepository")
const Especialista = require("../models/Especialista")

class EspecialistaRepository extends BaseRepository {
    constructor() {
        super(Especialista, { relaciones: ["comuna", "rubro"] })
    }

    agregarSolicitudTrabajo(especialistaId, solicitud) {
        return this.actualizarPorId(especialistaId, { $push: { solicitudes_trabajo: solicitud } })
    }

    registrarTrabajoAceptado(especialistaId, solicitudesPendientes, trabajoId) {
        return this.actualizarPorId(especialistaId, {
            $set: { solicitudes_trabajo: solicitudesPendientes },
            $push: { "perfil.trabajosRealizados": trabajoId }
        })
    }
}

module.exports = EspecialistaRepository
