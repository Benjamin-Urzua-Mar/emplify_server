const Comuna = require("../../src/models/Comuna")
const Rubro = require("../../src/models/Rubro")
const comunas = require("../../src/data/comunas.json")
const rubros = require("../../src/data/rubros.json")

// Inserta o actualiza las comunas y agrega los rubros que falten (sin pisar descripciones editadas)
const cargarCatalogos = async () => {
    await Comuna.bulkWrite(comunas.map(comuna => ({
        updateOne: { filter: { codigo: comuna.codigo }, update: { $set: comuna }, upsert: true }
    })))
    await Rubro.bulkWrite(rubros.map(({ nombre, descripcion }) => ({
        updateOne: { filter: { nombre }, update: { $setOnInsert: { nombre, descripcion } }, upsert: true }
    })))
    await Promise.all([Comuna.syncIndexes(), Rubro.syncIndexes()])
    console.log(`Catálogos: ${await Comuna.countDocuments()} comunas, ${await Rubro.countDocuments()} rubros`)
}

module.exports = { cargarCatalogos }
