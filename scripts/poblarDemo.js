// Puebla la base con datos ficticios para la demo (clientes, profesionales, admin, solicitudes y trabajos).
// Es idempotente: identifica las cuentas por email/usuario y restaura su estado inicial en cada ejecucion,
// por lo que tambien sirve para limpiar la demo despues de que alguien la pruebe.
// Uso: node scripts/poblarDemo.js
const mongoose = require("mongoose")
const conectarBaseDatos = require("../src/config/database")
const Admin = require("../src/models/Admin")
const Cliente = require("../src/models/Cliente")
const Especialista = require("../src/models/Especialista")
const Trabajo = require("../src/models/Trabajo")
const Comuna = require("../src/models/Comuna")
const Rubro = require("../src/models/Rubro")
const { ESTADO_TRABAJO } = require("../src/utils/Constantes")
const { cargarCatalogos } = require("./lib/catalogos")
const demo = require("./demo/datosDemo")

const UN_DIA_MS = 24 * 60 * 60 * 1000
const haceDias = dias => new Date(Date.now() - dias * UN_DIA_MS)
const enDias = dias => new Date(Date.now() + dias * UN_DIA_MS).toISOString().slice(0, 10)

// RUN chileno con digito verificador valido (modulo 11): 12345678 -> "12.345.678-5"
const formatearRun = numero => {
    let suma = 0
    let factor = 2
    for (const digito of String(numero).split("").reverse()) {
        suma += Number(digito) * factor
        factor = factor === 7 ? 2 : factor + 1
    }
    const resto = 11 - (suma % 11)
    const dv = resto === 11 ? "0" : resto === 10 ? "K" : String(resto)
    return `${numero.toLocaleString("es-CL")}-${dv}`
}

const runDemo = indice => formatearRun(12000000 + indice * 371911)
const telefonoDemo = indice => 911000000 + indice * 10301

const cargarReferencias = async () => {
    const [comunas, rubros] = await Promise.all([Comuna.find().lean(), Rubro.find().lean()])
    const porNombre = lista => new Map(lista.map(item => [item.nombre, item]))
    return { comunas: porNombre(comunas), rubros: porNombre(rubros) }
}

const buscarEn = (mapa, nombre, tipo) => {
    const item = mapa.get(nombre)
    if (!item) throw new Error(`${tipo} "${nombre}" no existe en el catálogo`)
    return item
}

const upsert = (Modelo, filtro, datos) =>
    Modelo.findOneAndUpdate(filtro, { $set: datos }, { upsert: true, new: true, setDefaultsOnInsert: true })

const poblarAdmin = () => upsert(Admin, { user: demo.admin.user }, demo.admin)

const poblarClientes = async referencias => {
    const ids = {}
    for (const [i, cliente] of demo.clientes.entries()) {
        const comuna = buscarEn(referencias.comunas, cliente.comuna, "Comuna")
        const email = demo.emailDe(cliente.nombres, cliente.apellidos)
        const documento = await upsert(Cliente, { email }, {
            nombres: cliente.nombres,
            apellidos: cliente.apellidos,
            email,
            contrasena: demo.CLAVE_DEMO,
            telefono: telefonoDemo(i),
            run: runDemo(i),
            fechaNacto: new Date(1985 + i * 2, i, 10 + i),
            region: comuna.region,
            provincia: comuna.provincia,
            comuna: comuna.nombre,
            direccion: cliente.direccion,
            estado: true,
            fechaRegistro: haceDias(30 + i * 45)
        })
        ids[cliente.clave] = documento._id
    }
    return ids
}

const perfilDe = (antiguedad, experiencia, servicios, { sinPerfil }) => ({
    foto: "",
    experiencia: sinPerfil ? "" : experiencia,
    antiguedad,
    trabajosRealizados: [],
    servicios: servicios.map(([nombre, precio]) => ({ [nombre]: String(precio) })),
    comentarios: []
})

