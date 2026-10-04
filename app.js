const { createServer } = require("node:http")
const { Server } = require("socket.io")
const env = require("./src/config/env")
const conectarBaseDatos = require("./src/config/database")
const crearOrigenCors = require("./src/config/cors")
const crearContenedor = require("./src/container")
const crearApp = require("./src/app")
const registrarChat = require("./src/sockets/chatSocket")

const iniciar = async () => {
    // El servidor se levanta aunque MongoDB no responda, como antes del refactor
    await conectarBaseDatos().catch(error => console.error("No se pudo conectar a MongoDB:", error))

    const { servicios, controladores } = crearContenedor()
    const origenCors = crearOrigenCors(servicios.propiedadService)

    const server = createServer(crearApp({ controladores, origenCors }))
    registrarChat(new Server(server, { cors: { origin: origenCors } }))

    server.listen(env.puerto, env.host, () => {
        console.log(`Servidor corriendo http://${env.host}:${env.puerto}/`)
    })
}

iniciar()
