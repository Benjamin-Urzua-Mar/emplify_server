const mongoose = require("mongoose")

const Rubro = mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: String
}, { versionKey: false })

module.exports = mongoose.model("Rubro", Rubro)
