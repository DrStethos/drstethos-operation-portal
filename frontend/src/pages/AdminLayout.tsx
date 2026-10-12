import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, BadgeCheck, UsersRound, FileWarning, LogOut,
  Menu, X, Building2, FileSpreadsheet, Users, Tags, UserRound, Globe2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const isManagerRole = (role?: string) => ["MANAGER", "manager", "operations_user"].includes(role ?? "");
const isSuperAdminRole = (role?: string) => ["SUPER_ADMIN", "super_admin"].includes(role ?? "");

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isManager = isManagerRole(user?.role);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const restrictedPaths = ["/admin/home", "/admin/verify", "/admin/incomplete-documents", "/admin/users"];
    const isHospitalEditPath = /^\/admin\/hospitals\/[^/]+\/edit$/.test(location.pathname);
    if (
      !loading &&
      user &&
      isManager &&
      (restrictedPaths.includes(location.pathname) ||
        location.pathname.startsWith("/admin/teams") ||
        location.pathname === "/admin/hospital-options" ||
        isHospitalEditPath ||
        location.pathname.startsWith("/admin/hospital/") ||
        location.pathname.startsWith("/admin/doctor/"))
    ) {
      navigate("/admin/hospitals", { replace: true });
    }
  }, [user, loading, location.pathname, isManager, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-7 w-7 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Streamlined Navigation Groups
  const operationsNav = [
    { name: "Hospitals Directory", path: "/admin/hospitals", icon: Building2 },
    { name: "Bulk Ingestion", path: "/admin/imports", icon: FileSpreadsheet },
    ...(!isManager ? [{ name: "Hospital Field Options", path: "/admin/hospital-options", icon: Tags }] : []),
    ...(!isManager ? [{ name: "Team Management", path: "/admin/teams", icon: Users }] : []),
  ];

  const platformNav = isManager
    ? []
    : [
        { name: "Operations Overview", path: "/admin/home", icon: LayoutDashboard },
        { name: "Doctor Verification", path: "/admin/verify", icon: BadgeCheck },
        { name: "Incomplete Docs", path: "/admin/incomplete-documents", icon: FileWarning },
        { name: "App Accounts", path: "/admin/users", icon: UsersRound },
      ];

  const isActive = (path: string) => {
    if (path === "/admin/hospitals") {
      return location.pathname === "/admin/hospitals" ||
        location.pathname === "/admin/hospitals/new" ||
        /^\/admin\/hospitals\/[^/]+\/edit$/.test(location.pathname);
    }
    if (path === "/admin/teams") {
      return location.pathname === "/admin/teams" || location.pathname === "/admin/teams/invite";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const getPageMeta = () => {
    const p = location.pathname;
    if (p === "/admin/hospitals/new") {
      return { title: "Register Hospital Facility", subtitle: "Add an operational medical center to the portal network" };
    }
    if (/^\/admin\/hospitals\/[^/]+\/edit$/.test(p)) {
      return { title: "Edit Hospital", subtitle: "Update hospital contact and facility details" };
    }
    if (p === "/admin/imports") {
      return { title: "Bulk Hospital Ingestion", subtitle: "Upload Excel spreadsheets to ingest hospital records" };
    }
    if (p === "/admin/hospital-options") {
      return { title: "Hospital Field Options", subtitle: "Manage hospital types and speciality dropdown values" };
    }
    if (p === "/admin/teams/invite") {
      return { title: "Invite Team Member", subtitle: "Dispatch onboarding credentials via transactional email" };
    }
    if (p.includes("/teams")) {
      return { title: "Team Management", subtitle: "Administer staff permissions, roles, and active invitations" };
    }
    if (p.includes("/hospitals")) {
      return { title: "Hospitals Directory", subtitle: "Manage operational facilities and scoped personnel assignments" };
    }
    if (p.includes("/incomplete-documents")) {
      return { title: "Incomplete Documents", subtitle: "Follow up with doctors missing credential requirements" };
    }
    if (p.includes("/verify")) {
      return { title: "Doctor Verification", subtitle: "Inspect medical licenses and take approval action" };
    }
    if (p.includes("/users")) {
      return { title: "App Accounts Management", subtitle: "Search and administer mobile application accounts" };
    }
    return { title: "Operations Workspace", subtitle: "Overview metrics and operational activity feeds" };
  };

  const meta = getPageMeta();

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      {/* Brand Header */}
      <div className="relative flex h-[76px] items-center gap-3 border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 via-white to-white px-5">
        <Link to="/admin/hospitals" className="flex items-center gap-2 min-w-0">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white shadow-sm">
            <img src="/logo.png" alt="DrStethos" className="h-7 w-7 rounded object-contain" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold leading-tight tracking-tight text-slate-900">
              DrStethos
            </p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              Operations Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-5">
        {/* Section 1: Operations Management */}
        <div className="space-y-1">
          <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Operations &amp; Facilities
          </p>
          {operationsNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <div key={item.path}>
                <button
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] transition-all ${
                    active
                      ? "border-emerald-100 bg-emerald-50/80 font-semibold text-emerald-900 shadow-sm shadow-emerald-950/[0.03]"
                      : "border-transparent font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                    active ? "bg-white text-emerald-700 shadow-sm" : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-emerald-700"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left leading-tight">{item.name}</span>
                  {active && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />}
                </button>
                {item.path === "/admin/hospitals" && (
                  <div className="ml-[26px] mt-1.5 space-y-1 border-l border-emerald-100 py-1 pl-3">
                    {[
                      { label: "My List", scope: "mine", icon: UserRound },
                      { label: "All List", scope: "all", icon: Globe2 },
                    ].map(({ label, scope, icon: ScopeIcon }) => {
                      const isCurrentHospitalDirectory =
                        location.pathname === "/admin/hospitals" &&
                        (scope === "mine"
                          ? new URLSearchParams(location.search).get("scope") === "mine"
                          : new URLSearchParams(location.search).get("scope") !== "mine");
                      return (
                        <button
                          key={scope}
                          type="button"
                          onClick={() => navigate(`/admin/hospitals?scope=${scope}`)}
                          aria-current={isCurrentHospitalDirectory ? "page" : undefined}
                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                            isCurrentHospitalDirectory
                              ? "bg-white font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-100"
                              : "text-slate-500 hover:bg-white/80 hover:text-slate-800"
                          }`}
                        >
                          <span className={`flex h-5 w-5 items-center justify-center rounded-md ${
                            isCurrentHospitalDirectory ? "text-emerald-700" : "text-slate-400"
                          }`}>
                            <ScopeIcon className="h-3.5 w-3.5" />
                          </span>
                          {label}
                          {isCurrentHospitalDirectory && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!isManager && (
          <div className="space-y-1">
            <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Platform &amp; Accounts
            </p>
            {platformNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] transition-all ${
                    active
                      ? "border-emerald-100 bg-emerald-50/80 font-semibold text-emerald-900 shadow-sm shadow-emerald-950/[0.03]"
                      : "border-transparent font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                    active ? "bg-white text-emerald-700 shadow-sm" : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-emerald-700"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left leading-tight">{item.name}</span>
                  {active && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* User Footer */}
      <div className="border-t border-slate-100 bg-slate-50/60 p-3">
        <div className="mb-2 flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold uppercase text-emerald-800">
            {(user?.email?.[0] || "U").toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-slate-800">{user?.email || "User"}</p>
            <p className="mt-0.5 truncate text-[10px] font-medium text-emerald-700">
              {isSuperAdminRole(user?.role) ? "Super Admin" : "Operations Manager"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="operations-shell flex h-screen overflow-hidden bg-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[248px] flex-shrink-0 border-r border-slate-200 bg-white">
        {sidebar}
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[248px] border-r border-slate-200 bg-white transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          className="absolute right-2 top-3 rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebar}
      </aside>

      {/* Main Content View */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                {meta.title}
              </h1>
              <p className="text-xs text-slate-500 font-normal truncate">{meta.subtitle}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
