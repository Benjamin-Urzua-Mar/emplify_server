const mongoose = require("mongoose")

const Comuna = mongoose.Schema({
    codigo: { type: String, required: true, unique: true }, // Codigo Unico Territorial (CUT)
    nombre: { type: String, required: true },
    provincia: String,
    region: String,
    codigoRegion: { type: String, index: true }
}, { versionKey: false })

module.exports = mongoose.model("Comuna", Comuna)
