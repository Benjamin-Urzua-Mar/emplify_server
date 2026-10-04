const mongoose = require("mongoose")
const { mongoUri } = require("./env")

const conectarBaseDatos = async () => {
    await mongoose.connect(mongoUri)
    console.log("MongoDb conectado")
}

module.exports = conectarBaseDatos
