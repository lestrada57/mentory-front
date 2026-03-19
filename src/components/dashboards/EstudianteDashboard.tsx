import { KpiCard } from "@/components/KpiCard";
import { BookOpen, CheckSquare, TrendingUp, Clock, Loader2, AlertCircle, GraduationCap } from "lucide-react";
import { useCursos } from "@/hooks/use-cursos";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

export function EstudianteDashboard() {
  const { data: cursos = [], isLoading, error } = useCursos();

  // En una implementación real, esto vendría de inscripciones del estudiante
  // Por ahora, mostramos todos los cursos como cursos disponibles
  const misCursos = cursos.slice(0, 3); // Simulamos inscripción a los primeros 3 cursos
  const cursosDisponibles = cursos; // Todos los cursos disponibles
  const cursosInscritos = misCursos.length;
  const promedioGeneral = "16.2"; // Placeholder
  const entrepasPendientes = 2; // Placeholder

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mi Portal Estudiantil</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen de tu progreso académico y cursos disponibles</p>
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

          {/* Mis Cursos Inscritos */}
          <div className="rounded-lg bg-card shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Mis Cursos Inscritos
              </h3>
            </div>
            {misCursos.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <GraduationCap className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm font-medium text-foreground mb-1">No estás inscrito en cursos aún</p>
                <p className="text-xs text-muted-foreground">Explora los cursos disponibles más abajo para inscribirte</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {misCursos.map((c) => {
                  const progress = Math.floor(Math.random() * 100); // Simulado
                  const grade = (15 + Math.random() * 5).toFixed(1); // Simulado
                  
                  return (
                    <div key={c.id} className="px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{c.nombre}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.descripcion || "Sin descripción"}</p>
                      </div>
                      <div className="flex items-center gap-6 ml-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Nota</p>
                          <p className="text-sm font-medium tabular-nums text-foreground">{grade}</p>
                        </div>
                        <div className="w-32">
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

          {/* Cursos Disponibles */}
          <div className="rounded-lg bg-card shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Cursos Disponibles
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {cursosDisponibles.length} {cursosDisponibles.length === 1 ? "curso disponible" : "cursos disponibles"}
              </p>
            </div>
            {cursosDisponibles.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm font-medium text-foreground mb-1">No hay cursos disponibles</p>
                <p className="text-xs text-muted-foreground">Vuelve más tarde para ver nuevas opciones</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                {cursosDisponibles.map((c) => (
                  <Card key={c.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer border border-border/50">
                    {c.imagen && (
                      <img 
                        src={c.imagen} 
                        alt={c.nombre}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <div className={!c.imagen ? "h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-md mb-3 flex items-center justify-center" : "mb-3"}>
                      {!c.imagen && (
                        <div className="text-center">
                          <BookOpen className="h-8 w-8 mx-auto text-primary/50 mb-2" />
                          <p className="text-xs text-muted-foreground">Sin imagen</p>
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm text-foreground mb-1">{c.nombre}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.descripcion || "Sin descripción"}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">S/ {c.precio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                        c.estado === "ACTIVO"
                          ? "bg-success-muted text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {c.estado}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
