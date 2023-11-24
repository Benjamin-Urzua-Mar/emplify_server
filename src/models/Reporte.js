const mongoose = require("mongoose")

const Reporte = mongoose.Schema({
    titulo:String,
	estado:String,
    cliente: mongoose.SchemaTypes.ObjectId,
    especialista: mongoose.SchemaTypes.ObjectId,
    fechaReporte: Date,
    descripcion:String,
    prioridad: String,
})

module.exports = mongoose.model("Reporte", Reporte)