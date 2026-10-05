const { Router } = require("express")
const asyncHandler = require("../middlewares/asyncHandler")

const crearClientesRoutes = clientes => {
    const router = Router()

    router.post("/login", asyncHandler(clientes.login))
    router.post("/register", asyncHandler(clientes.register))
    router.post("/logout", asyncHandler(clientes.logout))
    router.post("/getCuenta", asyncHandler(clientes.getCuenta))
    router.post("/editarCuenta", asyncHandler(clientes.editarCuenta))
    router.post("/solicitarTrabajo", asyncHandler(clientes.solicitarTrabajo))

    return router
}

module.exports = crearClientesRoutes
