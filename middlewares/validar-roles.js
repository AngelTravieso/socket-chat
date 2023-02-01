const { response } = require("express")

// Verificar si el rol que llega es ADMIN_ROLE (administrador)
const esAdminRole = (req, res = response, next) => {

    // No se ha validado bien
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero',
        });
    }

    const { rol, nombre } = req.usuario;

    // Si no tiene rol de ADMIN_ROLE no puede hacer x acción
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - no puede hacer esto`,
        });
    }

    next();

}

// Validar que el rol que llega en la req este en la BD (sea permitido)
const tieneRole = (...roles) => { // spread para agarrar todos los argumentos
    // retorno una funcion que se va a ejecutar
    return (req, res = response, next) => {
        // console.log(roles, req.usuario.rol);

        // No se ha validado bien
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero',
            });
        }

        // Verificar si el rol que llega es permitido para tal accion
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${roles}`,
            });
        }

        next();

    };
}

module.exports = {
    esAdminRole,
    tieneRole,
}