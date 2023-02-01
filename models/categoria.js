const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    state: {
        type: Boolean,
        default: true,
        required: true,
    },
    usuario: {
        // Para hacer referencia a un ID
        type: Schema.Types.ObjectId,
        // Modelo al que se hace referencia
        ref: 'Usuario',
        // Todas las categorias deben tener un usuario
        required: true,
    },

});


CategoriaSchema.methods.toJSON = function () {
    // quitar __v, state de la response
    // no me interesa enviar siempre el state si es true
    const { __v, state, ...categoria } = this.toObject();

    return categoria;

}

module.exports = model('Categoria', CategoriaSchema);