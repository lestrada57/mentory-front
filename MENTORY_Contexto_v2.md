# MENTORY -- Procesos de Negocio y Documentación del Sistema (Versión Actualizada)

## 1. Contexto General

MENTORY es una empresa de capacitación y especialización profesional
orientada principalmente a ingenieros. Ofrece cursos y programas en
modalidad 100% virtual mediante:

-   Clases sincrónicas vía Zoom.
-   Aula virtual propia para acceso a materiales, videos, presentaciones
    y tareas.

La plataforma busca reemplazar el uso de Excel y Google Classroom,
centralizando la gestión académica y administrativa en un único sistema.

------------------------------------------------------------------------

## 2. Problemática Identificada

### 2.1 Gestión manual con Excel

-   Registro de ventas.
-   Control de asistencias.
-   Cronogramas de clases.
-   Alto riesgo de errores y falta de trazabilidad.

### 2.2 Dependencia de Google Classroom

-   Contenido distribuido en plataformas externas.
-   Falta de control sobre la experiencia del estudiante.
-   Dificultad para integrar ventas, asistencias y contenidos.

------------------------------------------------------------------------

## 3. Solución Propuesta

Desarrollar una plataforma web propia que centralice:

-   Gestión académica.
-   Gestión administrativa.
-   Acceso a contenidos.
-   Registro de asistencias.
-   Control de ventas.

La plataforma contará con 3 roles principales:

-   **Estudiante**
-   **Docente**
-   **Administrador** (con posibilidad de subroles)

------------------------------------------------------------------------

## 4. Roles y Responsabilidades

### 4.1 Estudiante

-   Inscribirse a cursos.
-   Acceder al aula virtual.
-   Visualizar videos, PPT, PDF y tareas.
-   Entregar trabajos.
-   Consultar notas y asistencia.

### 4.2 Docente

-   Gestionar cursos asignados.
-   Subir contenido académico.
-   Publicar tareas.
-   Calificar trabajos.
-   Registrar asistencia.

### 4.3 Administrador

-   Gestionar usuarios.
-   Crear y editar cursos.
-   Gestionar cronogramas.
-   Controlar ventas.
-   Supervisar asistencias.
-   Visualizar dashboard administrativo.

------------------------------------------------------------------------

## 5. Procesos de Negocio Actualizados

### 5.1 Gestión de Contenidos Académicos

El sistema permitirá que los contenidos tengan estados:

-   Publicado
-   Oculto
-   Programado

Resultado: Aula virtual organizada y controlada.

------------------------------------------------------------------------

### 5.2 Gestión de Inscripciones y Ventas

Estados de inscripción:

-   Preinscrito
-   Pendiente de pago
-   Pagado
-   Anulado
-   Finalizado

Se permitirá registrar pagos totales o parciales. El sistema actualizará
automáticamente el estado de la inscripción cuando el pago sea
confirmado.

Resultado: Inscripciones y ventas centralizadas.

------------------------------------------------------------------------

### 5.3 Gestión de Asistencia

-   Registro por sesión.
-   Estados: Presente, Ausente, Justificado.
-   Cálculo automático del porcentaje acumulado.
-   Generación de alerta interna si no cumple mínimo requerido.

Resultado: Control académico automatizado.

------------------------------------------------------------------------

### 5.4 Gestión de Evaluaciones

-   Publicación de tareas.
-   Envío de archivos por parte del estudiante.
-   Registro de calificación.
-   Almacenamiento de entregas en repositorio.

Resultado: Evaluaciones centralizadas.

------------------------------------------------------------------------

### 5.5 Notificaciones

-   Notificaciones internas dentro de la plataforma.
-   Notificaciones por correo electrónico:
    -   Confirmación de inscripción.
    -   Nueva tarea publicada.
    -   Registro de nota.
    -   Recordatorio de clase.

Resultado: Comunicación automatizada.

------------------------------------------------------------------------

### 5.6 Panel Administrativo

El sistema contará con un dashboard con:

-   Total de ventas por periodo.
-   Cursos activos.
-   Estudiantes inscritos.
-   Ingresos acumulados.
-   Filtros por fecha, curso y estado.

Resultado: Reemplazo total del uso de Excel.

------------------------------------------------------------------------

### 5.7 Seguridad

-   Control de permisos granular por rol.
-   Registro de auditoría (quién creó, editó o eliminó información).
-   Autenticación mediante usuario y contraseña.
-   Protección de acceso según rol.

Resultado: Plataforma segura y controlada.

------------------------------------------------------------------------

## 6. Flujo General del Sistema (Diagramas de Procesos)

A continuación se describen los principales flujos operativos del
sistema, los cuales se encuentran representados gráficamente en los
diagramas adjuntos:

### 6.1 Proceso de Inscripción de Alumno

Describe el flujo completo desde que el estudiante ingresa a la
plataforma, selecciona un curso, realiza el pago y obtiene acceso al
aula virtual.\
Incluye validaciones de datos, confirmación de pago y registro
automático de venta.

### 6.2 Proceso de Subida de Contenido

Representa el flujo mediante el cual el docente o supervisor
académico: - Selecciona el curso. - Sube archivos (PPT, PDF, Video). -
El sistema valida tipo y tamaño. - Publica o mantiene oculto el
contenido según configuración.

### 6.3 Proceso de Registro de Asistencia

Muestra el procedimiento donde: - El docente selecciona sesión activa. -
Marca asistencia. - El sistema actualiza porcentaje acumulado. - Se
generan alertas internas si no cumple el mínimo requerido.

### 6.4 Proceso de Entrega de Trabajos

Incluye: - Selección de actividad. - Validación de fecha límite. -
Registro de entrega. - Almacenamiento en repositorio. - Notificación
automática al docente.

### 6.5 Proceso de Gestión de Cursos

Flujo administrativo donde el supervisor académico: - Crea o edita
curso. - Configura nombre, docente, precio y cronograma. - Publica el
curso en el catálogo.

### 6.6 Proceso de Control de Ventas

Automatiza: - Registro de pago confirmado. - Actualización del reporte
de ventas. - Registro de comisión si aplica. - Actualización del
dashboard administrativo.

Estos diagramas permiten visualizar la interacción entre actores y
sistema, asegurando trazabilidad y claridad en los procesos definidos.

------------------------------------------------------------------------

## 7. Información que Manejará el Sistema

-   Usuarios.
-   Cursos.
-   Inscripciones.
-   Contenidos.
-   Tareas y calificaciones.
-   Asistencias.
-   Ventas.
-   Cronogramas.

------------------------------------------------------------------------

## 8. Beneficios Esperados

-   Eliminación del uso de Excel.
-   Independencia de Google Classroom.
-   Información centralizada.
-   Mejor control académico.
-   Mayor trazabilidad.
-   Experiencia unificada.

------------------------------------------------------------------------

Documento actualizado para análisis, diseño y desarrollo del sistema
MENTORY.
