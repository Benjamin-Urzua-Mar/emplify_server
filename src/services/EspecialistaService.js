const UsuarioService = require("./UsuarioService")
const ErrorNegocio = require("../errors/ErrorNegocio")
const { CODIGO } = require("../utils/Constantes")
const { primerValor, nombresDeArchivos } = require("../utils/formulario")

const CAMPOS_BUSQUEDA = ["region", "provincia", "comuna", "rubro", "profesion"]
const CAMPOS_REFERENCIA = ["comuna", "rubro"]

const VALORES_INICIALES = Object.freeze({
    disponibilidad: "Disponible",
    estado: true,
    plan: "Corriente"
})

class EspecialistaService extends UsuarioService {
    // `catalogos` resuelve las FK: { comuna: CatalogoService, rubro: CatalogoService }
    constructor(repositorio, catalogos) {
        super(repositorio)
        this.catalogos = catalogos
    }

    async registrar(campos, archivos) {
        const campo = nombre => primerValor(campos, nombre)
        const referencias = await this.#resolverReferencias({ comuna: campo("comuna"), rubro: campo("rubro") })
        const invalida = CAMPOS_REFERENCIA.find(nombre => !referencias[nombre])
        if (invalida) {
            throw new ErrorNegocio(CODIGO.SIN_RESULTADOS, `El valor de ${invalida} "${campo(invalida) ?? ""}" no existe`)
        }

        return this.repositorio.crear({
            nombres: campo("nombres"),
            apellidos: campo("apellidos"),
            contrasena: campo("contrasena"),
            email: campo("email"),
            telefono: campo("telefono"),
            run: campo("run"),
            region: campo("region"),
            provincia: campo("provincia"),
            comuna: referencias.comuna,
            direccion: campo("direccion"),
            rubro: referencias.rubro,
            profesion: campo("profesion"),
            file_cedIdentidad: nombresDeArchivos(archivos, "cedIdentidad")[0],
            file_certResidencia: nombresDeArchivos(archivos, "certResidencia")[0],
            file_titulosProfesionales: nombresDeArchivos(archivos, "tituloProfesional"),
            file_certAntecedentes: nombresDeArchivos(archivos, "certAntecedentes")[0],
            ...VALORES_INICIALES,
            fechaRegistro: new Date()
        })
    }

    // El front envia la foto con el RUN del especialista como nombre de campo
    configurarPerfil(campos, archivos) {
        const [run] = Object.keys(archivos)
        if (!run) {
            throw new ErrorNegocio(CODIGO.ERROR_ARCHIVOS, "No se recibió la foto de perfil")
        }

        const perfil = {
            foto: archivos[run][0].newFilename,
            experiencia: (campos.experiencia ?? []).toString(),
            antiguedad: 0,
            trabajosRealizados: [],
            servicios: this.#extraerServicios(campos),
            comentarios: []
        }
        return this.repositorio.actualizarUno({ run }, { perfil })
    }

    // Solo se aceptan filtros de texto sobre campos conocidos (evita inyeccion de operadores).
    // Comuna y rubro pueden venir como _id o como nombre.
    async buscar(criterios) {
        const filtro = Object.fromEntries(
            Object.entries(criterios).filter(([campo, valor]) =>
                CAMPOS_BUSQUEDA.includes(campo) && typeof valor === "string")
        )
        const referencias = await this.#resolverReferencias(filtro)
        if (Object.values(referencias).includes(null)) return []

        return this.repositorio.buscarTodos({ ...filtro, ...referencias })
    }

    async obtenerFotoPerfil(id) {
        const especialista = await this.repositorio.buscarPorId(id, "perfil")
        return especialista?.perfil?.foto ?? null
    }

    // { comuna: "Ñuñoa" } -> { comuna: ObjectId | null }; omite las referencias no informadas
    async #resolverReferencias(valores) {
        const presentes = CAMPOS_REFERENCIA.filter(nombre => valores[nombre] !== undefined)
        const ids = await Promise.all(presentes.map(nombre => this.catalogos[nombre].resolverId(valores[nombre])))
        return Object.fromEntries(presentes.map((nombre, i) => [nombre, ids[i]]))
    }

    // Los campos trabajo_N y precio_N se emparejan por orden: [{ trabajo: precio }]
    #extraerServicios(campos) {
        const valoresDe = fragmento => Object.entries(campos)
            .filter(([nombre]) => nombre.includes(fragmento))
            .map(([, valor]) => valor.toString())

        const precios = valoresDe("precio")
        return valoresDe("trabajo").map((trabajo, i) => ({ [trabajo]: precios[i] }))
    }
}

module.exports = EspecialistaService
