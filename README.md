# Backend Checkpoint Jorge Infante

## Resumen

Proyecto desarrollado en Node.js (JavaScript) + Express + MongoDB (Mongoose). Implementa CRUDs para Users, Trucks, Locations y Orders. Autenticación con JWT.

## Cómo correr

1. Clonar el repositorio.
2. Copiar el archivo `.env.example` a `.env` y completar las credenciales necesarias.
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Iniciar el servidor en modo desarrollo

   ```bash
   npm run dev
   ```

---

## 📌 Endpoints principales

### 🔑 Auth

- **POST** `/api/auth/register`:
  Registro de un nuevo usuario.

- **POST** `/api/auth/login`:
  Inicio de sesión y obtención de token JWT.

---

### 👤 Users

- **GET** `/api/users`:
  Listar todos los usuarios.

- **GET** `/api/users/:id`:
  Obtener un usuario por ID.

- **POST** `/api/users`:
  Crear un nuevo usuario.

- **PATCH** `/api/users/:id`:
  Actualizar un usuario por ID.

- **DELETE** `/api/users/:id`:
  Eliminar un usuario por ID.

---

### 🚚 Trucks

- **GET** `/api/trucks`:
  Listar todos los camiones.

- **GET** `/api/trucks/:id`:
  Obtener un camión por ID.

- **POST** `/api/trucks`:
  Crear un nuevo camión.

- **PATCH** `/api/trucks/:id`:
  Actualizar un camión por ID.

- **DELETE** `/api/trucks/:id`:
  Eliminar un camión por ID.

---

### 📍 Locations

- **GET** `/api/locations`:
  Listar todas las ubicaciones.

- **GET** `/api/locations/:id`:
  Obtener una ubicación por ID.

- **POST** `/api/locations`:
  Crear una nueva ubicación (integración con Google Places API).

- **PATCH** `/api/locations/:id`:
  Actualizar una ubicación por ID.

- **DELETE** `/api/locations/:id`:
  Eliminar una ubicación por ID.

---

### 📦 Orders

- **POST** `/api/orders`:
  Crear una nueva orden.

- **GET** `/api/orders`:
  Listar órdenes con filtros opcionales (`status`, `page`, `limit`).

- **GET** `/api/orders/:id`:
  Obtener una orden por ID.

- **PATCH** `/api/orders/:id`:
  Actualizar una orden por ID.

- **DELETE** `/api/orders/:id`:
  Eliminar una orden por ID.

---

## ✅ Validaciones

- Se utiliza **Joi** para validar los payloads en cada endpoint.
- Garantiza que los datos enviados cumplan con los requisitos esperados.

---

## 🔒 Autenticación

- La autenticación se realiza mediante **JWT**.
- Los tokens deben enviarse en el header:

  ```http
  Authorization: Bearer <token>
  ```

- Todos los endpoints (excepto los de autenticación) requieren un token válido.

---

## ⚙️ Diseño y decisiones técnicas

- **Mongoose** como ODM para interactuar con MongoDB.
- Uso de **aggregations** para listar órdenes con datos embebidos (usuario, camión, origen y destino).
- Validación de relaciones (usuarios, camiones, ubicaciones) antes de crear una orden.
- Creación de índices en campos frecuentemente consultados para optimizar el rendimiento.

---

## 🌿 Branching

- Cada dominio se desarrolló en su propia rama:

  - `feature/users`
  - `feature/trucks`
  - `feature/locations`
  - `feature/orders`

- Rama base: `server-base` (configuración inicial del servidor).
- Refactorización de errores en: `chor/refactor-errors-readme` (se movió `CustomError` y propiedades a `utils/errors`).

---

## 🛠️ Cómo abordé el desarrollo

El desarrollo se realizó de manera incremental, siguiendo un enfoque modular y priorizando las dependencias entre entidades:

1. **Users**:
   Se comenzó desarrollando el CRUD de usuarios, ya que es la base para la autenticación y autorización del sistema.
2. **Trucks**:
   Una vez que los usuarios estaban implementados, se desarrolló el CRUD de camiones, que es una de las entidades principales del sistema.
3. **Locations**:
   Posteriormente, se implementó el CRUD de ubicaciones, integrando la API de Google Places para obtener datos enriquecidos sobre las ubicaciones.
4. **Orders**:
   Finalmente, se desarrolló el CRUD de órdenes, ya que esta entidad engloba las anteriores (usuarios, camiones y ubicaciones). Se implementaron validaciones para asegurar que las relaciones entre estas entidades existieran antes de crear una orden.

Este enfoque permitió construir el sistema de manera progresiva, asegurando que cada entidad estuviera completamente funcional antes de avanzar a la siguiente.
