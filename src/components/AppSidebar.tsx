import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  ClipboardList,
  FileText,
  CheckSquare,
  BarChart3,
  GraduationCap,
  Upload,
  TrendingUp,
  Shield,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "@/lib/auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navByRole: Record<UserRole, { label: string; items: NavItem[] }[]> = {
  admin: [
    {
      label: "General",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Ventas", url: "/ventas", icon: DollarSign },
      ],
    },
    {
      label: "Gestión",
      items: [
        { title: "Usuarios", url: "/usuarios", icon: Users },
        { title: "Cursos", url: "/cursos", icon: BookOpen },
        { title: "Inscripciones", url: "/inscripciones", icon: ClipboardList },
        { title: "Auditoría", url: "/auditoria", icon: Shield },
      ],
    },
  ],
  docente: [
    {
      label: "Aula Virtual",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Mis Cursos", url: "/mis-cursos", icon: BookOpen },
        { title: "Contenidos", url: "/contenidos", icon: FileText },
        { title: "Asistencia", url: "/asistencia", icon: CheckSquare },
        { title: "Evaluaciones", url: "/evaluaciones", icon: BarChart3 },
      ],
    },
  ],
  estudiante: [
    {
      label: "Mi Portal",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Mis Cursos", url: "/mis-cursos", icon: GraduationCap },
        { title: "Entregas", url: "/entregas", icon: Upload },
        { title: "Rendimiento", url: "/rendimiento", icon: TrendingUp },
      ],
    },
  ],
};

const roleBadge: Record<UserRole, string> = {
  admin: "Administrador",
  docente: "Docente",
  estudiante: "Estudiante",
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  if (!user) return null;

  const groups = navByRole[user.role];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-semibold text-primary-foreground">M</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground tracking-tight">MENTORY</span>
              <span className="text-[11px] text-muted-foreground">{roleBadge[user.role]}</span>
            </div>
          )}
        </div>

        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <NavLink
                        to={item.url}
                        end
                        className="hover:bg-muted/50"
                        activeClassName="bg-muted text-foreground font-medium"
                      >
                        <item.icon className="mr-2 h-[18px] w-[18px]" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="mr-2 h-[18px] w-[18px]" />
              {!collapsed && <span>Cerrar sesión</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
