const { Router } = require("express")
const asyncHandler = require("../middlewares/asyncHandler")

const crearCatalogosRoutes = catalogos => {
    const router = Router()

    router.get("/comunas", asyncHandler(catalogos.listarComunas))
    router.get("/rubros", asyncHandler(catalogos.listarRubros))

    return router
}

module.exports = crearCatalogosRoutes
