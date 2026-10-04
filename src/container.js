// Raiz de composicion: crea repositorios, servicios y controladores e inyecta sus dependencias
const env = require("./config/env")
const crearRepositorios = require("./repositories")
const AuthService = require("./services/AuthService")
const ClienteService = require("./services/ClienteService")
const EspecialistaService = require("./services/EspecialistaService")
const TrabajoService = require("./services/TrabajoService")
const PropiedadService = require("./services/PropiedadService")
const CatalogoService = require("./services/CatalogoService")
const crearAdminController = require("./controllers/adminController")
const crearClientesController = require("./controllers/clientesController")
const crearEspecialistasController = require("./controllers/especialistasController")
const crearPropiedadesController = require("./controllers/propiedadesController")
const crearCatalogosController = require("./controllers/catalogosController")

const MENSAJE_CORREO_INEXISTENTE = "No existen usuarios con ese correo"

const crearContenedor = () => {
    const repositorios = crearRepositorios()

    const comunaService = new CatalogoService(repositorios.comuna)
    const rubroService = new CatalogoService(repositorios.rubro)

    const servicios = {
        comunaService,
        rubroService,
        clienteService: new ClienteService(repositorios.cliente),
        especialistaService: new EspecialistaService(repositorios.especialista, {
            comuna: comunaService,
            rubro: rubroService
        }),
        trabajoService: new TrabajoService({
            trabajoRepository: repositorios.trabajo,
            especialistaRepository: repositorios.especialista,
            clienteRepository: repositorios.cliente
        }),
        propiedadService: new PropiedadService(repositorios.propiedad, { ttlMs: env.propiedadesCacheTtlMs })
    }

    const auth = {
        admin: new AuthService(repositorios.admin, {
            campoIdentificador: "user",
            mensajeUsuarioInexistente: "No existen usuarios con ese nombre de usuario"
        }),
        cliente: new AuthService(repositorios.cliente, {
            campoIdentificador: "email",
            mensajeUsuarioInexistente: MENSAJE_CORREO_INEXISTENTE
        }),
        especialista: new AuthService(repositorios.especialista, {
            campoIdentificador: "email",
            mensajeUsuarioInexistente: MENSAJE_CORREO_INEXISTENTE
        })
    }

    const controladores = {
        admin: crearAdminController({ ...servicios, authService: auth.admin }),
        clientes: crearClientesController({ ...servicios, authService: auth.cliente }),
        especialistas: crearEspecialistasController({ ...servicios, authService: auth.especialista }),
        propiedades: crearPropiedadesController(servicios),
        catalogos: crearCatalogosController(servicios)
    }

    return { servicios, controladores }
}

module.exports = crearContenedor
