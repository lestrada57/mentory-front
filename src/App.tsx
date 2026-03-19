import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { CursosManagement } from "@/components/CursosManagement";
import { UsuariosManagement } from "@/components/UsuariosManagement";
import { VentasManagement } from "@/components/VentasManagement";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Unauthorized from "@/pages/Unauthorized";
import Placeholder from "@/pages/Placeholder";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected routes with layout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Admin routes */}
              <Route path="/ventas" element={<ProtectedRoute allowedRoles={["admin"]}><VentasManagement /></ProtectedRoute>} />
              <Route path="/usuarios" element={<ProtectedRoute allowedRoles={["admin"]}><UsuariosManagement /></ProtectedRoute>} />
              <Route path="/cursos" element={<ProtectedRoute allowedRoles={["admin", "docente"]}><CursosManagement /></ProtectedRoute>} />
              <Route path="/inscripciones" element={<ProtectedRoute allowedRoles={["admin"]}><Placeholder /></ProtectedRoute>} />
              <Route path="/auditoria" element={<ProtectedRoute allowedRoles={["admin"]}><Placeholder /></ProtectedRoute>} />
              {/* Docente routes */}
              <Route path="/mis-cursos" element={<ProtectedRoute allowedRoles={["docente", "estudiante"]}><Placeholder /></ProtectedRoute>} />
              <Route path="/contenidos" element={<ProtectedRoute allowedRoles={["docente"]}><Placeholder /></ProtectedRoute>} />
              <Route path="/asistencia" element={<ProtectedRoute allowedRoles={["docente"]}><Placeholder /></ProtectedRoute>} />
              <Route path="/evaluaciones" element={<ProtectedRoute allowedRoles={["docente"]}><Placeholder /></ProtectedRoute>} />
              {/* Estudiante routes */}
              <Route path="/entregas" element={<ProtectedRoute allowedRoles={["estudiante"]}><Placeholder /></ProtectedRoute>} />
              <Route path="/rendimiento" element={<ProtectedRoute allowedRoles={["estudiante"]}><Placeholder /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
