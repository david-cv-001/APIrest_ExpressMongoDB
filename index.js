const {conexion} = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

// Inicializar app
console.log("App de node arrancada");

// Conectar a la base de datos
conexion();

//Crear servidor y escuchar peticiones HTTP
const app = express();
const puerto = 3900;

//Configurar cors
app.use(cors());

//Convertir body a objeto JS
app.use(express.json()); // Recibir datos con content-type app/json - Recibir datos tipo json
app.use(express.urlencoded({extended:true})); // Recibir datos con content-type application/x-www-form-urlencoded

//Rutas
const rutas_articulo = require("./rutas/articulo");

// Cargo las rutas
app.use("/api", rutas_articulo);

//Rutas de prueba harcodeadas
app.get("/probando", (req, res) => {
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
});

app.get("/", (req, res) => {
    console.log("Ruta principal OK");
    return res.status(200).send(
        "<h1>Hola mundo con Node.js y Express</h1>"
    );
});

//Crear servidor y escuchar peticiones HTTP
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto);
});
