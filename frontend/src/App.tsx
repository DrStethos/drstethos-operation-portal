import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PortalLogin from "./pages/PortalLogin";
import AcceptInvitation from "./pages/AcceptInvitation";
import AdminLayout from "./pages/AdminLayout";
import AdminHome from "./pages/AdminHome";
import AdminVerify from "./pages/AdminVerify";
import AdminUsers from "./pages/AdminUsers";
import AdminIncompleteDocuments from "./pages/AdminIncompleteDocuments";
import HospitalProfile from "./pages/HospitalProfile";
import DoctorProfile from "./pages/DoctorProfile";
import HospitalsOperationsPage from "./pages/HospitalsOperationsPage";
import AddHospitalPage from "./pages/AddHospitalPage";
import BulkImportPage from "./pages/BulkImportPage";
import ManageTeamsPage from "./pages/ManageTeamsPage";
import InviteTeamPage from "./pages/InviteTeamPage";
import HospitalFieldOptionsPage from "./pages/HospitalFieldOptionsPage";
import NotFound from "./pages/NotFound";
import HospitalJobsPage from "./pages/HospitalJobsPage";

const queryClient = new QueryClient();

const isManagerRole = (role?: string) => ["MANAGER", "manager", "operations_user"].includes(role ?? "");

const ProtectedAdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const restrictedPaths = [
    "/admin/home",
    "/admin/verify",
    "/admin/incomplete-documents",
    "/admin/users",
    "/admin/hospital-options",
  ];
  if (
    isManagerRole(user.role) &&
    (restrictedPaths.includes(location.pathname) ||
      location.pathname.startsWith("/admin/teams") ||
      location.pathname.startsWith("/admin/hospital/") ||
      location.pathname.startsWith("/admin/doctor/"))
  ) {
    return <Navigate to="/admin/hospitals" replace />;
  }

  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Entry / Auth Routes */}
            <Route path="/" element={<PortalLogin />} />
            <Route path="/login" element={<PortalLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/hospitals" replace />} />

            {/* Accept Team Invitation Route */}
            <Route path="/accept-invitation" element={<AcceptInvitation />} />

            {/* Authenticated Operations Portal Workspace */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                {/* Operations & Facilities Section */}
                <Route path="hospitals" element={<HospitalsOperationsPage />} />
                <Route path="hospitals/new" element={<AddHospitalPage />} />
                <Route path="hospitals/:hospitalId/edit" element={<AddHospitalPage />} />
                <Route path="jobs" element={<HospitalJobsPage />} />
                <Route path="imports" element={<BulkImportPage />} />
                <Route path="hospital-options" element={<HospitalFieldOptionsPage />} />
                <Route path="teams" element={<ManageTeamsPage />} />
                <Route path="teams/invite" element={<InviteTeamPage />} />

                {/* Platform & Accounts Section */}
                <Route path="home" element={<AdminHome />} />
                <Route path="verify" element={<AdminVerify />} />
                <Route path="incomplete-documents" element={<AdminIncompleteDocuments />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="hospital/:profileId" element={<HospitalProfile />} />
                <Route path="doctor/:profileId" element={<DoctorProfile />} />
              </Route>
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
