const url = (window.location.hostname.includes('localhost')) ?
    'http://localhost:8082/api/auth' :
    'https://cafe-restserver-node-fh.onrender.com/api/auth'

let usuario = null;
let socket = null;

// Validar el token del localstorage
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    // Token no válido
    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const res = await fetch( url, {
        headers: {
            'x-token': token
        }
    });

    const { usuario: userDB, token: tokenDB } = await res.json();

    // console.log(userDB, tokenDB);

    // Renovar token del localstorage
    localStorage.setItem('token', tokenDB);
    usuario = userDB;

}

const main = async () => {

    // Validar JWT
    await validarJWT();

}

main();

// * SOCKETS

// const socket = io();


