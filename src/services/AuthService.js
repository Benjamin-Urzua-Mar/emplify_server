const ErrorNegocio = require("../errors/ErrorNegocio")
const { CODIGO } = require("../utils/Constantes")

// Valida credenciales contra cualquier repositorio de usuarios
class AuthService {
    constructor(repositorio, { campoIdentificador, mensajeUsuarioInexistente }) {
        this.repositorio = repositorio
        this.campoIdentificador = campoIdentificador
        this.mensajeUsuarioInexistente = mensajeUsuarioInexistente
    }

    async autenticar(identificador, contrasena) {
        const usuario = await this.repositorio.buscarUno({ [this.campoIdentificador]: identificador })
        if (!usuario) {
            throw new ErrorNegocio(CODIGO.USUARIO_INEXISTENTE, this.mensajeUsuarioInexistente)
        }
        if (usuario.contrasena !== String(contrasena)) {
            throw new ErrorNegocio(CODIGO.CONTRASENA_INCORRECTA, "La contraseña no coincide")
        }
        // Solo clientes y especialistas tienen `estado`; false significa baneado por un administrador
        if (usuario.estado === false) {
            throw new ErrorNegocio(CODIGO.CUENTA_SUSPENDIDA, "Tu cuenta está suspendida. Contacta a soporte.")
        }
        return usuario
    }
}

module.exports = AuthService
