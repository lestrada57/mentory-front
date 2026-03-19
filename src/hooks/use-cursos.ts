import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cursosAPI, Curso } from "@/services/api";

/**
 * Hook para obtener la lista de cursos
 */
export const useCursos = () => {
  return useQuery({
    queryKey: ["cursos"],
    queryFn: () => cursosAPI.listar(),
  });
};

/**
 * Hook para obtener un curso específico
 */
export const useCurso = (id: number | null) => {
  return useQuery({
    queryKey: ["curso", id],
    queryFn: () => cursosAPI.obtener(id!),
    enabled: !!id,
  });
};

/**
 * Hook para obtener la imagen de un curso
 */
export const useCursoImagen = (id: number | undefined) => {
  return useQuery({
    queryKey: ["curso-imagen", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await cursosAPI.obtenerImagen(id);
      return res.url;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });
};

/**
 * Hook para crear un curso
 */
export const useCrearCurso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Curso>) => cursosAPI.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cursos"] });
    },
  });
};

/**
 * Hook para actualizar un curso
 */
export const useActualizarCurso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Curso> }) =>
      cursosAPI.actualizar(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["cursos"] });
      queryClient.invalidateQueries({ queryKey: ["curso", id] });
    },
  });
};

/**
 * Hook para eliminar un curso
 */
export const useEliminarCurso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cursosAPI.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cursos"] });
    },
  });
};
