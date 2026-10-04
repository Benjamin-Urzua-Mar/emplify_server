const BaseRepository = require("./BaseRepository")
const EspecialistaRepository = require("./EspecialistaRepository")
const Admin = require("../models/Admin")
const Cliente = require("../models/Cliente")
const Trabajo = require("../models/Trabajo")
const Propiedad = require("../models/Propiedad")
const Comuna = require("../models/Comuna")
const Rubro = require("../models/Rubro")

const crearRepositorios = () => ({
    admin: new BaseRepository(Admin),
    cliente: new BaseRepository(Cliente),
    especialista: new EspecialistaRepository(),
    trabajo: new BaseRepository(Trabajo),
    propiedad: new BaseRepository(Propiedad),
    comuna: new BaseRepository(Comuna),
    rubro: new BaseRepository(Rubro)
})

module.exports = crearRepositorios
