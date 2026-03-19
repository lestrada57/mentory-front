import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { Bell } from "lucide-react";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Bell className="h-[18px] w-[18px]" style={{ strokeWidth: 1.5 }} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-info" />
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium text-foreground">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-foreground hidden sm:block">{user?.name}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
