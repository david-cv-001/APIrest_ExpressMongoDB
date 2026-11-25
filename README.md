# API REST con Node.js, Express y MongoDB

API para gestionar artículos (crear, listar, editar, borrar, buscar y subir imágenes).

- **Puerto:** `3900`
- **URL base:** `http://localhost:3900`
- **Base de datos:** MongoDB local `mi_blog` (`mongodb://localhost:27017/mi_blog`)

## Requisitos

- [Node.js](https://nodejs.org/) (con npm incluido)
- [MongoDB](https://www.mongodb.com/) corriendo en local en el puerto `27017`

## Instalación (solo la primera vez)

Descarga el proyecto y, desde la carpeta del proyecto, instala las dependencias:

```bash
npm install
```

Esto crea la carpeta `node_modules/`, que está ignorada por Git (no se sube al repositorio). No hace falta repetir este paso salvo que cambie el `package.json` o clones el proyecto en otra máquina.

## Ejecutar la API

```bash
npm start
```

El script usa `nodemon`, así que el servidor se reinicia automáticamente cuando cambias un archivo. Deberías ver:

```text
App de node arrancada
Conectado a la BD mi_blog
Servidor corriendo en el puerto 3900
```

> Si sale `No se ha podido conectar a la BD`, comprueba que MongoDB esté iniciado.

## Endpoints

### Pruebas / raíz

| Método | URL | Descripción |
| --- | --- | --- |
| GET | `/` | Mensaje HTML de bienvenida |
| GET | `/probando` | Devuelve un array de cursos de prueba |
| GET | `/api/ruta-de-prueba` | Respuesta de prueba del controlador |
| GET | `/api/curso` | Devuelve el array de cursos de prueba |

### Artículos

| Método | URL | Descripción |
| --- | --- | --- |
| POST | `/api/crear` | Crear un artículo |
| GET | `/api/articulos` | Listar todos los artículos (más recientes primero) |
| GET | `/api/articulos/:ultimos` | Listar los últimos 3 artículos (el valor del parámetro da igual) |
| GET | `/api/articulo/:id` | Obtener un artículo por su ID |
| PUT | `/api/articulo/:id` | Actualizar un artículo por su ID |
| DELETE | `/api/articulo/:id` | Borrar un artículo por su ID |
| GET | `/api/buscar/:busqueda` | Buscar por título o contenido (sin distinguir mayúsculas) |

### Imágenes

| Método | URL | Descripción |
| --- | --- | --- |
| POST | `/api/subir-imagen/:id` | Subir una imagen (`png`, `jpg`, `jpeg` o `gif`) y asignarla al artículo. Campo del formulario: `file0` |
| GET | `/api/imagen/:archivo` | Devolver una imagen guardada en `imagenes/articulos/` |

El modelo de artículo tiene estos campos: `titulo` (obligatorio, mínimo 5 caracteres), `contenido` (obligatorio), `fecha` (por defecto, la fecha actual), `imagen` (por defecto, `default.png`).

## Ejemplos con curl

Probar que responde:

```bash
curl http://localhost:3900/
curl http://localhost:3900/api/ruta-de-prueba
```

Crear un artículo:

```bash
curl -X POST http://localhost:3900/api/crear \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Mi primer articulo","contenido":"Contenido de prueba"}'
```

Listar artículos:

```bash
curl http://localhost:3900/api/articulos
curl http://localhost:3900/api/articulos/ultimos
```

Obtener, editar y borrar (sustituye `<ID>` por el `_id` devuelto al crear):

```bash
curl http://localhost:3900/api/articulo/<ID>

curl -X PUT http://localhost:3900/api/articulo/<ID> \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Titulo editado","contenido":"Contenido editado"}'

curl -X DELETE http://localhost:3900/api/articulo/<ID>
```

Buscar:

```bash
curl http://localhost:3900/api/buscar/articulo
```

Subir una imagen y verla (sustituye `<ID>` y `<NOMBRE_ARCHIVO>`):

```bash
curl -X POST http://localhost:3900/api/subir-imagen/<ID> \
  -F "file0=@/ruta/a/mi/imagen.jpg"

curl http://localhost:3900/api/imagen/<NOMBRE_ARCHIVO> --output imagen_descargada.jpg
```

> También puedes probar los endpoints desde Postman o Thunder Client, enviando JSON en el body para `POST` y `PUT`, y `form-data` con la clave `file0` para subir imágenes.
