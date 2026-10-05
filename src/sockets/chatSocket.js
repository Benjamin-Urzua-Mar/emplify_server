// Chat en tiempo real: clientes y especialistas comparten una sala por especialista
const registrarChat = io => {
    io.on("connection", socket => {
        socket.on("clienteJoin", ({ room } = {}) => {
            console.log(`Cliente ha entrado, room: ${room}`)
            socket.join(room)
        })

        socket.on("especialistaJoin", () => {
            const room = socket.handshake.auth._id
            console.log(`Especialista ha entrado, room: ${room}`)
            socket.join(room)
        })

        socket.on("msg", ({ room, msg } = {}) => {
            socket.to(room).emit("msg", { msg })
        })
    })
}

module.exports = registrarChat
