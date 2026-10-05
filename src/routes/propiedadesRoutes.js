const { Router } = require("express")
const asyncHandler = require("../middlewares/asyncHandler")

const crearPropiedadesRoutes = propiedades => {
    const router = Router()

    router.get("/", asyncHandler(propiedades.listar))
    router.get("/:id", asyncHandler(propiedades.obtener))

    return router
}

module.exports = crearPropiedadesRoutes
