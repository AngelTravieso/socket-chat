// * REFERENCIAS HTML

const formulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost')) ?
    'http://localhost:8082/api/auth' :
    'https://socket-chat-2945.onrender.com/api/auth';
let googleId;


// * EVENTOS

formulario.addEventListener('submit', evt => {
    evt.preventDefault();

    const formData = {}

    for (let el of formulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(`${url}/login`, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(resp => resp.json())
        .then(({
            msg,
            token
        }) => {
            if (msg) {
                return console.error(msg);
            }

            // Grabar nuevo token (que devuelve mi backend)
            localStorage.setItem('token', token);

            // Redireccionar al chat
            window.location = 'chat.html';

        })
        .catch(err => {
            console.log(err);
        });

});


// boton de salir
const button = document.getElementById("g_id_signout")

window.onload = function () {
    google.accounts.id.initialize({
        // GOOGLE_CLIENT_ID
        client_id: "656202371387-3f9mk4s8qvb360ff1hghsjnuj3mmv2gg.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        // ID en html del boton
        document.getElementById("buttonDiv"), {
            // Personalizar botón
            type: "standard",
            shape: "pill",
            theme: "filled_black",
            size: "large",
            text: "Iniciar sesión con Google",
            locales: "es",
            // El boton personalizado no se muestra si el width es menor a 200
            width: "250",
        }
    );

    // Mostrar dialogo de Google
    google.accounts.id.prompt();

    // Escuchar la respuesta de la credenciales
    function handleCredentialResponse(response) {

        const responsePayload = parseJwt(response.credential);

        // Google ID
        googleId = responsePayload.sub;

        // JWT Google
        let id_token = response.credential;

        const dataGoogle = {
            "ID Google": googleId,
            "Full Name": responsePayload.name,
            "Given Name": responsePayload.given_name,
            "Last Name": responsePayload.family_name,
            "Image URL": responsePayload.picture,
            "Email": responsePayload.email
        }

        const data = {
            id_token
        };

        // enviar token al backend
        fetch(`${url}/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // JWT Google
                body: JSON.stringify(data),
            })
            .then(resp => resp.json())
            // Solo me interesa obtener el token para validar
            .then(({ msg, token }) => {

                if (msg) {
                    return console.error(msg);
                }

                // Guardar en localStorage
                localStorage.setItem('token', token);

                // Redireccionar al chat
                window.location = 'chat.html';

            })
            .catch(console.log);

    }


    // cerrar sesion
    function closeSession(googleId) {

        // https://developers.google.com/identity/gsi/web/guides/revoke

        // se puede pasar el id o el correo del usuario logueado
        google.accounts.id.revoke(googleId, done => {

            try {
                // sesion cerrada correctamente
                console.log(`Usuario ${googleId} ha cerrado sesión: ${done.successful}`);
            } catch (error) {
                console.log(error);
                // hubo algun error
                console.log(done.error);

            }

        });
    }

    // evento click para cerrar sesión a google
    button.addEventListener("click", () => closeSession(googleId));


    // Parsear jwt
    function parseJwt(token) {
        // toma el payload del token
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');

        /*
            codificar
            btoa() codifica un string en Base64

            decodificar
            atob() función que decodifica un String cuya
            data ha sido codificada en Base64
        */
        return JSON.parse(window.atob(base64));
    };
}