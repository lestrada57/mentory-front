import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuariosAPI, Usuario, SignupPayload } from "@/services/api";

/**
 * Hook para obtener la lista de usuarios
 */
export const useUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: () => usuariosAPI.listar(),
  });
};

/**
 * Hook para obtener un usuario específico
 */
export const useUsuario = (id: number | null) => {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: () => usuariosAPI.obtener(id!),
    enabled: !!id,
  });
};

/**
 * Hook para crear un nuevo usuario
 */
export const useCrearUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupPayload) => usuariosAPI.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
};

/**
 * Hook para actualizar un usuario
 */
export const useActualizarUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Usuario> }) =>
      usuariosAPI.actualizar(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", id] });
    },
  });
};

/**
 * Hook para bloquear un usuario
 */
export const useBloquerUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usuariosAPI.bloquear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
};

/**
 * Hook para activar un usuario
 */
export const useActivarUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usuariosAPI.activar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
};
