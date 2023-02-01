require('dotenv').config();
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');

const {
    dbConnection
} = require('../database/config');


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8081;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios',
        }

        // Conexión a BD
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body (recibir JSON)
        this.app.use(express.json());

        // Directorio public
        this.app.use(express.static('public'));

        // TempFile options (carga de archivos)
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            // Crea automaticamente el directorio si no existe
            createParentPath: true,
        }));

    }

    routes() {
        // Middleware condicional
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running at port: ${this.port}`);
        });
    }

}

module.exports = Server;