const { Router } = require("express")
const asyncHandler = require("../middlewares/asyncHandler")

const crearAdminRoutes = admin => {
    const router = Router()

    router.post("/login", asyncHandler(admin.login))
    router.post("/logout", asyncHandler(admin.logout))
    router.get("/retornarClientes", asyncHandler(admin.clientes.listar))
    router.post("/retornarCliente", asyncHandler(admin.clientes.obtener))
    router.post("/banCliente", asyncHandler(admin.clientes.cambiarEstado))
    router.post("/deleteCliente", asyncHandler(admin.clientes.eliminar))
    router.get("/retornarEspecialistas", asyncHandler(admin.especialistas.listar))
    router.post("/retornarEspecialista", asyncHandler(admin.especialistas.obtener))
    router.post("/banEspecialista", asyncHandler(admin.especialistas.cambiarEstado))
    router.post("/deleteEspecialista", asyncHandler(admin.especialistas.eliminar))

    return router
}

module.exports = crearAdminRoutes
