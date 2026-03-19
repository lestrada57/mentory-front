import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export default function Placeholder() {
  const { pathname } = useLocation();
  const name = pathname.slice(1).replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <Construction className="h-10 w-10 text-muted-foreground mb-4" style={{ strokeWidth: 1.5 }} />
      <h2 className="text-lg font-semibold text-foreground">{name}</h2>
      <p className="text-sm text-muted-foreground mt-1">Este módulo se implementará en las próximas fases.</p>
    </div>
  );
}
