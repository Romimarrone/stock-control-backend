# StockControl - Backend

API RESTful para el sistema de **gestión de inventario, catálogo de productos y control de stock**.

Desarrollada con **Node.js**, **Express** y **MongoDB**, con autenticación basada en **JWT** y control de acceso basado en roles.

---

## 🚀 Tecnologías utilizadas

* **[Node.js](https://nodejs.org/)** — Entorno de ejecución.
* **[Express](https://expressjs.com/)** — Framework HTTP para la construcción de la API REST.
* **[MongoDB](https://www.mongodb.com/)** — Base de datos NoSQL.
* **[Mongoose](https://mongoosejs.com/)** — ODM para trabajar con MongoDB.
* **[JSON Web Tokens (JWT)](https://jwt.io/)** — Autenticación y autorización.
* **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)** — Hashing seguro de contraseñas.
* **[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)** — Gestión de peticiones de origen cruzado.
* **[Dotenv](https://github.com/motdotla/dotenv)** — Gestión de variables de entorno.
* **[Nodemon](https://nodemon.io/)** — Recarga automática durante el desarrollo.

---

## 🛠️ Instalación y configuración local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Romimarrone/stock-control-backend.git
cd stock-control-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/stock_db
JWT_SECRET=tu_clave_secreta_aqui
```

> **Importante:** No compartas ni subas el archivo `.env` al repositorio. Las credenciales y secretos deben mantenerse fuera del control de versiones.

### 4. Ejecutar en entorno de desarrollo

```bash
npm run dev
```

La API se iniciará utilizando **Nodemon**, permitiendo reiniciar automáticamente el servidor cuando se detecten cambios en el código.

---

## 📦 Scripts disponibles

| Comando       | Descripción                                                               |
| ------------- | ------------------------------------------------------------------------- |
| `npm run dev` | Inicia la API en modo desarrollo con recarga automática mediante Nodemon. |
| `npm start`   | Ejecuta el servidor en modo producción utilizando Node.js.                |

---

## 📡 API Endpoints

### 🔐 Autenticación

**Base URL:** `/api/auth`

| Método | Endpoint             | Descripción                           | Autenticación |
| ------ | -------------------- | ------------------------------------- | ------------- |
| `POST` | `/api/auth/register` | Registra un nuevo usuario.            | Pública       |
| `POST` | `/api/auth/login`    | Autentica un usuario y genera un JWT. | Pública       |

---

### 📦 Productos

**Base URL:** `/api/products`

| Método   | Endpoint                  | Descripción                                                | Permisos            |
| -------- | ------------------------- | ---------------------------------------------------------- | ------------------- |
| `GET`    | `/api/products`           | Obtiene el listado de productos, con soporte para filtros. | Usuario autenticado |
| `GET`    | `/api/products/:id`       | Obtiene el detalle de un producto específico.              | Usuario autenticado |
| `POST`   | `/api/products`           | Crea un nuevo producto.                                    | Administrador       |
| `PUT`    | `/api/products/:id`       | Actualiza la información de un producto.                   | Usuario autenticado |
| `PATCH`  | `/api/products/:id/stock` | Actualiza el nivel de stock de un producto.                | Usuario autenticado |
| `DELETE` | `/api/products/:id`       | Elimina un producto de la base de datos.                   | Administrador       |

---

## 🔑 Autenticación

La API utiliza **JSON Web Tokens (JWT)** para autenticar las peticiones protegidas.

Después de iniciar sesión correctamente, el cliente recibe un token que debe incluirse en el encabezado `Authorization`:

```http
Authorization: Bearer <token>
```

Las rutas protegidas validan la presencia y autenticidad del token antes de procesar la solicitud.

---

## 🔐 Seguridad y middleware

### Authentication Middleware

`authMiddleware` se encarga de:

* Extraer el JWT del encabezado `Authorization`.
* Validar la estructura y firma del token.
* Identificar al usuario autenticado.
* Rechazar peticiones con tokens inválidos o ausentes.

### Admin Middleware

`adminMiddleware` verifica que el usuario autenticado posea el rol de **Administrador** antes de permitir operaciones administrativas.

Actualmente se utiliza para proteger operaciones como:

* Creación de productos.
* Eliminación de productos.

---

## 🌐 Despliegue en producción

El backend fue desplegado con **Render**.

### Configuración

1. Vincula el repositorio de GitHub con tu proveedor de hosting.
2. Configura las siguientes variables de entorno desde el panel de la plataforma:

```env
PORT=5000
MONGO_URI=<mongodb-connection-string>
JWT_SECRET=<secure-secret>
```

3. Configura el comando de inicio:

```bash
npm start
```

4. Asegúrate de que la base de datos MongoDB permita las conexiones provenientes de la aplicación desplegada.

---

## 🏗️ Arquitectura

El backend está diseñado como una **API RESTful**, separando las responsabilidades relacionadas con:

* Autenticación y autorización.
* Gestión de productos.
* Persistencia de datos.
* Validación de usuarios y permisos.
* Comunicación HTTP mediante endpoints REST.

La aplicación utiliza **middleware de Express** para centralizar responsabilidades transversales como autenticación, autorización y gestión de peticiones.

---

## 📄 Licencia

Este proyecto es de uso privado.
