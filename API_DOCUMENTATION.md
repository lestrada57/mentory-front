# Documentación de la API de Mentory

Esta documentación describe los endpoints disponibles en la API de Mentory para la integración con el frontend.

## URL Base
La URL base para todas las peticiones a la API es:
`https://mentory-production.up.railway.app` (Entorno de Producción)

## Autenticación (Auth)

Endpoints públicos para registro e inicio de sesión.

### Registro (`POST /api/auth/signup`)
Registra un nuevo usuario en la plataforma.

**Body (JSON):**
```json
{
  "nombres": "Juan",
  "apellidos": "Perez",
  "email": "juan.perez@example.com",
  "password": "securePassword123",
  "rolId": 3
}
```

### Iniciar Sesión (`POST /api/auth/login`)
Autentica a un usuario y devuelve un token JWT.

**Body (JSON):**
```json
{
  "email": "juan.perez@example.com",
  "password": "securePassword123"
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "email": "juan.perez@example.com",
  "rol": "ESTUDIANTE"
}
```

---

## Gestión de Cursos (Admin)

Requiere rol `ADMINISTRADOR`. Se debe enviar el token JWT en el header `Authorization: Bearer <token>`.

### Listar Cursos (`GET /api/cursos`)
Obtiene todos los cursos registrados.

### Obtener Curso (`GET /api/cursos/{id}`)
Obtiene los detalles de un curso específico.

### Crear Curso (`POST /api/cursos`)
Crea un nuevo curso.

**Body (JSON):**
```json
{
  "nombre": "Java Avanzado",
  "descripcion": "Curso completo de Java Spring Boot",
  "precio": 150.00,
  "docenteId": 5,
  "estado": "ACTIVO"
}
```

### Actualizar Curso (`PUT /api/cursos/{id}`)
Actualiza los datos de un curso existente.

**Body (JSON):**
```json
{
  "nombre": "Java Avanzado v2",
  "descripcion": "Curso actualizado",
  "precio": 200.00,
  "docenteId": 5,
  "estado": "ACTIVO"
}
```

### Eliminar Curso (`DELETE /api/cursos/{id}`)
Elimina un curso por su ID.

---

## Gestión de Sesiones (Admin)

Requiere rol `ADMINISTRADOR`. Las sesiones pertenecen a un curso específico.

### Listar Sesiones (`GET /api/cursos/{cursoId}/sesiones`)
Obtiene todas las sesiones de un curso.

### Obtener Sesión (`GET /api/cursos/{cursoId}/sesiones/{sesionId}`)
Obtiene los detalles de una sesión específica dentro de un curso.

### Crear Sesión (`POST /api/cursos/{cursoId}/sesiones`)
Crea una nueva sesión para un curso.

**Body (JSON):**
```json
{
  "titulo": "Introducción a Spring Security",
  "fecha": "2024-04-20T18:00:00",
  "enlaceZoom": "https://zoom.us/j/123456789"
}
```

### Actualizar Sesión (`PUT /api/cursos/{cursoId}/sesiones/{sesionId}`)
Actualiza los datos de una sesión.

**Body (JSON):**
Mismo formato que Crear Sesión.

### Eliminar Sesión (`DELETE /api/cursos/{cursoId}/sesiones/{sesionId}`)
Elimina una sesión de un curso.

---

## Gestión de Usuarios (Admin)

Requiere rol `ADMINISTRADOR`. Permite gestionar docentes, estudiantes y otros administradores.

### Listar Usuarios (`GET /api/usuarios`)
Lista todos los usuarios gestionables (Docentes y Estudiantes, principalmente).

### Obtener Usuario (`GET /api/usuarios/{id}`)
Obtiene los detalles de un usuario.

### Actualizar Usuario (`PUT /api/usuarios/{id}`)
Actualiza la información básica de un usuario.

**Body (JSON):**
```json
{
  "nombres": "Juana",
  "apellidos": "Huaman",
  "email": "juana@test.com",
  "rolId": 2
}
```
*Nota: `rolId` debe corresponder a un rol existente (ej. 2 para DOCENTE, 3 para ESTUDIANTE, etc.).*

### Bloquear Usuario (`PATCH /api/usuarios/{id}/bloquear`)
Desactiva el acceso de un usuario al sistema.

### Activar Usuario (`PATCH /api/usuarios/{id}/activar`)
Reactiva el acceso de un usuario al sistema.

---

## Gestión de Roles y Permisos (Admin)

Requiere rol `ADMINISTRADOR`.

### Roles (`/api/roles`)
*   `GET /api/roles`: Listar roles.
*   `GET /api/roles/{id}`: Obtener rol.
*   `POST /api/roles`: Crear rol. Body: `{ "name": "...", "description": "..." }`
*   `PUT /api/roles/{id}`: Actualizar rol.
*   `DELETE /api/roles/{id}`: Eliminar rol.

### Permisos (`/api/permisos`)
*   `GET /api/permisos`: Listar permisos.
*   `GET /api/permisos/{id}`: Obtener permiso.
*   `POST /api/permisos`: Crear permiso. Body: `{ "name": "...", "code": "..." }`
*   `PUT /api/permisos/{id}`: Actualizar permiso.
*   `DELETE /api/permisos/{id}`: Eliminar permiso.

---

## Otros Endpoints

### Saludo (`GET /api/saludo`)
Endpoint de prueba para verificar que la API está respondiendo.

