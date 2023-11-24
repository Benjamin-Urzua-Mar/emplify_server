const modelAdmin = require("../models/Admin")
const modelCliente = require("../models/Cliente")
const modelEspecialista = require("../models/Especialista")

module.exports.login = async (req, res) => {
    try {
        const data = req.body
        await modelAdmin.findOne({ user: data["user"] })
            .exec()
            .then(
                admin => {
                    if (admin != null) {
                        if (admin["contrasena"] != data["contrasena"]) {
                            console.log("La contraseña no coincide")
                            res.status(200).json({ codigo: 2, msg: "La contraseña no coincide" })
                        } else {
                            req.session.regenerate(err => {
                                if (err) next(err)
                                req.session.user = admin["_id"]
                                req.session.save((err) => {
                                    if (err) { console.log(next(err)); res.status(200).json({ msg: err }) }
                                    res.status(200).json({ codigo: 1, sessionId: req.session.user, msg: "Sesión iniciada con éxito", tipoUsuario: "Admin" })
                                    console.log("Sesión iniciada con éxito")

                                })
                            })
                        }
                    } else {
                        console.log("No existen usuarios con ese nombre de usuario")
                        res.status(200).json({ codigo: 3, msg: "No existen usuarios con ese nombre de usuario" })
                    }
                }

            )
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}


module.exports.logout = async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) next(err)
            res.status(200).json({ codigo: 1, msg: "Sesión cerrada con éxito" })
        })
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.retornarClientes = async (req, res) => {
    try {
        await modelCliente.find()
            .exec()
            .then(clientes => {
                if (clientes.length > 0) {
                    console.log("Hubieron coincidencias")
                    res.status(200).json({ codigo: 1, msg: "Hubieron coincidencias", data: clientes })
                } else {
                    console.log("No hubieron coincidencias")
                    res.status(200).json({ codigo: 2, msg: "No hubieron coincidencias" })
                }
            })
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}
module.exports.retornarCliente = async (req, res) => {
    try {
        const data = req.body
        await modelCliente.findOne({_id:data["id"]})
            .exec()
            .then(cliente => {
                if (cliente != null) {
                    console.log("Hubieron coincidencias")
                    res.status(200).json({ codigo: 1, msg: "Hubieron coincidencias", data: cliente })
                } else {
                    console.log("No hubieron coincidencias")
                    res.status(200).json({ codigo: 2, msg: "No hubieron coincidencias" })
                }
            })
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.banCliente = async (req, res) => {
    try {
        const data = req.body
        if (data["operacion"] == "ban") {
            await modelCliente.findByIdAndUpdate(data["id"], {estado:false})
            .exec()
            .then(result => {
                if (result) {
                    console.log("Usuario baneado")
                    res.status(200).json({ codigo: 1, msg: "Usuario baneado" })
                } else {
                    console.log("Algo ha ocurrido. No hubieron cambios")
                    res.status(200).json({ codigo: 2, msg: "Algo ha ocurrido. No hubieron cambios" })
                }
                
            })
        }else{
            await modelCliente.findByIdAndUpdate(data["id"], {estado:true})
            .exec()
            .then(result => {
                if (result) {
                    console.log("Usuario desbaneado")
                    res.status(200).json({ codigo: 1, msg: "Usuario desbaneado" })
                } else {
                    console.log("Algo ha ocurrido. No hubieron cambios")
                    res.status(200).json({ codigo: 2, msg: "Algo ha ocurrido. No hubieron cambios" })
                }
                
            })
        }
        
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.deleteCliente= async (req, res) => {
    try {
        const data = req.body
        await modelCliente.findOneAndDelete({_id:data["id"]})
            .exec()
            .then(cliente => {
                if (cliente != null) {
                    console.log("Usuario eliminado")
                    res.status(200).json({ codigo: 1, msg: "Usuario eliminado" })
                } else {
                    console.log("Algo ha ocurrido. No hubieron cambios")
                    res.status(200).json({ codigo: 2, msg: "Algo ha ocurrido. No hubieron cambios" })
                }
            })
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.retornarEspecialistas = async (req, res) => {
    try {
        await modelEspecialista.find()
            .exec()
            .then(especialistas => {
                if (especialistas.length > 0) {
                    console.log("Hubieron coincidencias")
                    res.status(200).json({ codigo: 1, msg: "Hubieron coincidencias", data: especialistas })
                } else {
                    console.log("No hubieron coincidencias")
                    res.status(200).json({ codigo: 2, msg: "No hubieron coincidencias" })
                }
            })
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.retornarEspecialista = async (req, res) => {
    try {
        const data = req.body
        await modelEspecialista.findOne({_id:data["id"]})
            .exec()
            .then(especialista => {
                if (especialista != null) {
                    console.log("Hubieron coincidencias")
                    res.status(200).json({ codigo: 1, msg: "Hubieron coincidencias", data: especialista })
                } else {
                    console.log("No hubieron coincidencias")
                    res.status(200).json({ codigo: 2, msg: "No hubieron coincidencias" })
                }
            })
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.banEspecialista = async (req, res) => {
    try {
        const data = req.body
        if (data["operacion"] == "ban") {
            await modelEspecialista.findByIdAndUpdate(data["id"], {estado:false})
            .exec()
            .then(result => {
                if (result) {
                    console.log("Usuario baneado")
                    res.status(200).json({ codigo: 1, msg: "Usuario baneado" })
                } else {
                    console.log("Algo ha ocurrido. No hubieron cambios")
                    res.status(200).json({ codigo: 2, msg: "Algo ha ocurrido. No hubieron cambios" })
                }
                
            })
        }else{
            await modelEspecialista.findByIdAndUpdate(data["id"], {estado:true})
            .exec()
            .then(result => {
                if (result) {
                    console.log("Usuario desbaneado")
                    res.status(200).json({ codigo: 1, msg: "Usuario desbaneado" })
                } else {
                    console.log("Algo ha ocurrido. No hubieron cambios")
                    res.status(200).json({ codigo: 2, msg: "Algo ha ocurrido. No hubieron cambios" })
                }
                
            })
        }
        
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.deleteEspecialista = async (req, res) => {
    try {
        const data = req.body
        await modelEspecialista.findOneAndDelete({_id:data["id"]})
            .exec()
            .then(especialista => {
                if (especialista != null) {
                    console.log("Usuario eliminado")
                    res.status(200).json({ codigo: 1, msg: "Usuario eliminado" })
                } else {
                    console.log("Algo ha ocurrido. No hubieron cambios")
                    res.status(200).json({ codigo: 2, msg: "Algo ha ocurrido. No hubieron cambios" })
                }
            })
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}