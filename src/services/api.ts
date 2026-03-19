/**
 * API Client para MENTORY
 * Centraliza todas las peticiones hacia la API backend
 */

const API_BASE_URL = "https://mentory-production.up.railway.app/api";

let authToken: string | null = null;

/**
 * Establece el token de autenticación
 */
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

/**
 * Obtiene el token actual
 */
export const getAuthToken = (): string | null => {
  return authToken || localStorage.getItem("mentory_token");
};

/**
 * Configura los headers por defecto para las peticiones
 */
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Realiza una petición GET
 */
const apiGet = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Realiza una petición POST
 */
const apiPost = async <T>(endpoint: string, data?: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Realiza una petición PUT
 */
const apiPut = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Realiza una petición DELETE
 */
const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Realiza una petición PATCH
 */
const apiPatch = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Realiza una petición multipart/form-data (para uploads)
 */
const apiUpload = async <T>(endpoint: string, formData: FormData): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }
  
  return response.json();
};

// ============ TIPOS ============

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  rol: string;
  nombres?: string;
  apellidos?: string;
}

export interface SignupPayload {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  rolId: number;
}

export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  docenteId: number;
  estado: string;
  imagen?: string;
  imagenKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Sesion {
  id: number;
  titulo: string;
  fecha: string;
  enlaceZoom: string;
  cursoId?: number;
}

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rolId: number;
  rol?: string;
  estado?: boolean;
}

export interface Inscripcion {
  id: number;
  estudianteId: number;
  cursoId: number;
  estado: string;
  fechaInscripcion?: string;
  monto?: number;
}

export interface Contenido {
  id: number;
  cursoId: number;
  titulo: string;
  descripcion?: string;
  tipo: string;
  estado: string;
  archivoUrl?: string;
  createdAt?: string;
}

export interface Entrega {
  id: number;
  tareaId: number;
  estudianteId: number;
  estado: string;
  archivoUrl?: string;
  fechaEntrega?: string;
}

// ============ AUTH ENDPOINTS ============

export const authAPI = {
  /**
   * Inicia sesión con email y contraseña
   */
  login: (email: string, password: string) =>
    apiPost<LoginResponse>("/auth/login", { email, password }),

  /**
   * Registra un nuevo usuario
   */
  signup: (payload: SignupPayload) =>
    apiPost<LoginResponse>("/auth/signup", payload),
};

// ============ CURSOS ENDPOINTS ============

export const cursosAPI = {
  /**
   * Obtiene todos los cursos
   */
  listar: () => apiGet<Curso[]>("/cursos"),

  /**
   * Obtiene un curso por ID
   */
  obtener: (id: number) => apiGet<Curso>(`/cursos/${id}`),

  /**
   * Obtiene la URL de la imagen de un curso
   */
  obtenerImagen: (id: number) => apiGet<{ url: string }>(`/cursos/${id}/imagen`),

  /**
   * Crea un nuevo curso
   */
  crear: (data: Partial<Curso>) =>
    apiPost<Curso>("/cursos", data),

  /**
   * Actualiza un curso
   */
  actualizar: (id: number, data: Partial<Curso>) =>
    apiPut<Curso>(`/cursos/${id}`, data),

  /**
   * Elimina un curso
   */
  eliminar: (id: number) => apiDelete(`/cursos/${id}`),
};

// ============ SESIONES ENDPOINTS ============

export const sesionesAPI = {
  /**
   * Obtiene todas las sesiones de un curso
   */
  listar: (cursoId: number) =>
    apiGet<Sesion[]>(`/cursos/${cursoId}/sesiones`),

  /**
   * Obtiene una sesión específica
   */
  obtener: (cursoId: number, sesionId: number) =>
    apiGet<Sesion>(`/cursos/${cursoId}/sesiones/${sesionId}`),

  /**
   * Crea una nueva sesión
   */
  crear: (cursoId: number, data: Partial<Sesion>) =>
    apiPost<Sesion>(`/cursos/${cursoId}/sesiones`, data),

  /**
   * Actualiza una sesión
   */
  actualizar: (cursoId: number, sesionId: number, data: Partial<Sesion>) =>
    apiPut<Sesion>(`/cursos/${cursoId}/sesiones/${sesionId}`, data),

  /**
   * Elimina una sesión
   */
  eliminar: (cursoId: number, sesionId: number) =>
    apiDelete(`/cursos/${cursoId}/sesiones/${sesionId}`),
};

