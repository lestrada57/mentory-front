import { useState } from "react";
import { Plus, Download, Loader2, AlertCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useCursos } from "@/hooks/use-cursos";
import { useUsuarios } from "@/hooks/use-usuarios";
import { Label } from "@/components/ui/label";

interface Venta {
  id: string;
  estudiante: string;
  curso: string;
  monto: number;
  fecha: string;
  estado: "Pagado" | "Pendiente" | "Parcial";
}

const statusStyles = {
  Pagado: "bg-success-muted text-success-foreground",
  Pendiente: "bg-warning-muted text-warning-foreground",
  Parcial: "bg-info-muted text-info-foreground",
};

export function VentasManagement() {
  const { data: cursos = [], isLoading: cursosLoading, error: cursosError } = useCursos();
  const { data: usuarios = [], isLoading: usuariosLoading, error: usuariosError } = useUsuarios();
  const { toast } = useToast();

  const [estadoFilter, setEstadoFilter] = useState<"all" | "Pagado" | "Pendiente" | "Parcial">("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().substring(0, 7));

  const isLoading = cursosLoading || usuariosLoading;
  const hasError = cursosError || usuariosError;

  // Generar datos simulados de ventas basados en cursos y estudiantes
  const generateSalesData = (): Venta[] => {
    const sales: Venta[] = [];
    const estudiantes = usuarios.filter(u => u.rolId === 3).slice(0, 5);
    const estados: Array<"Pagado" | "Pendiente" | "Parcial"> = ["Pagado", "Pendiente", "Parcial"];

    estudiantes.forEach((est, estIdx) => {
      cursos.slice(0, 3).forEach((curso, curIdx) => {
        const baseDate = new Date(selectedMonth);
        baseDate.setDate(baseDate.getDate() + (estIdx * 2 + curIdx * 3));

        sales.push({
          id: `INV-${String(estIdx + curIdx).padStart(3, "0")}`,
          estudiante: `${est.nombres} ${est.apellidos}`,
          curso: curso.nombre,
          monto: Math.floor(curso.precio),
          fecha: baseDate.toISOString().substring(0, 10),
          estado: estados[(estIdx + curIdx) % 3],
        });
      });
    });

    return sales;
  };

  const sales = generateSalesData();
  const filteredSales =
    estadoFilter === "all" ? sales : sales.filter(s => s.estado === estadoFilter);

  // Cálculos
  const totalVentas = filteredSales.length;
  const ventasPagadas = filteredSales.filter(s => s.estado === "Pagado").length;
  const montoPagado = filteredSales
    .filter(s => s.estado === "Pagado")
    .reduce((sum, s) => sum + s.monto, 0);
  const montoTotal = filteredSales.reduce((sum, s) => sum + s.monto, 0);

  const handleExportCSV = () => {
    const csv = [
      ["ID", "Estudiante", "Curso", "Monto", "Fecha", "Estado"],
      ...filteredSales.map(s => [s.id, s.estudiante, s.curso, s.monto, s.fecha, s.estado]),
    ]
      .map(row => row.map(col => `"${col}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ventas_${selectedMonth}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Éxito",
      description: "Reporte de ventas descargado correctamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gestión de Ventas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control de inscripciones y pagos
          </p>
        </div>

        <Button onClick={handleExportCSV} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
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
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Total de transacciones</p>
              <p className="text-2xl font-semibold mt-1">{totalVentas}</p>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Pagadas</p>
              <p className="text-2xl font-semibold mt-1 text-success-foreground">{ventasPagadas}</p>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Monto recaudado</p>
              <p className="text-2xl font-semibold mt-1">S/ {montoPagado.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-card">
              <p className="text-sm text-muted-foreground">Monto total (registrado)</p>
              <p className="text-2xl font-semibold mt-1">S/ {montoTotal.toLocaleString()}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg p-4 shadow-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mes" className="text-sm font-medium">Mes</Label>
                <input
                  id="mes"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Filtrar por estado</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={estadoFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEstadoFilter("all")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={estadoFilter === "Pagado" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEstadoFilter("Pagado")}
                  >
                    Pagado
                  </Button>
                  <Button
                    variant={estadoFilter === "Pendiente" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEstadoFilter("Pendiente")}
                  >
                    Pendiente
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg bg-card shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h3 className="text-sm font-medium text-foreground">
                Transacciones ({filteredSales.length})
              </h3>
            </div>

            {filteredSales.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No hay transacciones para los filtros especificados
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                    <th className="px-5 py-3 font-medium">ID</th>
                    <th className="px-5 py-3 font-medium">Estudiante</th>
                    <th className="px-5 py-3 font-medium">Curso</th>
                    <th className="px-5 py-3 font-medium">Monto</th>
                    <th className="px-5 py-3 font-medium">Fecha</th>
                    <th className="px-5 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((venta) => (
                    <tr key={venta.id} className="border-t border-border/30 hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{venta.id}</td>
                      <td className="px-5 py-3 text-foreground">{venta.estudiante}</td>
                      <td className="px-5 py-3 text-muted-foreground max-w-xs truncate">
                        {venta.curso}
                      </td>
                      <td className="px-5 py-3 font-medium text-foreground">
                        S/ {venta.monto.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{venta.fecha}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                          statusStyles[venta.estado]
                        }`}>
                          {venta.estado}
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
