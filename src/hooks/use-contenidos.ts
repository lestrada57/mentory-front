import { useMutation } from "@tanstack/react-query";
import { contenidosAPI, entregasAPI } from "@/services/api";

/**
 * Hook para subir contenido de un curso
 */
export const useUploadContenido = () => {
  return useMutation({
    mutationFn: ({ file, contenidoMeta }: { 
      file: File; 
      contenidoMeta: { cursoId: number; titulo: string; descripcion?: string; tipo: string; estado: string };
    }) => contenidosAPI.upload(file, contenidoMeta),
  });
};

/**
 * Hook para descargar contenido
 */
export const useDescargarContenido = () => {
  return useMutation({
    mutationFn: (id: number) => contenidosAPI.descargar(id),
  });
};

/**
 * Hook para subir una entrega (tarea de estudiante)
 */
export const useUploadEntrega = () => {
  return useMutation({
    mutationFn: ({ file, entregaMeta }: { 
      file: File; 
      entregaMeta: { tareaId: number; estudianteId: number };
    }) => entregasAPI.upload(file, entregaMeta),
  });
};

/**
 * Hook para descargar una entrega
 */
export const useDescargarEntrega = () => {
  return useMutation({
    mutationFn: (id: number) => entregasAPI.descargar(id),
  });
};
