const formidable = require("formidable")
const path = require("path")

const CARPETA_RECURSOS = path.join(__dirname, "../../resources")

const CARPETAS = Object.freeze({
    documentos: path.join(CARPETA_RECURSOS, "documents"),
    imagenes: path.join(CARPETA_RECURSOS, "images")
})

// "image/png" -> "png"
const extensionDe = archivo => (archivo.mimetype ?? "").split("/")[1] || "bin"

// El nombre viene del cliente: se eliminan "/" y otros caracteres para no escribir fuera de la carpeta
const sanitizarNombre = nombre => nombre.replace(/[^\w.-]/g, "_")

// Lee un multipart/form-data guardando cada archivo con el nombre que defina `nombrarArchivo`
const parsearFormulario = (req, carpeta, nombrarArchivo) => new Promise((resolve, reject) => {
    const formulario = new formidable.IncomingForm()

    formulario.on("fileBegin", (campo, archivo) => {
        archivo.newFilename = sanitizarNombre(`${nombrarArchivo(campo)}.${extensionDe(archivo)}`)
        archivo.filepath = path.join(carpeta, archivo.newFilename)
    })

    formulario.parse(req, (error, campos, archivos) => {
        if (error) return reject(error)
        resolve({ campos, archivos })
    })
})

// Varios titulos llegan en el mismo campo: se numeran tituloProfesional1, tituloProfesional2...
const crearNombradorDocumentos = () => {
    let numeroTitulo = 0
    return campo => {
        if (!campo.includes("tituloProfesional")) return campo
        numeroTitulo++
        return campo.replace("tituloProfesional", `tituloProfesional${numeroTitulo}`)
    }
}

const nombrarFotoPerfil = campo => `fotoPerfil_${campo}`

const primerValor = (campos, nombre) => campos[nombre]?.[0]

const nombresDeArchivos = (archivos, fragmentoCampo) => Object.entries(archivos)
    .filter(([campo]) => campo.includes(fragmentoCampo))
    .flatMap(([, lista]) => lista.map(archivo => archivo.newFilename))

module.exports = {
    CARPETAS,
    parsearFormulario,
    crearNombradorDocumentos,
    nombrarFotoPerfil,
    primerValor,
    nombresDeArchivos
}
