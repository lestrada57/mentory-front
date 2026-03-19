import { useAuth } from "@/lib/auth-context";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { DocenteDashboard } from "@/components/dashboards/DocenteDashboard";
import { EstudianteDashboard } from "@/components/dashboards/EstudianteDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "docente":
      return <DocenteDashboard />;
    case "estudiante":
      return <EstudianteDashboard />;
  }
}