const poblarEspecialistas = async referencias => {
    const ids = {}
    for (const [i, fila] of demo.especialistas.entries()) {
        const [clave, nombres, apellidos, nombreComuna, nombreRubro, profesion, antiguedad, experiencia, servicios, opciones = {}] = fila
        const comuna = buscarEn(referencias.comunas, nombreComuna, "Comuna")
        const rubro = buscarEn(referencias.rubros, nombreRubro, "Rubro")
        const email = demo.emailDe(nombres, apellidos)
        const documento = await upsert(Especialista, { email }, {
            nombres,
            apellidos,
            contrasena: demo.CLAVE_DEMO,
            email,
            telefono: telefonoDemo(100 + i),
            run: runDemo(100 + i),
            region: comuna.region,
            provincia: comuna.provincia,
            comuna: comuna._id,
            direccion: `Dirección de referencia ${i + 1}, ${comuna.nombre}`,
            file_cedIdentidad: "",
            file_certResidencia: "",
            file_titulosProfesionales: [],
            file_certAntecedentes: "",
            rubro: rubro._id,
            profesion,
            disponibilidad: opciones.disponibilidad ?? "Disponible",
            estado: true,
            plan: opciones.plan ?? "Corriente",
            fechaRegistro: haceDias(Math.max(antiguedad, 1) * 365),
            perfil: perfilDe(antiguedad, experiencia, servicios, opciones),
            solicitudes_trabajo: []
        })
        ids[clave] = documento._id
    }
    return ids
}

// Solicitudes pendientes y trabajos para que los perfiles destacados tengan contenido al iniciar sesion
const ACTIVIDAD = {
    rodrigo: {
        solicitudes: [
            ["francisca", "Instalación de enchufes", "Necesito instalar 3 enchufes dobles en el living.", 3],
            ["matias", "Revisión de tablero eléctrico", "Se corta la luz cuando uso el horno y el microondas a la vez.", 5],
            ["catalina", "Certificación TE1", "Necesito el certificado para la ampliación de mi casa.", 8]
        ],
        enCurso: [
            ["valentina", "Instalación de enchufes", "Enchufes para el escritorio del dormitorio.", -2, 1]
        ],
        terminados: [
            ["valentina", "Revisión de tablero eléctrico", "Cambio de automático de la cocina.", -60, -59],
            ["matias", "Instalación de enchufes", "Enchufes exteriores para la terraza.", -30, -30]
        ]
    },
    carolina: {
        solicitudes: [
            ["matias", "Configuración de correo", "Configurar el correo de la empresa en 4 equipos.", 4]
        ],
        enCurso: [
            ["valentina", "Visita técnica", "El notebook se calienta y se apaga solo.", -1, 2]
        ],
        terminados: [
            ["francisca", "Instalación de impresora", "Impresora WiFi para la casa.", -20, -20]
        ]
    },
    javiera: {
        solicitudes: [],
        enCurso: [],
        terminados: [
            ["valentina", "Mantención de calefont", "Mantención anual del calefont.", -90, -90]
        ]
    }
}

const poblarActividad = async (idsClientes, idsEspecialistas) => {
    await Trabajo.deleteMany({ especialista: { $in: Object.values(idsEspecialistas) } })

    for (const [claveEspecialista, actividad] of Object.entries(ACTIVIDAD)) {
        const especialista = idsEspecialistas[claveEspecialista]

        const solicitudes = actividad.solicitudes.map(([cliente, servicio, descripcion, dias]) => ({
            estado: "",
            cliente: String(idsClientes[cliente]),
            especialista: String(especialista),
            fechaInicio: enDias(dias),
            fechaFin: "",
            descripcion,
            servicio,
            foto: ""
        }))

        const crearTrabajos = (filas, estado) => filas.map(([cliente, servicio, descripcion, inicio, fin]) => ({
            estado,
            cliente: idsClientes[cliente],
            especialista,
            fechaInicio: haceDias(-inicio),
            fechaFin: haceDias(-fin),
            descripcion,
            servicio,
            foto: ""
        }))
        const trabajos = await Trabajo.insertMany([
            ...crearTrabajos(actividad.enCurso, ESTADO_TRABAJO.ACTIVO),
            ...crearTrabajos(actividad.terminados, ESTADO_TRABAJO.TERMINADO)
        ])

        await Especialista.updateOne({ _id: especialista }, {
            $set: { solicitudes_trabajo: solicitudes, "perfil.trabajosRealizados": trabajos.map(t => t._id) }
        })
    }
}

const poblar = async () => {
    await conectarBaseDatos()
    await cargarCatalogos()
    const referencias = await cargarReferencias()

    await poblarAdmin()
    const idsClientes = await poblarClientes(referencias)
    const idsEspecialistas = await poblarEspecialistas(referencias)
    await poblarActividad(idsClientes, idsEspecialistas)

    console.log(`Demo lista: 1 admin, ${Object.keys(idsClientes).length} clientes, ` +
        `${Object.keys(idsEspecialistas).length} profesionales. Clave de todas las cuentas: ${demo.CLAVE_DEMO}`)
}

poblar()
    .catch(error => {
        console.error("Error al poblar la demo:", error)
        process.exitCode = 1
    })
    .finally(() => mongoose.disconnect())
