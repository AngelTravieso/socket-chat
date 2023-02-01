const {
    Schema,
    model
} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true // solo registros unicos (no duplicados)
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        // validar campos permitidos
        // esto solo valida los Strings
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

// se pueden sobreescribir metodos de mongoose
// debe ser una funcion normal, porque se usa el this
UsuarioSchema.methods.toJSON = function () {
    // genera la instancia con los valores respectivos
    // como un objeto de js

    // sacar objetos de la respuesta
    /*
        saco la __v (version), el password
        y lo demás se almacena en usuario
    */
    const { __v, password, _id, ...usuario } = this.toObject();

    // agregar propiedad uid al usuario (resp http)
    usuario.uid = _id;

    return usuario;
}


/*
mongoose lo vuelve en plural y crea la coleccion usuarios
*/
module.exports = model('Usuario', UsuarioSchema);