import { KpiCard } from "@/components/KpiCard";
import { BookOpen, Users, CheckSquare, FileText, Loader2, AlertCircle } from "lucide-react";
import { useCursos } from "@/hooks/use-cursos";
import { useAuth } from "@/lib/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DocenteDashboard() {
  const { user } = useAuth();
  const { data: cursos = [], isLoading, error } = useCursos();

  // Filtrar cursos del docente actual
  const misCursos = cursos.filter(c => c.docenteId === parseInt(user?.id || "0"));
  const totalAlumnos = misCursos.reduce((acc) => acc + 25, 0); // Placeholder: 25 alumnos por curso
  const totalPendientes = misCursos.reduce((acc) => acc + 3, 0); // Placeholder: 3 entregas pendientes por curso

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard Docente</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestión de tus cursos y alumnos</p>
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Mis cursos" value={misCursos.length.toString()} icon={BookOpen} />
            <KpiCard title="Total alumnos" value={totalAlumnos.toString()} icon={Users} />
            <KpiCard title="Asistencia promedio" value="91.7%" icon={CheckSquare} />
            <KpiCard title="Entregas pendientes" value={totalPendientes.toString()} icon={FileText} />
          </div>

          <div className="rounded-lg bg-card shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="text-sm font-medium text-foreground">Mis cursos activos</h3>
            </div>
            {misCursos.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-muted-foreground">No tienes cursos asignados aún</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Curso</th>
                    <th className="px-5 py-3 font-medium">Descripción</th>
                    <th className="px-5 py-3 font-medium">Precio</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {misCursos.map((c) => (
                    <tr key={c.id} className="border-t border-border/30 hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{c.nombre}</td>
                      <td className="px-5 py-3 text-muted-foreground max-w-xs truncate">{c.descripcion}</td>
                      <td className="px-5 py-3 tabular-nums text-muted-foreground">S/ {c.precio}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                          c.estado === "ACTIVO"
                            ? "bg-success-muted text-success-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
