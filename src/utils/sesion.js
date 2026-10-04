// Versiones con promesas de las operaciones de express-session
const iniciarSesion = (req, usuarioId) => new Promise((resolve, reject) => {
    req.session.regenerate(error => {
        if (error) return reject(error)
        req.session.user = usuarioId
        req.session.save(errorGuardado => (errorGuardado ? reject(errorGuardado) : resolve()))
    })
})

const cerrarSesion = req => new Promise((resolve, reject) => {
    req.session.destroy(error => (error ? reject(error) : resolve()))
})

// "Juan Pablo" -> "Juan"
const primerNombre = nombres => (nombres ?? "").trim().split(" ")[0]

module.exports = { iniciarSesion, cerrarSesion, primerNombre }
