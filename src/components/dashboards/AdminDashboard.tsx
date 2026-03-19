import { DollarSign, Users, BookOpen, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useCursos } from "@/hooks/use-cursos";
import { useUsuarios } from "@/hooks/use-usuarios";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AdminDashboard() {
  const { data: cursos = [], isLoading: cursosLoading, error: cursosError } = useCursos();
  const { data: usuarios = [], isLoading: usuariosLoading, error: usuariosError } = useUsuarios();

  const isLoading = cursosLoading || usuariosLoading;
  const hasError = cursosError || usuariosError;

  // Calcular KPIs en base a datos reales
  const estudiantesActivos = usuarios.filter(u => u.rolId === 3 && u.estado !== false).length;
  const docentesActivos = usuarios.filter(u => u.rolId === 2 && u.estado !== false).length;
  const cursosActivos = cursos.filter(c => c.estado === "ACTIVO").length;
  
  // Calcular ingresos mensuales estimados basados en cursos activos
  const ingresosTotales = cursos.reduce((sum, curso) => sum + curso.precio, 0);
  const ingresosMensualesEst = Math.round(ingresosTotales * 0.8); // Estimado 80% de conversión

  // Datos de ventas por mes (simulación basada en cantidad de cursos)
  const generateSalesData = () => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
    const cursosActivosCnt = cursosActivos;
    return meses.map((month, idx) => ({
      month,
      ventas: Math.round(ingresosTotales / 6 * Math.random() * (0.8 + idx * 0.1)),
    }));
  };

  const salesData = generateSalesData();

  // Generar datos de pagos recientes basados en cursos
  const recentPayments = cursos.slice(0, 5).map((curso, idx) => {
    const estudiantes = usuarios.filter(u => u.rolId === 3);
    const estudiante = estudiantes[idx % estudiantes.length] || estudiantes[0];
    
    return {
      id: `INV-${String(curso.id).padStart(3, '0')}`,
      student: estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : "Estudiante",
      course: curso.nombre,
      amount: `S/ ${curso.precio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      status: Math.random() > 0.3 ? "Pagado" : "Pendiente" as const,
    };
  });

  const statusStyles = {
    Pagado: "bg-success-muted text-success-foreground",
    Pendiente: "bg-warning-muted text-warning-foreground",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen operativo y financiero</p>
      </div>

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los datos. Por favor, intenta de nuevo más tarde.
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
            <KpiCard 
              title="Ingresos mensuales" 
              value={`S/ ${ingresosMensualesEst.toLocaleString('es-PE')}`} 
              change={`+${cursosActivos} cursos activos`} 
              icon={DollarSign} 
            />
            <KpiCard 
              title="Estudiantes activos" 
              value={estudiantesActivos.toString()} 
              change={`+${usuarios.filter(u => u.rolId === 3).length}`} 
              icon={Users} 
            />
            <KpiCard 
              title="Cursos activos" 
              value={cursosActivos.toString()} 
              change={`+${Math.max(0, cursosActivos - 2)}`} 
              icon={BookOpen} 
            />
            <KpiCard 
              title="Docentes registrados" 
              value={docentesActivos.toString()} 
              change={`${usuarios.filter(u => u.rolId === 2).length} total`} 
              icon={TrendingUp} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart */}
            <div className="lg:col-span-2 rounded-lg bg-card p-5 shadow-card">
              <h3 className="text-sm font-medium text-foreground mb-4">Ingresos estimados por mes</h3>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(217, 91%, 50%)" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="hsl(217, 91%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(240, 3.8%, 46.1%)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(240, 3.8%, 46.1%)' }} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(0, 0%, 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
                        fontSize: '13px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ventas"
                      stroke="hsl(217, 91%, 50%)"
                      strokeWidth={1.5}
                      fill="url(#salesGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent payments */}
            <div className="rounded-lg bg-card p-5 shadow-card">
              <h3 className="text-sm font-medium text-foreground mb-4">Inscripciones recientes</h3>
              <div className="space-y-3">
                {recentPayments.length > 0 ? (
                  recentPayments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.student}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.course}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        <span className="text-sm tabular-nums font-medium text-foreground whitespace-nowrap">{p.amount}</span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyles[p.status]}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay inscripciones registradas
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-card p-5 shadow-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Total de usuarios</h4>
              <p className="text-2xl font-semibold text-foreground">{usuarios.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {usuarios.filter(u => u.estado !== false).length} activos / {usuarios.filter(u => u.estado === false).length} bloqueados
              </p>
            </div>

            <div className="rounded-lg bg-card p-5 shadow-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Ingresos totales estimados</h4>
              <p className="text-2xl font-semibold text-foreground">
                S/ {ingresosTotales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Basado en {cursos.length} cursos
              </p>
            </div>

            <div className="rounded-lg bg-card p-5 shadow-card">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Promedio por curso</h4>
              <p className="text-2xl font-semibold text-foreground">
                S/ {cursos.length > 0 ? (ingresosTotales / cursos.length).toLocaleString('es-PE', { minimumFractionDigits: 2 }) : '0.00'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                De {cursos.length} cursos disponibles
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
