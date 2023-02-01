const bcriptjs = require('bcryptjs');


// encriptar campo indicado
// field: String
const hashField = (field) => {
    const salt = bcriptjs.genSaltSync(); // numero de vueltas para hacer mas complicada la desencriptacion (default 10)

    return bcriptjs.hashSync(field, salt);
}

module.exports = {
    hashField
}