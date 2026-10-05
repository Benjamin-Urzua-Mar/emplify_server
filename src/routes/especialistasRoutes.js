const { Router } = require("express")
const asyncHandler = require("../middlewares/asyncHandler")

const crearEspecialistasRoutes = especialistas => {
    const router = Router()

    router.post("/login", asyncHandler(especialistas.login))
    router.post("/register", asyncHandler(especialistas.register))
    router.post("/editarPerfil", asyncHandler(especialistas.editarPerfil))
    router.post("/getPerfil", asyncHandler(especialistas.getPerfil))
    router.post("/getSolicitudesTrabajos", asyncHandler(especialistas.getSolicitudesTrabajos))
    router.post("/aceptarTrabajo", asyncHandler(especialistas.aceptarTrabajo))
    router.post("/trabajosEnCurso", asyncHandler(especialistas.trabajosEnCurso))
    router.post("/trabajosTerminados", asyncHandler(especialistas.trabajosTerminados))
    router.post("/finalizarTrabajo", asyncHandler(especialistas.finalizarTrabajo))
    router.post("/logout", asyncHandler(especialistas.logout))

    return router
}

module.exports = crearEspecialistasRoutes
