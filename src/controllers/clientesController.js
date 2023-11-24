const modelCliente = require("../models/Cliente")
const modelEspecialista = require("../models/Especialista")
module.exports.register = async (req, res) => {
    try {
        const data = req.body
        data["fechaRegistro"] = new Date()
        const cliente = new modelCliente(data)
        await cliente.save()
            .then((result) => {
                if (result != null) {
                    console.log("Registro exitoso: ", result)
                    res.status(200).json({ codigo: 1, msg: "Registro exitoso" })
                } else {
                    res.status(200).json({ codigo: 2, msg: "Algo salio mal..." })
                    console.log("Algo salio mal...")
                }
            });
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.login = async (req, res) => {
    try {
        const data = req.body
        await modelCliente.findOne({ email: data["email"] })
            .exec()
            .then(
                cliente => {
                    if (cliente != null) {
                        if (cliente["contrasena"] != data["contrasena"]) {
                            console.log("La contraseña no coincide")
                            res.status(200).json({ codigo: 2, msg: "La contraseña no coincide" })
                        } else {
                            req.session.regenerate(err => {
                                if (err) next(err)
                                req.session.user = cliente["_id"]
                                req.session.save((err) => {
                                    if (err) { console.log(next(err)); res.status(200).json({ msg: err }) }
                                    res.status(200).json({ codigo: 1, userName: cliente["nombres"].substr(0, cliente["nombres"].search(" ")), sessionId: req.session.user, msg: "Sesión iniciada con éxito", tipoUsuario: "Cliente" })
                                    console.log("Sesión iniciada con éxito")

                                })
                            })
                        }
                    } else {
                        console.log("No existen usuarios con ese correo")
                        res.status(200).json({ codigo: 3, msg: "No existen usuarios con ese correo" })
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

module.exports.buscarEspecialista = async (req, res) => {
    try {
        const data = req.body
        console.log(data)
        await modelEspecialista.find(data).exec()
            .then((results) => {
                if (results.length > 0) {
                    console.log("Coincidencias: ", results)
                    res.status(200).json({ codigo: 1, msg: "Han habido coincidencias", data: results })
                } else {
                    console.log("No han habido coincidencias")
                    res.status(200).json({ codigo: 2, msg: "No han habido coincidencias" })
                }
            })
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.getCuenta = async (req, res) => {
    try {
        const data = req.body
        await modelCliente.findOne({ _id: data["_id"] })
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

module.exports.editarCuenta = async (req, res) => {
    try {
        const data = req.body
        const _id = data["_id"]
        delete data["_id"]
        await modelCliente.findByIdAndUpdate(_id, data)
            .exec()
            .then(cliente => {
                if (cliente != null) {
                    console.log("Usuario actualizado correctamente")
                    res.status(200).json({ codigo: 1, msg: "Usuario actualizado correctamente" })
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

module.exports.solicitarTrabajo = async (req, res) => {
    try {
        const data = req.body
        await modelEspecialista.findById(data["especialista"], 'solicitudes_trabajo').exec()
            .then((results) => {
                if (results != null) {
                    let solicitudes_trabajo = results["solicitudes_trabajo"]
                    solicitudes_trabajo.push(data)
                    modelEspecialista.findByIdAndUpdate(data["especialista"], { solicitudes_trabajo: solicitudes_trabajo }).exec()
                        .then((results) => {
                            if (results != null) {
                                console.log("Reserva concretada");
                                res.status(200).json({ codigo: 1, msg: "Reserva concretada", data: results })
                            } else {
                                console.log("No se ha hecho la reserva");
                                res.status(200).json({ codigo: 2, msg: "No se ha hecho la reserva" })
                            }

                        })

                } else {
                    console.log("No se ha hecho la reserva");
                    res.status(200).json({ codigo: 2, msg: "No se ha hecho la reserva" })
                }

            })

    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}