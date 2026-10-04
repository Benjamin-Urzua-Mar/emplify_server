const { exito, sinResultados, consulta } = require("../views/respuesta")

const crearPropiedadesController = ({ propiedadService }) => ({
    listar: async (req, res) => consulta(res, await propiedadService.listarPublicas()),

    obtener: async (req, res) => {
        const propiedad = await propiedadService.obtenerPublica(req.params.id)
        if (!propiedad) return sinResultados(res, "Propiedad no encontrada")
        exito(res, "Propiedad encontrada", { data: propiedad })
    }
})

module.exports = crearPropiedadesController
