const modelEspecialista = require("../models/Especialista")
const modelCliente = require("../models/Cliente")
const modelTrabajo = require("../models/Trabajo")
const formidable = require("formidable")

const path = require('path')

module.exports.register = async (req, res) => {
    try {
        const form = new formidable.IncomingForm()
        const docsFolder = path.join(__dirname, "../../resources", "documents")
        //console.log("folder: ", docsFolder)
        var titulos = []
        var numeroTitulo = 0
        let formatoArchivo
        form.on('fileBegin', (formName, file) => {
            if (formName.includes("tituloProfesional")) {
                numeroTitulo++
                formatoArchivo = file.mimetype.slice(6)
                const nombreArchivo = formName.replace("tituloProfesional", `tituloProfesional${numeroTitulo}`)
                titulos.push(`${nombreArchivo}.${formatoArchivo}`)
                let nuevoArchivo = file
                nuevoArchivo.filepath = `${docsFolder}/${nombreArchivo}.${formatoArchivo}`
                nuevoArchivo.newFilename = nombreArchivo
                form.emit('data', { name: 'fileBegin', value: nuevoArchivo });
            } else {
                const formatoArchivo = file.mimetype.slice(6)
                let nuevoArchivo = file
                nuevoArchivo.filepath = `${docsFolder}/${formName}.${formatoArchivo}`
                nuevoArchivo.newFilename = formName
                form.emit('data', { name: 'fileBegin', value: nuevoArchivo });
            }
        });


        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(`Hubo un problema al subir los archivos: ${err}`)
                res.status(200).json({ codigo: 3, msg: `Hubo un problema al subir los archivos: ${err}` })
            } else {

                const arrayFiles = Object.values(files).map(file => {
                    if (file[0].newFilename.includes("tituloProfesional")) {
                        return ["titulos", titulos]
                    } else {
                        if (file[0].newFilename.includes("cedIdentidad")) {
                            return ["cedIdentidad", `${file[0].newFilename}.${formatoArchivo}`]
                        } else if (file[0].newFilename.includes("certResidencia")) {
                            return ["certResidencia", `${file[0].newFilename}.${formatoArchivo}`]
                        } else {
                            return ["certAntecedentes", `${file[0].newFilename}.${formatoArchivo}`]
                        }

                    }
                })

                const objFiles = Object.fromEntries(arrayFiles)

                const especialista = new modelEspecialista({
                    nombres: fields["nombres"][0],
                    apellidos: fields["apellidos"][0],
                    contrasena: fields["contrasena"][0],
                    email: fields["email"][0],
                    telefono: fields["telefono"][0],
                    run: fields["run"][0],
                    region: fields["region"][0],
                    provincia: fields["provincia"][0],
                    comuna: fields["comuna"][0],
                    direccion: fields["direccion"][0],
                    file_cedIdentidad: objFiles["cedIdentidad"],
                    file_certResidencia: objFiles["certResidencia"],
                    file_titulosProfesionales: objFiles["titulos"],
                    file_certAntecedentes: objFiles["certAntecedentes"],
                    rubro: fields["rubro"][0],
                    profesion: fields["profesion"][0],
                    disponibilidad: "Disponible",
                    estado: true,
                    plan: "Corriente",
                    fechaRegistro: new Date()
                })
                await especialista.save()
                    .then((result) => {
                        if (result != null) {
                            console.log("Registro exitoso: ", result)
                            res.status(200).json({ codigo: 1, msg: "Registro exitoso" })
                        } else {
                            res.status(200).json({ codigo: 2, msg: "Algo salio mal..." })
                            console.log("Algo salio mal...")
                        }
                    });
            }

        });
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.editarPerfil = async (req, res) => {
    try {
        const form = new formidable.IncomingForm()
        const docsFolder = path.join(__dirname, "../../resources", "images")

        let formatoArchivo
        form.on('fileBegin', (formName, file) => {
            formatoArchivo = file.mimetype.slice(6)
            const nombreArchivo = `fotoPerfil_${formName}`
            let nuevoArchivo = file
            nuevoArchivo.filepath = `${docsFolder}/${nombreArchivo}.${formatoArchivo}`
            nuevoArchivo.newFilename = nombreArchivo
            form.emit('data', { name: 'fileBegin', value: nuevoArchivo });
        });


        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(`Hubo un problema al subir los archivos: ${err}`)
                res.status(200).json({ codigo: 3, msg: `Hubo un problema al subir los archivos: ${err}` })
            } else {
                const entries = Object.entries(fields)
                entries.pop()
                const nombres = entries.filter(e => {
                    if (e[0].includes("trabajo")) {
                        return e[1]
                    }
                })

                const precios = entries.filter(e => {
                    if (e[0].includes("precio")) {
                        return e[1]
                    }
                })

                let servicios = nombres.map((nombre, i) => {
                    let _nombre = nombre[1]
                    let precio = precios[i][1].toString()
                    let servicio = {}
                    servicio[_nombre] = precio
                    return servicio
                })

                const perfil = {
                    foto: `${Object.values(files)[0][0].newFilename}.${formatoArchivo}`,
                    experiencia: fields["experiencia"].toString(),
                    antiguedad: 0,
                    trabajosRealizados: [],
                    servicios: servicios,
                    comentarios: []
                }

                const run = Object.keys(files).toString()

                await modelEspecialista.findOneAndUpdate({ run: run }, { perfil: perfil })
                    .exec()
                    .then(
                        result => {
                            if (result != null) {
                                console.log("Perfil configurado con éxito")
                                res.status(200).json({ codigo: 1, msg: "Perfil configurado con éxito." })
                            } else {
                                console.log("Problema encontrando al usuario")
                                res.status(200).json({ codigo: 2, msg: "Problema encontrando al usuario" })
                            }
                        }
                    )

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
        await modelEspecialista.findOne({ email: data["email"] })
            .exec()
            .then(
                especialista => {
                    if (especialista != null) {
                        if (especialista["contrasena"] != data["contrasena"]) {
                            console.log("La contraseña no coincide")
                            res.status(200).json({ codigo: 2, msg: "La contraseña no coincide" })
                        } else {
                            console.log(especialista)
                            req.session.regenerate(err => {
                                if (err) next(err)
                                req.session.user = especialista["_id"]
                                req.session.save((err) => {
                                    if (err) { console.log(next(err)); res.status(200).json({ msg: err }) }
                                    res.status(200).json({ codigo: 1, userName: especialista["nombres"].substr(0, especialista["nombres"].search(" ")), sessionId: req.session.user, msg: "Sesión iniciada con éxito", tipoUsuario: "Especialista", fotoPerfil: especialista["perfil"]["foto"] })
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

module.exports.getPerfil = async (req, res) => {
    try {
        const data = req.body
        await modelEspecialista.findById(data["_id"])
            .exec()
            .then(
                especialista => {
                    res.status(200).json({ codigo: 1, msg: "Ok", data: especialista.perfil.fotoPerfil })
                }

            )
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }
}

module.exports.getSolicitudesTrabajos = async (req, res) => {
    try {
        const data = req.body
        const results = await modelEspecialista.findById(data["_id"], "solicitudes_trabajo").exec()

        const solicitudesTrabajos = await Promise.all(results.solicitudes_trabajo.map(async (solicitud) => {
            const clienteData = await modelCliente.findById(solicitud.cliente, "nombres apellidos").exec();
            const cliente = `${clienteData.nombres} ${clienteData.apellidos}`;
            solicitud.nombreCliente = cliente;
            return solicitud;
        }))
        res.status(200).json({ codigo: 1, msg: "Ok", data: solicitudesTrabajos })
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }

}


module.exports.aceptarTrabajo = async (req, res) => {
    try {
        const data = req.body
        const trabajo = data["trabajo"]
        const solicitudes_trabajo = data["solicitudes"]

        const Trabajo = new modelTrabajo(trabajo)
        await Trabajo.save()
            .then((result) => {
                if (result != null) {
                    const idNuevoTrabajo = result["_id"]
                    modelEspecialista.findByIdAndUpdate(trabajo.especialista, { solicitudes_trabajo: solicitudes_trabajo }).exec()
                        .then(
                            result => {
                                console.log(result);
                                if (result) {
                                    modelEspecialista.findById(trabajo.especialista, "perfil").exec()
                                        .then(
                                            result => {
                                                const perfil = result["perfil"]
                                                const trabajosRealizados = perfil["trabajosRealizados"]
                                                trabajosRealizados.push(idNuevoTrabajo)
                                                perfil["trabajosRealizados"] = trabajosRealizados
                                                modelEspecialista.findByIdAndUpdate(trabajo.especialista, { perfil: perfil }).exec()
                                                    .then(
                                                        result => {
                                                            if (result) {
                                                                console.log("Trabajo creado")
                                                                res.status(200).json({ codigo: 1, msg: "Trabajo creado" })
                                                            } else {
                                                                console.log("Algo ha ocurrido al actualizar perfil. No hubieron cambios")
                                                                res.status(200).json({ codigo: 2, msg: "Algo ha ocurrido al actualizar perfil. No hubieron cambios" })
                                                            }
                                                        }
                                                    )


                                            }
                                        )

                                } else {
                                    console.log("Algo ha ocurrido al actualizar solicitudes. No hubieron cambios")
                                    res.status(200).json({ codigo: 2, msg: "Algo ha ocurrido al actualizar solicitudes. No hubieron cambios" })
                                }
                            }
                        )
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

module.exports.trabajosEnCurso = async (req, res) => {
    try {
        const data = req.body
        const trabajos = await modelTrabajo.find({ especialista: data["_id"], estado:"Activo" }).exec()
        if (trabajos.length > 0) {
            const trabajosEnCurso = await Promise.all(trabajos.map(async (trabajo) => {
                const clienteData = await modelCliente.findById(trabajo.cliente, "nombres apellidos").exec();
                const cliente = `${clienteData.nombres} ${clienteData.apellidos}`;
                const trabajoModificado = { ...trabajo.toObject(), nombreCliente: cliente };
                return trabajoModificado;
            }))
            console.log("Trabajos encontrados: ", trabajosEnCurso)
            res.status(200).json({ codigo: 1, msg: "Trabajos encontrados", data: trabajosEnCurso })
        } else {
            console.log("No hay trabajos")
            res.status(200).json({ codigo: 2, msg: "No hay trabajos terminados", data: trabajos })
        }
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }

}

module.exports.trabajosTerminados = async (req, res) => {
    try {
        const data = req.body
        const trabajos = await modelTrabajo.find({especialista: data["_id"], estado:"Terminado" })
        if (trabajos.length > 0) {
            const trabajosEnCurso = await Promise.all(trabajos.map(async (trabajo) => {
                const clienteData = await modelCliente.findById(trabajo.cliente, "nombres apellidos").exec();
                const cliente = `${clienteData.nombres} ${clienteData.apellidos}`;
                const trabajoModificado = { ...trabajo.toObject(), nombreCliente: cliente };
                return trabajoModificado;
            }))
            console.log("Trabajos encontrados: ", trabajosEnCurso)
            res.status(200).json({ codigo: 1, msg: "Trabajos encontrados", data: trabajosEnCurso })
        } else {
            console.log("No hay trabajos")
            res.status(200).json({ codigo: 2, msg: "No hay trabajos en curso", data: trabajos })
        }
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }

}

module.exports.finalizarTrabajo = async (req, res) => {
    try {
        const data = req.body
        await modelTrabajo.findByIdAndUpdate(data["_id"], {estado:"Terminado"}).exec().then(trabajo => {
            res.status(200).json({ codigo: 1, msg: "Trabajo terminado" })
        })
        
    } catch (error) {
        console.log("Ha ocurrido una excepción: ", error)
        res.status(200).json({ codigo: 10, msg: `Ha ocurrido una excepción: ${error}` })
    }

}