const fs = require("fs");
const path = require("path");
const {validarArticulo} = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlador de artículos"
    });
}

const curso = (req, res) => {
    console.log("Ruta de prueba OK");
    return res.status(200).json( [{
        curso: "Pruebita",
        autor: "David Canseco",
        url: "davidcanseco.com"
    }, {
        curso: "Pruebita 2",
        autor: "Jhon Tempest",
        url: "jhontempest.com"
    }] );
}

const crear = async (req, res) => {
    // Recoger parámetros por post a guardar
    let parametros = req.body;

    // Validar datos
    try {
        const titulo = typeof parametros.titulo === "string" ? parametros.titulo : "";
        const contenido = typeof parametros.contenido === "string" ? parametros.contenido : "";

        let validar_titulo = !validator.isEmpty(titulo) &&
                             validator.isLength(titulo, { min: 5 });
        let validar_contenido = !validator.isEmpty(contenido);

        if (!validar_titulo || !validar_contenido) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se han validado los datos correctamente"
            });
        }

        // Crear el objeto a guardar
        const articulo = new Articulo(parametros);

        // Guardar el artículo en la base de datos con async/await
        const articuloGuardado = await articulo.save();

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Artículo guardado con éxito"
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha guardado el artículo",
            error: error.message
        });
    }
};

const listar = async (req, res) => {
    try {
        let consulta = Articulo.find({}).sort({ fecha: -1 }); // Ordenar por fecha descendente

        if (req.params.ultimos) {
            consulta = consulta.limit(3); // Limitar a 3 resultados tras ordenar
        }

        const articulos = await consulta.exec();

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos"
            });
        }

        return res.status(200).json({
            status: "success",
            parametro: req.params.ultimos,
            contador: articulos.length,
            articulos
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Error al listar los artículos",
            error: error.message
        });
    }
};

const uno = async (req, res) => {
    try {
        // Recoger un id por la url
        let id = req.params.id;

        // Buscar el artículo
        const articulo = await Articulo.findById(id);

        // Si no existe, devolver error
        if (!articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos!!"
            });
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Error al buscar el artículo (ID no válido o error de consulta)",
            error: error.message
        });
    }
};

const borrar = async (req, res) => {
    try {
        // Recoger el id de la url
        let articulo_id = req.params.id;

        // Buscar el artículo por id y eliminarlo
        const articuloBorrado = await Articulo.findOneAndDelete({ _id: articulo_id });

        if (!articuloBorrado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo para borrar"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "Artículo borrado"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "No se ha podido borrar el artículo",
            error: error.message
        });
    }
};

const editar = async (req, res) => {
    // Recoger el id del artículo por la url
    let articuloId = req.params.id;

    // Recoger los datos que llegan por put
    let parametros = req.body;

    // Validar datos
    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    // Buscar y actualizar el artículo
    try {
        const articuloActualizado = await Articulo.findOneAndUpdate(
            { _id: articuloId },
            req.body,
            { new: true }
        );

        if (!articuloActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo para actualizar"
            });
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            mensaje: "Artículo actualizado correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "No se ha podido actualizar el artículo",
            error: error.message
        });
    }
};

const subir = async (req, res) => {
    try {
        // 1. Recoger el archivo de imagen subido
        if (!req.file && !req.files) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha subido ninguna imagen"
            });
        }

        // 2. Nombre y extensión del archivo
        const archivo = req.file.originalname;
        const extension = path.extname(archivo).toLowerCase().replace(".", "");

        // 3. Comprobar extensión (si no es válida, borrar fichero y devolver error)
        const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
        if (!extensionesValidas.includes(extension)) {
            await fs.promises.unlink(req.file.path);
            return res.status(400).json({
                status: "error",
                mensaje: "La extensión del archivo no es válida"
            });
        }

        // 4. Recoger el id del artículo por la url y actualizarlo
        const articuloId = req.params.id;
        const articuloActualizado = await Articulo.findOneAndUpdate(
            { _id: articuloId },
            { imagen: req.file.filename },
            { new: true }
        );

        if (!articuloActualizado) {
            await fs.promises.unlink(req.file.path);
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo para actualizar"
            });
        }

        // 5. Devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            mensaje: "Artículo actualizado correctamente",
            archivo: req.file
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "No se ha podido actualizar el artículo",
            error: error.message
        });
    }
};
/*
const imagen = async (req, res) => {
    try {
        // Sacar el parámetro de la url de forma segura
        const archivo = path.basename(req.params.archivo || "");

        // Montar el path real de la imagen
        const ruta_fisica = path.join("./imagenes/articulos/", archivo);

        // Comprobar que existe el fichero
        const stats = await fs.promises.stat(ruta_fisica);

        if (stats && stats.isFile()) {
            return res.sendFile(path.resolve(ruta_fisica));
        }

        return res.status(404).json({
            status: "error",
            mensaje: "La imagen no existe",
            existe: false,
            archivo,
            ruta_fisica
        });
    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "La imagen no existe",
            existe: false,
            archivo: req.params.archivo,
            ruta_fisica: path.join("./imagenes/articulos/", path.basename(req.params.archivo || ""))
        });
    }
};*/

const imagen = (req, res) => {
    // Sacar el parámetro de la url
    let archivo = req.params.archivo;
    // Montar el path real de la imagen
    let ruta_fisica = "./imagenes/articulos/" + archivo;
    // Comprobar que existe el fichero
    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                existe,
                archivo,
                ruta_fisica
            });
        }
    });
}

const buscador = async (req, res) => {
    try {
        // Sacar el string a buscar
        let busqueda = req.params.busqueda;
        // Find OR con async/await (sin callback)
        const articulosEncontrados = await Articulo.find({
            "$or": [
                { "titulo": { "$regex": busqueda, "$options": "i" } },
                { "contenido": { "$regex": busqueda, "$options": "i" } }
            ]
        })
        .sort({ fecha: -1 })
        .exec();

        if (!articulosEncontrados || articulosEncontrados.length <= 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos que coincidan con tu búsqueda"
            });
        }

        return res.status(200).json({
            status: "success",
            articulos: articulosEncontrados
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al realizar la búsqueda",
            error: error.message
        });
    }
};

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}