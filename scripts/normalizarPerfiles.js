// Normaliza perfiles de especialistas cargados con un formato antiguo:
// - servicios { trabajo, precio } -> { [trabajo]: "precio" } (formato que guarda editarPerfil y lee el front)
// - fotos que no existen en resources/images -> "" (el front muestra las iniciales)
// Se puede ejecutar varias veces. Uso: node scripts/normalizarPerfiles.js [--dry-run]
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
const conectarBaseDatos = require("../src/config/database")
const { CARPETAS } = require("../src/utils/formulario")

const SIMULACION = process.argv.includes("--dry-run")

const esFormatoAntiguo = servicio => servicio && "trabajo" in servicio && "precio" in servicio

const normalizarServicio = servicio => (esFormatoAntiguo(servicio)
    ? { [servicio.trabajo]: String(servicio.precio) }
    : servicio)

const fotoExiste = foto => fs.existsSync(path.join(CARPETAS.imagenes, path.basename(foto)))

const cambiosPara = ({ perfil = {} }) => {
    const cambios = {}
    if ((perfil.servicios ?? []).some(esFormatoAntiguo)) {
        cambios["perfil.servicios"] = perfil.servicios.map(normalizarServicio)
    }
    if (perfil.foto && !fotoExiste(perfil.foto)) {
        cambios["perfil.foto"] = ""
    }
    return cambios
}

const normalizar = async () => {
    await conectarBaseDatos()
    if (SIMULACION) console.log("Modo simulación: no se modificará ningún especialista")

    const coleccion = mongoose.connection.collection("especialistas")
    const especialistas = await coleccion.find({}, { projection: { nombres: 1, perfil: 1 } }).toArray()

    const actualizaciones = especialistas
        .map(especialista => ({ especialista, cambios: cambiosPara(especialista) }))
        .filter(({ cambios }) => Object.keys(cambios).length > 0)

    actualizaciones.forEach(({ especialista, cambios }) =>
        console.log(`  ${especialista.nombres}: ${Object.keys(cambios).join(", ")}`))
    console.log(`Especialistas por normalizar: ${actualizaciones.length}`)

    if (!SIMULACION && actualizaciones.length > 0) {
        const { modifiedCount } = await coleccion.bulkWrite(actualizaciones.map(({ especialista, cambios }) => ({
            updateOne: { filter: { _id: especialista._id }, update: { $set: cambios } }
        })))
        console.log(`Especialistas normalizados: ${modifiedCount}`)
    }
}

normalizar()
    .catch(error => {
        console.error("Error al normalizar perfiles:", error)
        process.exitCode = 1
    })
    .finally(() => mongoose.disconnect())
