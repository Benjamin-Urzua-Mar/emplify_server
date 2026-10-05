// Carga los catalogos de comunas y rubros y convierte especialista.comuna / especialista.rubro
// de texto a referencia (ObjectId). Se puede ejecutar varias veces sin duplicar datos.
// Uso: node scripts/migrarCatalogos.js [--dry-run]
const mongoose = require("mongoose")
const conectarBaseDatos = require("../src/config/database")
const Comuna = require("../src/models/Comuna")
const Rubro = require("../src/models/Rubro")
const comunas = require("../src/data/comunas.json")
const rubros = require("../src/data/rubros.json")

const SIMULACION = process.argv.includes("--dry-run")
const COLACION_ES = { locale: "es", strength: 1 }

const REFERENCIAS = [
    { campo: "comuna", modelo: Comuna },
    { campo: "rubro", modelo: Rubro }
]

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

// Devuelve las actualizaciones a aplicar y los valores que no existen en el catalogo
const planificarEspecialistas = async especialistas => {
    const actualizaciones = []
    const sinCoincidencia = []

    for (const especialista of especialistas) {
        const cambios = {}
        for (const { campo, modelo } of REFERENCIAS) {
            const valor = especialista[campo]
            if (typeof valor !== "string") continue

            const registro = await modelo.findOne({ nombre: valor.trim() }, "_id").collation(COLACION_ES)
            if (registro) cambios[campo] = registro._id
            else sinCoincidencia.push(`${especialista._id} ${campo}="${valor}"`)
        }
        if (Object.keys(cambios).length > 0) {
            actualizaciones.push({ updateOne: { filter: { _id: especialista._id }, update: { $set: cambios } } })
        }
    }
    return { actualizaciones, sinCoincidencia }
}

const migrar = async () => {
    await conectarBaseDatos()
    if (SIMULACION) console.log("Modo simulación: no se modificarán especialistas")

    await cargarCatalogos()

    const coleccion = mongoose.connection.collection("especialistas")
    const pendientes = await coleccion.find({
        $or: REFERENCIAS.map(({ campo }) => ({ [campo]: { $type: "string" } }))
    }).toArray()
    const { actualizaciones, sinCoincidencia } = await planificarEspecialistas(pendientes)

    if (sinCoincidencia.length > 0) {
        console.error("Valores sin coincidencia en el catálogo (no se migró ningún especialista):")
        sinCoincidencia.forEach(detalle => console.error(`  ${detalle}`))
        process.exitCode = 1
        return
    }

    console.log(`Especialistas por migrar: ${actualizaciones.length}`)
    if (!SIMULACION && actualizaciones.length > 0) {
        const { modifiedCount } = await coleccion.bulkWrite(actualizaciones)
        console.log(`Especialistas migrados: ${modifiedCount}`)
    }
}

migrar()
    .catch(error => {
        console.error("Error en la migración:", error)
        process.exitCode = 1
    })
    .finally(() => mongoose.disconnect())
