const express = require("express")
const cors = require("cors")
const session = require("express-session")
const { sessionSecret } = require("./config/env")
const crearRutas = require("./routes")
const manejadorErrores = require("./middlewares/manejadorErrores")
const { CARPETAS } = require("./utils/formulario")

const crearApp = ({ controladores, origenCors }) => {
    const app = express()

    app.use(cors({ origin: origenCors }))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use("/resources/images", express.static(CARPETAS.imagenes))
    app.use(session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false
    }))

    app.use("/", crearRutas(controladores))
    app.use(manejadorErrores)

    return app
}

module.exports = crearApp
