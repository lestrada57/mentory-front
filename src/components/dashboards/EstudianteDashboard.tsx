import { KpiCard } from "@/components/KpiCard";
import { BookOpen, CheckSquare, TrendingUp, Clock, Loader2, AlertCircle } from "lucide-react";
import { useCursos } from "@/hooks/use-cursos";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function EstudianteDashboard() {
  const { data: cursos = [], isLoading, error } = useCursos();

  // En una implementación real, esto vendría de inscripciones del estudiante
  // Por ahora, mostramos todos los cursos como sugerencia
  const misCursos = cursos.slice(0, 3); // Simulamos inscripción a los primeros 3 cursos
  const cursosInscritos = misCursos.length;
  const promedioGeneral = "16.2"; // Placeholder
  const entrepasPendientes = 2; // Placeholder

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mi Portal</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen de tu progreso académico</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar tus cursos. Por favor, intenta de nuevo más tarde.
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
            <KpiCard title="Cursos inscritos" value={cursosInscritos.toString()} icon={BookOpen} />
            <KpiCard title="Asistencia" value="94%" icon={CheckSquare} />
            <KpiCard title="Promedio general" value={promedioGeneral} icon={TrendingUp} />
            <KpiCard title="Entregas pendientes" value={entrepasPendientes.toString()} icon={Clock} />
          </div>

          <div className="rounded-lg bg-card shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="text-sm font-medium text-foreground">Mis cursos</h3>
            </div>
            {misCursos.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-muted-foreground">No tienes cursos inscritos aún</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {misCursos.map((c) => {
                  const progress = Math.floor(Math.random() * 100); // Simulado
                  const grade = (15 + Math.random() * 5).toFixed(1); // Simulado
                  
                  return (
                    <div key={c.id} className="px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.nombre}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Docente: ID {c.docenteId}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Nota</p>
                          <p className="text-sm font-medium tabular-nums text-foreground">{grade}</p>
                        </div>
                        <div className="w-24">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progreso</span>
                            <span className="tabular-nums">{progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
