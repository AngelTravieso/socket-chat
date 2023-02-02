const url = (window.location.hostname.includes('localhost')) ?
    'http://localhost:8082/api/auth' :
    'https://cafe-restserver-node-fh.onrender.com/api/auth'

let usuario = null;
let socket = null;

// * REFERENCIAS HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

// Validar el token del localstorage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    // Token no válido
    if(token.length <= 10) {
        // Redireccionar al directorio raiz
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }
    
    const res = await fetch( url, {
        headers: {
            'x-token': token
        }
    });

    const { usuario: userDB, token: tokenDB } = await res.json();

    console.log(userDB, tokenDB);

    // Renovar token del localstorage
    localStorage.setItem('token', tokenDB);
    usuario = userDB;

    document.title = usuario.nombre;

    // Solo conexión al socket
    await conectarSocket();

}


const conectarSocket = async () => {
    // Enviar token al socket (para validarlo)
    const socket = io({
        // Headers adicionales en la conexión
        'extraHeaders': {
            'x-token': localStorage.getItem('token'),
        }
    });

    // * EVENTOS DEL SOCKET
    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', () => {
        // TODO
    });

    socket.on('usuarios-activos', () => {
        // TODO
    });

    socket.on('mensaje-privado', () => {
        // TODO
    });

}

const main = async () => {

    // Validar JWT
    await validarJWT();

}

main();

// * SOCKETS




