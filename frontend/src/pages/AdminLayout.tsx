import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, BadgeCheck, UsersRound, FileWarning, LogOut,
  Menu, X, Building2, FileSpreadsheet, Users, Tags,
  UserRound, Globe2, ChevronRight, Stethoscope, Briefcase
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
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    const restrictedPaths = ["/admin/home", "/admin/verify", "/admin/incomplete-documents", "/admin/users"];
    const isHospitalEditPath = /^\/admin\/hospitals\/[^/]+\/edit$/.test(location.pathname);
    if (
      !loading && user && isManager &&
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

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

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
      <div className="flex h-screen items-center justify-center bg-[#f5f8f6]">
        <div className="h-6 w-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const operationsNav = [
    { name: "Hospitals", path: "/admin/hospitals", icon: Building2 },
    { name: "Bulk Imports", path: "/admin/imports", icon: FileSpreadsheet },
    ...(!isManager ? [{ name: "Field Options", path: "/admin/hospital-options", icon: Tags }] : []),
    ...(!isManager ? [{ name: "Team Management", path: "/admin/teams", icon: Users }] : []),
  ];

  const platformNav = isManager ? [] : [
    { name: "Overview", path: "/admin/home", icon: LayoutDashboard },
    { name: "Hospital Jobs", path: "/admin/jobs", icon: Briefcase },
    { name: "Verifications", path: "/admin/verify", icon: BadgeCheck },
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
    if (p === "/admin/hospitals/new") return { title: "Register Hospital", subtitle: "Add a medical center to the network" };
    if (/^\/admin\/hospitals\/[^/]+\/edit$/.test(p)) return { title: "Edit Hospital", subtitle: "Update facility details" };
    if (p === "/admin/imports") return { title: "Bulk Imports", subtitle: "Upload Excel spreadsheets to ingest hospital records" };
    if (p === "/admin/hospital-options") return { title: "Field Options", subtitle: "Manage hospital type and speciality dropdowns" };
    if (p === "/admin/teams/invite") return { title: "Invite Member", subtitle: "Send onboarding credentials via email" };
    if (p === "/admin/jobs") return { title: "Hospital Jobs", subtitle: "Browse job postings and vacancies from registered hospitals" };
    if (p.includes("/teams")) return { title: "Team Management", subtitle: "Manage staff roles and active invitations" };
    if (p.includes("/hospitals")) return { title: "Hospitals Directory", subtitle: "Manage facilities and personnel assignments" };
    if (p.includes("/incomplete-documents")) return { title: "Incomplete Documents", subtitle: "Follow up with doctors missing credentials" };
    if (p.includes("/verify")) return { title: "Verifications", subtitle: "Review doctor and hospital profiles and take action" };
    if (p.includes("/users")) return { title: "App Accounts", subtitle: "Manage mobile application accounts" };
    return { title: "Operations Workspace", subtitle: "Overview and activity feeds" };
  };

  const meta = getPageMeta();
  const userInitial = (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();
  const userLabel = user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user?.email ?? "User";
  const roleLabel = isSuperAdminRole(user?.role) ? "Super Admin" : "Operations Manager";

  /* ── Nav item — reused for both sections ── */
  const NavItem = ({ item }: { item: { name: string; path: string; icon: React.ElementType } }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const isHospitalsItem = item.path === "/admin/hospitals";
    const searchParams = new URLSearchParams(location.search);
    const scope = searchParams.get("scope");

    return (
      <div>
        <button
          type="button"
          onClick={() => navigate(item.path)}
          className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150 ${
            active
              ? "bg-emerald-50 text-emerald-900 font-semibold"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
            active
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
              : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700"
          }`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0 flex-1 truncate text-left">{item.name}</span>
          {active && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />}
        </button>

        {/* Hospital sub-scope links */}
        {isHospitalsItem && active && (
          <div className="ml-[26px] mt-0.5 space-y-0.5 border-l-2 border-emerald-100 pl-3">
            {[
              { label: "My Hospitals", scope: "mine", icon: UserRound },
              { label: "All Hospitals", scope: "all", icon: Globe2 },
            ].map(({ label, scope: s, icon: ScopeIcon }) => {
              const isCurrentScope = s === "mine"
                ? scope === "mine"
                : scope !== "mine";
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => navigate(`/admin/hospitals?scope=${s}`)}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] transition-all ${
                    isCurrentScope
                      ? "bg-white font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
                  }`}
                >
                  <ScopeIcon className={`h-3 w-3 flex-shrink-0 ${isCurrentScope ? "text-emerald-600" : "text-slate-400"}`} />
                  {label}
                  {isCurrentScope && <ChevronRight className="ml-auto h-3 w-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <Link
        to="/admin/hospitals"
        className="flex h-[60px] flex-shrink-0 items-center gap-2.5 border-b border-slate-100 px-4 hover:bg-slate-50/60 transition-colors"
      >
        <img
          src="/logo.png"
          alt="DrStethos"
          className="h-8 w-8 rounded-lg object-contain shadow-sm flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-[14px] font-bold leading-none text-slate-900 tracking-tight">DrStethos</p>
          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-600">Operations Portal</p>
        </div>
      </Link>

      {/* Nav — scrollbar hidden */}
      <nav className="scrollbar-hide flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Operations */}
        <div className="space-y-0.5">
          <p className="mb-2 px-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Operations
          </p>
          {operationsNav.map((item) => <NavItem key={item.path} item={item} />)}
        </div>

        {/* Platform (super admin only) */}
        {!isManager && platformNav.length > 0 && (
          <div className="space-y-0.5">
            <p className="mb-2 px-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Platform
            </p>
            {platformNav.map((item) => <NavItem key={item.path} item={item} />)}
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="flex-shrink-0 border-t border-slate-100 p-3 space-y-1">
        {/* Avatar row */}
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
            {userInitial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-slate-800 leading-none">{userLabel}</p>
            <p className="mt-0.5 text-[10px] font-medium text-emerald-600">{roleLabel}</p>
          </div>
        </div>
        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="operations-shell flex h-screen overflow-hidden bg-[#f5f8f6]">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] h-full flex-col flex-shrink-0 border-r border-slate-200/80 bg-white overflow-hidden shadow-[1px_0_0_0_rgb(226_232_240/0.6)]">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[220px] border-r border-slate-200 bg-white shadow-xl transition-transform duration-250 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          className="absolute right-2 top-2.5 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-sm px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile hamburger */}
            <button
              type="button"
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 transition-colors md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-[15px] font-bold text-slate-900 tracking-tight leading-tight truncate">
                {meta.title}
              </h1>
              <p className="text-[11px] text-slate-500 leading-tight truncate hidden sm:block">{meta.subtitle}</p>
            </div>
          </div>

          {/* Header right — role badge */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {roleLabel}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