// ============ USUARIOS ENDPOINTS ============

export const usuariosAPI = {
  /**
   * Obtiene todos los usuarios
   */
  listar: () => apiGet<Usuario[]>("/usuarios"),

  /**
   * Obtiene un usuario por ID
   */
  obtener: (id: number) => apiGet<Usuario>(`/usuarios/${id}`),

  /**
   * Crea un nuevo usuario (admin signup)
   */
  crear: (payload: SignupPayload) =>
    apiPost<LoginResponse>("/auth/signup", payload),

  /**
   * Actualiza un usuario
   */
  actualizar: (id: number, data: Partial<Usuario>) =>
    apiPut<Usuario>(`/usuarios/${id}`, data),

  /**
   * Bloquea un usuario
   */
  bloquear: (id: number) =>
    apiPatch(`/usuarios/${id}/bloquear`, {}),

  /**
   * Activa un usuario
   */
  activar: (id: number) =>
    apiPatch(`/usuarios/${id}/activar`, {}),
};

// ============ ROLES ENDPOINTS ============

export const rolesAPI = {
  /**
   * Obtiene todos los roles
   */
  listar: () => apiGet("/roles"),

  /**
   * Obtiene un rol por ID
   */
  obtener: (id: number) => apiGet(`/roles/${id}`),

  /**
   * Crea un nuevo rol
   */
  crear: (data: { name: string; description: string }) =>
    apiPost("/roles", data),

  /**
   * Actualiza un rol
   */
  actualizar: (id: number, data: { name: string; description: string }) =>
    apiPut(`/roles/${id}`, data),

  /**
   * Elimina un rol
   */
  eliminar: (id: number) => apiDelete(`/roles/${id}`),
};

// ============ PERMISOS ENDPOINTS ============

export const permisosAPI = {
  /**
   * Obtiene todos los permisos
   */
  listar: () => apiGet("/permisos"),

  /**
   * Obtiene un permiso por ID
   */
  obtener: (id: number) => apiGet(`/permisos/${id}`),

  /**
   * Crea un nuevo permiso
   */
  crear: (data: { name: string; code: string }) =>
    apiPost("/permisos", data),

  /**
   * Actualiza un permiso
   */
  actualizar: (id: number, data: { name: string; code: string }) =>
    apiPut(`/permisos/${id}`, data),

  /**
   * Elimina un permiso
   */
  eliminar: (id: number) => apiDelete(`/permisos/${id}`),
};

// ============ CONTENIDOS ENDPOINTS ============

export const contenidosAPI = {
  /**
   * Sube un archivo de contenido
   */
  upload: (file: File, contenidoMeta: { cursoId: number; titulo: string; descripcion?: string; tipo: string; estado: string }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("contenido", JSON.stringify(contenidoMeta));
    return apiUpload<Contenido>("/contenidos/upload", formData);
  },

  /**
   * Descarga un contenido
   */
  descargar: (id: number) =>
    apiGet<{ downloadUrl: string }>(`/contenidos/${id}/download`),
};

// ============ ENTREGAS ENDPOINTS ============

export const entregasAPI = {
  /**
   * Sube una entrega (tarea)
   */
  upload: (file: File, entregaMeta: { tareaId: number; estudianteId: number }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entrega", JSON.stringify(entregaMeta));
    return apiUpload<Entrega>("/entregas/upload", formData);
  },

  /**
   * Descarga una entrega
   */
  descargar: (id: number) =>
    apiGet<{ downloadUrl: string }>(`/entregas/${id}/download`),
};
