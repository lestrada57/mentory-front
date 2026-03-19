import { useState } from "react";
import { Trash2, Lock, Unlock, Loader2, AlertCircle, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useUsuarios, useActualizarUsuario, useBloquerUsuario, useActivarUsuario, useCrearUsuario } from "@/hooks/use-usuarios";
import { Usuario } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const rolNames: Record<number, string> = {
  1: "Administrador",
  2: "Docente",
  3: "Estudiante",
};

const rolIds = {
  administrador: 1,
  docente: 2,
  estudiante: 3,
};

export function UsuariosManagement() {
  const { data: usuarios = [], isLoading, error } = useUsuarios();
  const { mutate: actualizarUsuario, isPending: isUpdating } = useActualizarUsuario();
  const { mutate: bloquearUsuario, isPending: isBlocking } = useBloquerUsuario();
  const { mutate: activarUsuario, isPending: isActivating } = useActivarUsuario();
  const { mutate: crearUsuario, isPending: isCreating } = useCrearUsuario();
  const { toast } = useToast();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [roleFilter, setRoleFilter] = useState<number | "all">("all");

  const [editFormData, setEditFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
  });

  const [createFormData, setCreateFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    rol: "estudiante" as "administrador" | "docente" | "estudiante",
  });

  const usuariosFiltrados = roleFilter === "all" ? usuarios : usuarios.filter(u => u.rolId === roleFilter);

  // Editar usuario
  const handleOpenEditDialog = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setEditFormData({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
    });
    setOpenEditDialog(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    if (!editFormData.nombres || !editFormData.email) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      nombres: editFormData.nombres,
      apellidos: editFormData.apellidos,
      email: editFormData.email,
      rolId: selectedUser.rolId,
    };

    actualizarUsuario(
      { id: selectedUser.id, data: payload },
      {
        onSuccess: () => {
          setOpenEditDialog(false);
          toast({
            title: "Éxito",
            description: "Usuario actualizado correctamente",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar el usuario",
            variant: "destructive",
          });
        },
      }
    );
  };

  // Crear usuario
  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createFormData.nombres || !createFormData.email || !createFormData.password) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      nombres: createFormData.nombres,
      apellidos: createFormData.apellidos,
      email: createFormData.email,
      password: createFormData.password,
      rolId: rolIds[createFormData.rol],
    };

    crearUsuario(payload, {
      onSuccess: () => {
        setOpenCreateDialog(false);
        setCreateFormData({
          nombres: "",
          apellidos: "",
          email: "",
          password: "",
          rol: "estudiante",
        });
        toast({
          title: "Éxito",
          description: "Usuario creado correctamente",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "No se pudo crear el usuario",
          variant: "destructive",
        });
      },
    });
  };

  const handleBloquear = (id: number) => {
    bloquearUsuario(id, {
      onSuccess: () => {
        toast({
          title: "Éxito",
          description: "Usuario bloqueado correctamente",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo bloquear el usuario",
          variant: "destructive",
        });
      },
    });
  };

  const handleActivar = (id: number) => {
    activarUsuario(id, {
      onSuccess: () => {
        toast({
          title: "Éxito",
          description: "Usuario activado correctamente",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo activar el usuario",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra usuarios, roles y permisos
          </p>
        </div>
        <Button onClick={() => setOpenCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los usuarios. Por favor, intenta de nuevo más tarde.
          </AlertDescription>
        </Alert>
      )}

      {/* Filter */}
      <div className="bg-card rounded-lg p-4 shadow-card">
        <Label className="text-sm font-medium">Filtrar por rol</Label>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Button
            variant={roleFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter("all")}
          >
            Todos
          </Button>
          <Button
            variant={roleFilter === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter(1)}
          >
            Administradores
          </Button>
          <Button
            variant={roleFilter === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter(2)}
          >
            Docentes
          </Button>
          <Button
            variant={roleFilter === 3 ? "default" : "outline"}
            size="sm"
            onClick={() => setRoleFilter(3)}
          >
            Estudiantes
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg bg-card shadow-card overflow-hidden">
          {usuariosFiltrados.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No hay usuarios con los filtros aplicados
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                  <th className="px-5 py-3 font-medium">Nombre</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Rol</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="border-t border-border/30 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">
                      {usuario.nombres} {usuario.apellidos}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{usuario.email}</td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {rolNames[usuario.rolId] || "Desconocido"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                        usuario.estado !== false
                          ? "bg-success-muted text-success-foreground"
                          : "bg-destructive-muted text-destructive-foreground"
                      }`}>
                        {usuario.estado !== false ? "Activo" : "Bloqueado"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEditDialog(usuario)}
                          disabled={isUpdating}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        {usuario.estado !== false ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBloquear(usuario.id)}
                            disabled={isBlocking}
                            className="text-warning hover:text-warning"
                          >
                            <Lock className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivar(usuario.id)}
                            disabled={isActivating}
                            className="text-success hover:text-success"
                          >
                            <Unlock className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-nombres">Nombres *</Label>
              <Input
                id="edit-nombres"
                placeholder="Juan"
                value={editFormData.nombres}
                onChange={(e) => setEditFormData({ ...editFormData, nombres: e.target.value })}
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label htmlFor="edit-apellidos">Apellidos</Label>
              <Input
                id="edit-apellidos"
                placeholder="García"
                value={editFormData.apellidos}
                onChange={(e) => setEditFormData({ ...editFormData, apellidos: e.target.value })}
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="juan@example.com"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label htmlFor="edit-rol">Rol</Label>
              <select
                id="edit-rol"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedUser?.rolId || ""}
                disabled={true}
              >
                <option value={selectedUser?.rolId}>{rolNames[selectedUser?.rolId || 0]}</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">El rol no puede ser modificado aquí</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isUpdating}
                className="flex-1"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEditDialog(false)}
                disabled={isUpdating}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitCreate} className="space-y-4">
            <div>
              <Label htmlFor="create-nombres">Nombres *</Label>
              <Input
                id="create-nombres"
                placeholder="Juan"
                value={createFormData.nombres}
                onChange={(e) => setCreateFormData({ ...createFormData, nombres: e.target.value })}
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="create-apellidos">Apellidos</Label>
              <Input
                id="create-apellidos"
                placeholder="García"
                value={createFormData.apellidos}
                onChange={(e) => setCreateFormData({ ...createFormData, apellidos: e.target.value })}
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="juan@example.com"
                value={createFormData.email}
                onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="create-password">Contraseña *</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="••••••••"
                value={createFormData.password}
                onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="create-rol">Rol *</Label>
              <Select value={createFormData.rol} onValueChange={(value: any) => setCreateFormData({ ...createFormData, rol: value })}>
                <SelectTrigger id="create-rol" disabled={isCreating}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estudiante">Estudiante</SelectItem>
                  <SelectItem value="docente">Docente</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear usuario"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenCreateDialog(false)}
                disabled={isCreating}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
