const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

// Login usuario
const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email',
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.state) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - state: false',
            });
        }

        // Verificar la contraseña
        // Compara el password que llega con el guardado en la BD
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password',
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }

}

// Google SignIn - Backend
const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        // extraer lo necesario
        const { nombre, email, img } = await googleVerify(id_token); // Verificar token de google (que sea valido)

        // verificar si el email existe
        let usuario = await Usuario.findOne({ email });

        // si el usuario no existe
        if (!usuario) {
            // tengo que crearlo

            const data = {
                nombre,
                email,
                // no importa como enviemos la password (porque esta es de google)
                password: ':P',
                img,
                google: true,
            };

            // crear modelo usario con datos
            usuario = new Usuario(data);

            // guardar usuario
            await usuario.save();
        }

        // Si el usuario en DB esta bloqueado (status: false)
        if (!usuario.state) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado',
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido',
        });
    }

}

module.exports = {
    login,
    googleSignIn,
}