const mongoose = require("mongoose")

const perfil =  mongoose.Schema({
    foto: String,
    experiencia: String,
    antiguedad: Number,
    trabajosRealizados: Array, //array de id de trabajos
    servicios: Array, //array de objetos {trabajo:precio}
    comentarios: Array //array de id de comentarios
})


const Especialista = mongoose.Schema({
    nombres: String,
    apellidos: String,
    contrasena: String,
    email: String,
    telefono: Number,
    run: String,
    region: String,
    provincia: String,
    comuna: String,
    direccion: String,
    file_cedIdentidad: String,
    file_certResidencia: String,
    file_titulosProfesionales: Array,
    file_certAntecedentes: String,
    rubro: String,
    profesion: String,
    disponibilidad: String,
    estado:Boolean,
    plan: String,
    fechaRegistro: Date,
    perfil: {
        type: perfil,
        default: {}
    },
    solicitudes_trabajo : Array
})

module.exports = mongoose.model("Especialista", Especialista)