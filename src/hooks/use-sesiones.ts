import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sesionesAPI, Sesion } from "@/services/api";

/**
 * Hook para obtener sesiones de un curso
 */
export const useSesiones = (cursoId: number | null) => {
  return useQuery({
    queryKey: ["sesiones", cursoId],
    queryFn: () => sesionesAPI.listar(cursoId!),
    enabled: !!cursoId,
  });
};

/**
 * Hook para obtener una sesión específica
 */
export const useSesion = (cursoId: number | null, sesionId: number | null) => {
  return useQuery({
    queryKey: ["sesion", cursoId, sesionId],
    queryFn: () => sesionesAPI.obtener(cursoId!, sesionId!),
    enabled: !!cursoId && !!sesionId,
  });
};

/**
 * Hook para crear una sesión
 */
export const useCrearSesion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cursoId, data }: { cursoId: number; data: Partial<Sesion> }) =>
      sesionesAPI.crear(cursoId, data),
    onSuccess: (_, { cursoId }) => {
      queryClient.invalidateQueries({ queryKey: ["sesiones", cursoId] });
    },
  });
};

/**
 * Hook para actualizar una sesión
 */
export const useActualizarSesion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cursoId,
      sesionId,
      data,
    }: {
      cursoId: number;
      sesionId: number;
      data: Partial<Sesion>;
    }) => sesionesAPI.actualizar(cursoId, sesionId, data),
    onSuccess: (_, { cursoId, sesionId }) => {
      queryClient.invalidateQueries({ queryKey: ["sesiones", cursoId] });
      queryClient.invalidateQueries({ queryKey: ["sesion", cursoId, sesionId] });
    },
  });
};

/**
 * Hook para eliminar una sesión
 */
export const useEliminarSesion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cursoId, sesionId }: { cursoId: number; sesionId: number }) =>
      sesionesAPI.eliminar(cursoId, sesionId),
    onSuccess: (_, { cursoId }) => {
      queryClient.invalidateQueries({ queryKey: ["sesiones", cursoId] });
    },
  });
};
