const mongoose = require("mongoose")

const Trabajo = mongoose.Schema({
	estado:String,
    cliente: mongoose.SchemaTypes.ObjectId,
    especialista: mongoose.SchemaTypes.ObjectId,
    fechaInicio: Date,
    fechaFin: Date,
    descripcion:String,
    servicio: String,
    foto: String
})

module.exports = mongoose.model("Trabajo", Trabajo)