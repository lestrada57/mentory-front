import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <ShieldX className="h-12 w-12 text-muted-foreground mx-auto mb-4" style={{ strokeWidth: 1.5 }} />
        <h1 className="text-xl font-semibold text-foreground">Acceso denegado</h1>
        <p className="text-sm text-muted-foreground mt-2 mb-6">No tienes permisos para acceder a esta sección.</p>
        <Button onClick={() => navigate("/dashboard")} className="transition-all active:scale-[0.98]">
          Ir al Dashboard
        </Button>
      </div>
    </div>
  );
}
