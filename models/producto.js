const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
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
        // Colección al que se hace referencia
        ref: 'Usuario',
        // Todas las categorias deben tener un usuario
        required: true,
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        // tiene que venir la categoría
        required: true,
    },
    descripcion: { type: String, },
    disponible: { type: Boolean, default: true },
    img: { type: String },

});


ProductoSchema.methods.toJSON = function () {
    // quitar __v, state de la response
    // no me interesa enviar siempre el state si es true
    const { __v, state, ...producto } = this.toObject();

    return producto;

}

module.exports = model('Producto', ProductoSchema);