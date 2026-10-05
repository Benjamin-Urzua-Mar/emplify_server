const mongoose = require("mongoose")

const Propiedad = mongoose.Schema({
    id: String,
    value: String,
    publica: { type: Boolean, default: false } // solo las publicas se exponen al front
})

module.exports = mongoose.model("Propiedad", Propiedad)
