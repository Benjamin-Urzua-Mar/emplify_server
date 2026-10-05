const { consulta } = require("../views/respuesta")

const crearCatalogosController = ({ comunaService, rubroService }) => ({
    // GET /comunas?region=13 filtra por codigo de region
    listarComunas: async (req, res) => {
        const { region } = req.query
        const filtro = typeof region === "string" ? { codigoRegion: region } : {}
        consulta(res, await comunaService.listar(filtro))
    },

    listarRubros: async (req, res) => consulta(res, await rubroService.listar())
})

module.exports = crearCatalogosController
