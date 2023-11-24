const mongoose = require("mongoose")

const Comentario = mongoose.Schema({
	autor: mongoose.SchemaTypes.ObjectId,
    contenido: String,
    calificacion:String,
    evidencias: Array
})

module.exports = mongoose.model("Comentario", Comentario)