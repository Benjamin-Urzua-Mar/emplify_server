const mongoose = require("mongoose")

const Propiedad = mongoose.Schema({
	id:String,
    value:String
})

module.exports = mongoose.model("Propiedad", Propiedad)