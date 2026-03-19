# Guía de Configuración y Prueba - Mentory Frontend

## Servidor en Ejecución

El servidor de desarrollo está corriendo en:
- **Local**: http://localhost:8081/
- **Red**: http://192.168.18.98:8081/

## Pasos para Probar

### 1. Login/Crear Usuario

Primero necesitas tener un usuario registrado en el backend.

**Opción A: Si ya tienes un usuario en la BD**
- Ve a http://localhost:8081/login
- Ingresa tus credenciales
- Ejemplo:
  - Email: `admin@mentory.com`
  - Password: `password123`

**Opción B: Crear un nuevo usuario (via API)**
1. Abre un terminal/Postman y ejecuta:
```bash
curl -X POST "https://mentory-production.up.railway.app/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Admin",
    "apellidos": "Test",
    "email": "admin@test.com",
    "password": "Admin123!",
    "rolId": 1
  }'
```

2. Luego, usa esas credenciales para hacer login en la aplicación

### 2. Navegar a Gestión de Cursos

1. Después de hacer login como **Admin**:
   - Click en el menú lateral > "Gestión" > "Cursos"
   - O accede directamente a: http://localhost:8081/cursos

### 3. Crear un Curso de Prueba

1. Click en "Nuevo Curso"
2. Llena los campos:
   - **Nombre**: "React Avanzado"
   - **Descripción**: "Aprende React avanzado"
   - **Precio**: "150.00"
   - **Imagen**: (Opcional) Selecciona una imagen
   - **Estado**: ACTIVO
3. Click en "Crear"

### 4. Verificar Que los Cursos Se Carguen

- Deberías ver la tabla actualizada con tus cursos
- Si hay cursos, verás:
  - Imagen thumbnail
  - Nombre del curso
  - Descripción
  - Precio
  - Estado (Activo/Inactivo)
  - Botones de Editar/Eliminar

## Solución de Problemas

### "Cursos no cargan" / "Pantalla vacía"

**1. Verifica que estés autenticado**
   - Abre la consola de desarrollador (F12)
   - Revisa en Application/Storage > localStorage
   - Deberías ver `mentory_token` y `mentory_user`

**2. Verifica la consola para errores**
   - Abre F12 > Console
   - Busca errores en rojo
   - Los errores comunes son:
     - "401 Unauthorized" = Token expirado o inválido
     - "404 Not Found" = Endpoint incorrecto
     - "Network Error" = Backend no accesible

**3. Verifica que el backend esté disponible**
   ```bash
   curl "https://mentory-production.up.railway.app/api/saludo"
   ```
   - Si ves una respuesta, el backend está funcionando

**4. Verifica tu rol**
   - Debes estar logeado como **Admin** o **Docente** para ver cursos
   - Los roles disponibles son:
     - **Admin** (rolId: 1) - acceso total
     - **Docente** (rolId: 2) - solo sus cursos
     - **Estudiante** (rolId: 3) - sin acceso a gestión

### Si después de crear un usuario no puedes hacer login

1. Verifica que el usuario se creó correctamente
2. Intenta hacer login directamente via API:
```bash
curl -X POST "https://mentory-production.up.railway.app/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }'
```
- Si ves un token en la respuesta, el usuario existe
- Si ves error, el usuario no se creó o las credenciales son incorrectas

## Funcionalidades Disponibles

### Admin
- ✅ Dashboard con datos reales
- ✅ Gestión de Usuarios (crear, editar, bloquear/activar)
- ✅ Gestión de Cursos (crear, editar, eliminar, con imágenes)
- ✅ Ver Ventas (placeholder por ahora)

### Docente
- ✅ Dashboard personalizado
- ✅ Gestión de sus propios cursos (crear, editar, eliminar)
- ⏳ Contenidos (en desarrollo)
- ⏳ Evaluaciones (en desarrollo)

### Estudiante
- ✅ Dashboard personalizado
- ⏳ Mis Cursos (en desarrollo)
- ⏳ Entregas (en desarrollo)
- ⏳ Rendimiento (en desarrollo)

## Endpoints Disponibles

### Autenticación
```
POST /api/auth/login
POST /api/auth/signup

GET /api/saludo (test)
```

### Cursos
```
GET  /api/cursos
POST /api/cursos
PUT  /api/cursos/{id}
DELETE /api/cursos/{id}
```

### Usuarios
```
GET  /api/usuarios
PUT  /api/usuarios/{id}
PATCH /api/usuarios/{id}/bloquear
PATCH /api/usuarios/{id}/activar
```

### Contenidos
```
POST /api/contenidos/upload
GET  /api/contenidos/{id}/download
```

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar pruebas
npm run test

# Linter
npm run lint
```

## Notas Importantes

1. **Token JWT**:
   - Se almacena en localStorage
   - Se incluye automáticamente en todas las requests
   - Expira después de cierto tiempo (configurable en backend)

2. **Imágenes en Cursos**:
   - Actualmente se almacenan como base64
   - Para producción, es recomendable usar MinIO/S3
   - El campo `imagen` es opcional

3. **Formatos de Documento**:
   - Precio: números decimales (ej: 150.00)
   - Fecha: formato ISO (ej: 2024-03-19T10:00:00)
   - Estado activados: ACTIVO, INACTIVO, ARCHIVADO

4. **Validaciones**:
   - Email único
   - Contraseña secura (recomendado)
   - Nombre y apellido requeridos
   - Precio numérico positivo

## Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend
3. Verifica que el token no haya expirado
4. Intenta hacer logout y login nuevamente
