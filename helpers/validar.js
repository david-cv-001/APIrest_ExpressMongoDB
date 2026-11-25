const validator = require("validator");

const validarArticulo = (parametros) => {
    let validar_titutlo = !validator.isEmpty(parametros.titulo) &&
                          validator.isLength(parametros.titulo, {min: 5, max: undefined});
    let validar_contenido = !validator.isEmpty(parametros.contenido);

    if (!validar_titutlo || !validar_contenido) {
        throw new Error("Los datos no son válidos");
    }
}

module.exports = {
    validarArticulo
};