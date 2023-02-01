const mongoose = require('mongoose');


const dbConnection = async () => {

    try {
        // conexion
        await mongoose.connect(process.env.MONGODB_CONN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });

        console.log('BD online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al conectarse a la BD');
    }

}

// se exporta por nombre si en un futuro puedo tener más módulos
// (funciones)
module.exports = {
    dbConnection
}