const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Helper para subir archivo
const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');

        // Obtener extension del archivo, busco por la ultima posicion del split
        const extension = nombreCortado[nombreCortado.length - 1];

        // Si la extension no es valida
        if (!extensionesValidas.includes(extension)) {
            // reject de la promesa con el error
            return reject(`La extensión ${extension} no es permitida, solo se permite ${extensionesValidas}`);
        }

        // Cambiar nombre de archivo 
        // Ej:'1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed.png'
        const nombreTemp = uuidv4() + '.' + extension;

        // Path donde se almacenará el archivo
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        // Mover el archivo al directorio uploads
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });
    });


}

module.exports = {
    subirArchivo,
}