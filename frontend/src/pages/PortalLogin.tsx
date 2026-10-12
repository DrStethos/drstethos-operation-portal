import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Building2,
  ShieldCheck,
  Stethoscope,
  CheckCircle2,
  FileSpreadsheet,
  Users2
} from "lucide-react";

export const PortalLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/admin/hospitals", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
      try {
        await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      } catch {
        // Silently ignored if this admin does not have a Firebase Auth account
      }
      toast.success("Welcome back! Signed in to Operations Portal.");
      navigate("/admin/hospitals");
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMsg = "Invalid email or password. Please verify your credentials.";
      if (!error.response) {
        errorMsg = "Cannot reach backend server. Please verify the backend is running on port 5000.";
      } else if (error.response.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response.data?.error) {
        errorMsg = error.response.data.error;
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
      {/* ================= LEFT SIDE: Brand & Operations Highlights ================= */}
      <div className="relative lg:w-[48%] xl:w-[45%] bg-slate-900 text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Subtle background glow & grid lines */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-950 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Brand */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white leading-none">
                DrStethos
              </h2>
              <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
                Hospital Operations
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Feature Highlights for Operations */}
        <div className="relative z-10 my-10 lg:my-auto space-y-8 max-w-lg">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-xs font-medium text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Centralized Enterprise Platform
            </div>
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Hospital Operations &amp; Facility Governance
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              A unified portal for administrators and hospital managers to orchestrate operations, streamline credential verification, and manage facility access.
            </p>
          </div>

          {/* Key Capabilities */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Facility Management</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Manage hospital profiles, departmental assignments, and operational contacts in one place.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Bulk Data Imports</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  High-throughput Excel spreadsheet ingestion with automated validation and error reports.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                <Users2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Role-Based Access Control</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Secure invitation-driven onboarding with isolated access boundaries for managers and super admins.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            MongoDB Powered
          </div>
          <span>&copy; {new Date().getFullYear()} DrStethos</span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: Clean Sign-In Form ================= */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Sign In to Portal
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enter your authorized credentials to access your administrative operations workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@drstethos.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  className="h-11 pl-10 text-sm bg-slate-50/70 border-slate-200 focus:bg-white focus:border-emerald-600 focus-visible:ring-emerald-600/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 pl-10 pr-10 text-sm bg-slate-50/70 border-slate-200 focus:bg-white focus:border-emerald-600 focus-visible:ring-emerald-600/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all mt-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In to Operations Portal"
              )}
            </Button>
          </form>

          {/* Invitation Notice Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-800">Role-Based Access Notice</span>
              <p className="text-slate-500 leading-relaxed">
                Super Admins and Operations Managers sign in here. If you are newly assigned, check your inbox for an invitation link to set your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
