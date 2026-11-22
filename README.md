# API REST — Catálogo de Productos y Favoritos Personales (Node.js + Express + JWT)

## Integrantes
- **Carlos Saltos**
- **Paul Mendoza**

## Propósito y Elección de Base de Datos
API REST modular desarrollada con **Node.js** y **Express** para gestionar un catálogo público de productos (con escritura restringida a administradores) y listas personales de favoritos aisladas por usuario mediante autenticación **JWT**.
Se seleccionó **PostgreSQL** por su integridad referencial (`FOREIGN KEY ... ON DELETE CASCADE`), restricciones `UNIQUE (usuario_id, producto_id)` y consultas parametrizadas con `pg`.

## Requisitos e Instalación
1. Tener instalado **Node.js 18+** y **PostgreSQL 14+**.
2. Crear la base de datos `catalogo_favoritos_db` en PostgreSQL.
3. Clonar el repositorio e instalar dependencias:
   ```bash
   npm install
   ```
4. Copiar `.env.example` a `.env` y configurar las credenciales locales:
   ```bash
   cp .env.example .env
   ```
5. Inicializar tablas, usuario administrador y los 5 productos de ejemplo:
   ```bash
   npm run init:db
   ```
6. Ejecutar el servidor:
   ```bash
   npm start
   ```

## Rutas de la API (`/api`)
- `POST /api/auth/registro` — Público. Registra usuario normal (`rol: 'usuario'`).
- `POST /api/auth/login` — Público. Valida credenciales y emite JWT con expiración.
- `GET /api/productos` — Público. Lista productos y permite filtrar con `?categoria=...`.
- `GET /api/productos/:id` — Público. Consulta un producto por ID.
- `POST /api/productos` — Admin. Crea un producto (`precio > 0`).
- `PUT /api/productos/:id` — Admin. Actualiza un producto.
- `DELETE /api/productos/:id` — Admin. Elimina un producto y sus favoritos asociados en cascada.
- `GET /api/favoritos` — Autenticado. Lista favoritos del usuario del token JWT.
- `POST /api/favoritos` — Autenticado. Agrega `productoId` a favoritos (rechaza duplicados con `409`).
- `DELETE /api/favoritos/:productoId` — Autenticado. Quita un producto de los favoritos del usuario autenticado.

## Pruebas Reproducibles
Importar `postman/Catalogo_Favoritos_API.postman_collection.json` y `postman/Catalogo_Local.postman_environment.json` en Postman y ejecutar las peticiones en orden.
