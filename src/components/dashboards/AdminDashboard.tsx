import { DollarSign, Users, BookOpen, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useCursos } from "@/hooks/use-cursos";
import { useUsuarios } from "@/hooks/use-usuarios";
import { Alert, AlertDescription } from "@/components/ui/alert";

const salesData = [
  { month: "Ene", ventas: 12400 },
  { month: "Feb", ventas: 15800 },
  { month: "Mar", ventas: 18200 },
  { month: "Abr", ventas: 14600 },
  { month: "May", ventas: 21000 },
  { month: "Jun", ventas: 24500 },
];

const recentPayments = [
  { id: "INV-001", student: "Ana García", course: "Diseño UX", amount: "S/ 1,200", status: "Pagado" as const },
  { id: "INV-002", student: "Luis Mendoza", course: "Desarrollo Web", amount: "S/ 800", status: "Pendiente" as const },
  { id: "INV-003", student: "Carmen Ruiz", course: "Marketing Digital", amount: "S/ 950", status: "Pagado" as const },
  { id: "INV-004", student: "Diego Torres", course: "Data Science", amount: "S/ 1,500", status: "Pendiente" as const },
  { id: "INV-005", student: "Sofía Vargas", course: "Diseño UX", amount: "S/ 1,200", status: "Pagado" as const },
];

const statusStyles = {
  Pagado: "bg-success-muted text-success-foreground",
  Pendiente: "bg-warning-muted text-warning-foreground",
};

export function AdminDashboard() {
  const { data: cursos = [], isLoading: cursosLoading, error: cursosError } = useCursos();
  const { data: usuarios = [], isLoading: usuariosLoading, error: usuariosError } = useUsuarios();

  const isLoading = cursosLoading || usuariosLoading;
  const hasError = cursosError || usuariosError;

  // Contar estudiantes (rol 3 = ESTUDIANTE)
  const estudiantesActivos = usuarios.filter(u => u.rolId === 3).length;
  const cursosActivos = cursos.filter(c => c.estado === "ACTIVO").length;

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
            <KpiCard title="Ventas del mes" value="S/ 24,500" change="+12.5%" icon={DollarSign} />
            <KpiCard title="Estudiantes activos" value={estudiantesActivos.toString()} change="+8" icon={Users} />
            <KpiCard title="Cursos activos" value={cursosActivos.toString()} change="+2" icon={BookOpen} />
            <KpiCard title="Tasa de conversión" value="68%" change="+3.2%" icon={TrendingUp} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart */}
            <div className="lg:col-span-2 rounded-lg bg-card p-5 shadow-card">
              <h3 className="text-sm font-medium text-foreground mb-4">Ingresos mensuales</h3>
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
              <h3 className="text-sm font-medium text-foreground mb-4">Últimos pagos</h3>
              <div className="space-y-3">
                {recentPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.student}</p>
                      <p className="text-xs text-muted-foreground">{p.course}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-sm tabular-nums font-medium text-foreground">{p.amount}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyles[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
