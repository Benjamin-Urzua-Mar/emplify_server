const express = require('express')
const db = require('./src/config/DbConfig')
const cors = require('cors')
const session = require('express-session')
const routes = require("./src/routes/routes")
const { Server } = require('socket.io')
const { createServer } = require('node:http')

db().finally(() => {
    const app = express()
    const server = createServer(app)
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })
    app.use(cors()) //CORS


    io.on('connection', (socket) => {
        socket.on("clienteJoin", async room => {
            console.log(`Cliente ha entrado, room: ${room.room}`);
            socket.join(room.room)
        })
        socket.on("especialistaJoin", async room => {
            console.log(`Especialista ha entrado, room: ${socket.handshake.auth._id}`);
            socket.join(socket.handshake.auth._id)
        })

        socket.on("msg", async info => {
            console.log(info.msg);
            socket.to(info.room).emit("msg",{msg:info.msg})
        })
        /*
        socket.on("cliente", async data => {
            const emitter = socket.handshake.auth
            const receiver = data["receiver"]
            const msg = data["msj"]
            const room = data["room"]
            console.log(`Mensaje: ${msg} Para: ${receiver}`)
            socket.emit(receiver, msg)
        })

        socket.on("especialista", async data => {
            const emitter = socket.handshake.auth
            const receiver = socket.handshake.headers.receiver
            const msg = data["msj"]
            const room = data["room"]
            const sockets = await io.fetchSockets();
            console.log(sockets)
        })
        */

    })


    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use("/resources/images", express.static('resources/images'))
    app.use(session({  //configuracion session
        secret: 'workit',
        resave: false,
        saveUninitialized: false
    }))

    app.use("/", routes) //IMPLEMENTANDO LAS RUTAS


    server.listen(8080, () => {
        console.log("Servidor corriendo http://localhost:8080/")
    })


})