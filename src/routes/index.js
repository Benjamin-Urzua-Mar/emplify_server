const { Router } = require("express")
const asyncHandler = require("../middlewares/asyncHandler")
const crearAdminRoutes = require("./adminRoutes")
const crearEspecialistasRoutes = require("./especialistasRoutes")
const crearClientesRoutes = require("./clientesRoutes")
const crearPropiedadesRoutes = require("./propiedadesRoutes")
const crearCatalogosRoutes = require("./catalogosRoutes")

const crearRutas = controladores => {
    const router = Router()

    router.use("/admin", crearAdminRoutes(controladores.admin))
    router.use("/especialistas", crearEspecialistasRoutes(controladores.especialistas))
    router.use("/clientes", crearClientesRoutes(controladores.clientes))
    router.use("/propiedades", crearPropiedadesRoutes(controladores.propiedades))
    router.use("/", crearCatalogosRoutes(controladores.catalogos))
    router.post("/buscar", asyncHandler(controladores.clientes.buscarEspecialista))

    return router
}

module.exports = crearRutas
