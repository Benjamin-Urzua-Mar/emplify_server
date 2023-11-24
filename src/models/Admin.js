const mongoose = require("mongoose")

const Admin = mongoose.Schema({
	user:String,
    contrasena:String
})

module.exports = mongoose.model("Admin", Admin)