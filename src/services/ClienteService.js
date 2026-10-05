const UsuarioService = require("./UsuarioService")

class ClienteService extends UsuarioService {
    registrar(datos) {
        return this.repositorio.crear({ ...datos, fechaRegistro: new Date() })
    }
}

module.exports = ClienteService
