const mongoose = require("mongoose");

const conexion = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/mi_blog");
        // Parámetros obsoletos en las versiones más recientes de Mongoose
        // useNewUrlParser: true,
        // useUnifiedTopology: true
        // useCreateIndex: true

        console.log("Conectado a la BD mi_blog");
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la BD");
    }
};

module.exports = {
    conexion
};