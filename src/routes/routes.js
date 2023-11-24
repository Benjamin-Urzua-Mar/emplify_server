const express = require("express")
const router = express.Router()

//IMPORT DE LOS CONTROLLERS
const especialistasController = require("../controllers/especialistasController")
const clientesController = require("../controllers/clientesController")
const adminController = require("../controllers/adminController")

//ADMIN
router.post("/admin/login", adminController.login)
router.post("/admin/logout", adminController.logout)
router.get("/admin/retornarClientes", adminController.retornarClientes)
router.post("/admin/retornarCliente", adminController.retornarCliente)
router.post("/admin/banCliente", adminController.banCliente)
router.post("/admin/deleteCliente", adminController.deleteCliente)
router.get("/admin/retornarEspecialistas", adminController.retornarEspecialistas)
router.post("/admin/retornarEspecialista", adminController.retornarEspecialista)
router.post("/admin/banEspecialista", adminController.banEspecialista)
router.post("/admin/deleteEspecialista", adminController.deleteEspecialista)

//ESPECIALISTAS

router.post("/especialistas/login", especialistasController.login)
router.post("/especialistas/register", especialistasController.register)
router.post("/especialistas/editarPerfil", especialistasController.editarPerfil)
router.post("/especialistas/getPerfil", especialistasController.getPerfil)
router.post("/especialistas/getSolicitudesTrabajos", especialistasController.getSolicitudesTrabajos)
router.post("/especialistas/aceptarTrabajo", especialistasController.aceptarTrabajo)
router.post("/especialistas/trabajosEnCurso", especialistasController.trabajosEnCurso)
router.post("/especialistas/trabajosTerminados", especialistasController.trabajosTerminados)
router.post("/especialistas/finalizarTrabajo", especialistasController.finalizarTrabajo)
router.post("/especialistas/logout", especialistasController.logout)

//CLIENTES

router.post("/clientes/login", clientesController.login)
router.post("/clientes/register", clientesController.register)
router.post("/clientes/logout", clientesController.logout)
router.post("/clientes/getCuenta", clientesController.getCuenta)
router.post("/clientes/editarCuenta", clientesController.editarCuenta)
router.post("/clientes/solicitarTrabajo", clientesController.solicitarTrabajo)
router.post("/buscar", clientesController.buscarEspecialista)
module.exports = router