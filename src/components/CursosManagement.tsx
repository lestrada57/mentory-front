import { useState } from "react";
import { Plus, Trash2, Edit2, Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useCursos, useCrearCurso, useActualizarCurso, useEliminarCurso } from "@/hooks/use-cursos";
import { useAuth } from "@/lib/auth-context";
import { Curso } from "@/services/api";

export function CursosManagement() {
  const { user } = useAuth();
  const { data: cursos = [], isLoading, error, refetch } = useCursos();
  const { mutate: crearCurso, isPending: isCreating } = useCrearCurso();
  const { mutate: actualizarCurso, isPending: isUpdating } = useActualizarCurso();
  const { mutate: eliminarCurso, isPending: isDeleting } = useEliminarCurso();
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    estado: "ACTIVO",
    imagen: "",
  });

  // Filtrar cursos según el rol
  const cursosFiltrados = user?.role === "admin" ? cursos : cursos.filter(c => c.docenteId === parseInt(user?.id || "0"));

  const handleOpenDialog = (curso?: Curso) => {
    if (curso) {
      setEditingId(curso.id);
      setFormData({
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        precio: curso.precio.toString(),
        estado: curso.estado,
        imagen: curso.imagen || "",
      });
      setImagePreview(curso.imagen || "");
    } else {
      setEditingId(null);
      setFormData({ nombre: "", descripcion: "", precio: "", estado: "ACTIVO", imagen: "" });
      setImagePreview("");
    }
    setOpenDialog(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Crear una URL local para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setFormData({ ...formData, imagen: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData({ ...formData, imagen: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      docenteId: parseInt(user?.id || "0"),
      estado: formData.estado,
      ...(formData.imagen && { imagen: formData.imagen }),
    };

    if (editingId) {
      actualizarCurso(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            setOpenDialog(false);
            toast({
              title: "Éxito",
              description: "Curso actualizado correctamente",
            });
          },
          onError: () => {
            toast({
              title: "Error",
              description: "No se pudo actualizar el curso",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      crearCurso(payload, {
        onSuccess: () => {
          setOpenDialog(false);
          toast({
            title: "Éxito",
            description: "Curso creado correctamente",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo crear el curso",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      eliminarCurso(id, {
        onSuccess: () => {
          toast({
            title: "Éxito",
            description: "Curso eliminado correctamente",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo eliminar el curso",
            variant: "destructive",
          });
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gestión de Cursos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.role === "admin" ? "Administra todos los cursos de la plataforma" : "Gestiona tus cursos"}
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Curso" : "Crear Nuevo Curso"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del curso *</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: JavaScript Avanzado"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  disabled={isCreating || isUpdating}
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el contenido del curso"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  disabled={isCreating || isUpdating}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="precio">Precio (S/) *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  disabled={isCreating || isUpdating}
                />
              </div>

              <div>
                <Label htmlFor="imagen">Imagen del curso</Label>
                <div className="flex flex-col gap-3 mt-2">
                  {imagePreview ? (
                    <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isCreating || isUpdating}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Selecciona una imagen para el curso
                      </p>
                      <input
                        id="imagen"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isCreating || isUpdating}
                        className="hidden"
                      />
                      <Label 
                        htmlFor="imagen"
                        className="mt-2 inline-block cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('imagen')?.click();
                          }}
                          disabled={isCreating || isUpdating}
                        >
                          Seleccionar imagen
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  disabled={isCreating || isUpdating}
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="ARCHIVADO">Archivado</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    editingId ? "Actualizar" : "Crear"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  disabled={isCreating || isUpdating}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los cursos. Por favor, intenta de nuevo más tarde.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg bg-card shadow-card overflow-hidden">
          {cursosFiltrados.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {user?.role === "admin" ? "No hay cursos registrados aún" : "No tienes cursos asignados"}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                  <th className="px-5 py-3 font-medium">Imagen</th>
                  <th className="px-5 py-3 font-medium">Nombre</th>
                  <th className="px-5 py-3 font-medium">Descripción</th>
                  <th className="px-5 py-3 font-medium">Precio</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cursosFiltrados.map((curso) => (
                  <tr key={curso.id} className="border-t border-border/30 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3">
                      {curso.imagen ? (
                        <img 
                          src={curso.imagen} 
                          alt={curso.nombre}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Sin img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">{curso.nombre}</td>
                    <td className="px-5 py-3 text-muted-foreground max-w-xs truncate">
                      {curso.descripcion || "—"}
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">S/ {curso.precio}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                        curso.estado === "ACTIVO"
                          ? "bg-success-muted text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {curso.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(curso)}
                          disabled={isDeleting}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(curso.id)}
                          disabled={isDeleting}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
