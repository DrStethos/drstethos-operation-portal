import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Building2,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Users2,
  LogIn,
  Stethoscope,
} from "lucide-react";

export const PortalLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/admin/hospitals", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const portalUser = await login(email.trim().toLowerCase(), password);
      if (portalUser.role === "SUPER_ADMIN" || portalUser.role === "super_admin") {
        try {
          const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
          const userDocument = await getDoc(doc(db, "users", credential.user.uid));

          let isAuthorized = false;
          if (userDocument.exists()) {
            const userData = userDocument.data();
            const normalizedRole = String(userData?.role || "").toLowerCase().trim();
            isAuthorized =
              userData?.isAdmin === true ||
              userData?.isAdmin === "true" ||
              ["admin", "super_admin", "superadmin"].includes(normalizedRole);

            if (!isAuthorized) {
              try {
                await setDoc(doc(db, "users", credential.user.uid), {
                  isAdmin: true,
                  role: "admin",
                }, { merge: true });
                isAuthorized = true;
              } catch (updateErr) {
                console.warn("Could not auto-update Firestore admin flags:", updateErr);
                throw new Error(`Firestore document 'users/${credential.user.uid}' exists but lacks admin rights (isAdmin: true or role: 'admin').`);
              }
            }
          } else {
            try {
              await setDoc(doc(db, "users", credential.user.uid), {
                email: credential.user.email || email.trim().toLowerCase(),
                isAdmin: true,
                role: "admin",
                createdAt: new Date(),
                isVerified: true,
              }, { merge: true });
              isAuthorized = true;
            } catch (createErr) {
              console.warn("Could not auto-create Firestore admin document:", createErr);
              throw new Error(`Firebase Auth succeeded, but no Firestore document was found at 'users/${credential.user.uid}'. Please create it with isAdmin: true.`);
            }
          }

          if (!isAuthorized) {
            throw new Error("This Firebase account is not authorized for admin verification.");
          }
        } catch (error) {
          console.warn("MongoDB portal login succeeded, but Firebase verification sign-in failed:", error);
          try {
            await signOut(auth);
          } catch (signOutError) {
            console.error("Could not clear the unverified Firebase session:", signOutError);
          }

          let specificError = "Verification actions may be unavailable without an authorized Firebase admin account.";
          const firebaseErr = error as { code?: string; message?: string };
          if (firebaseErr?.code === "auth/user-not-found") {
            specificError = `No user found in Firebase Auth for "${email.trim().toLowerCase()}". Ensure it exists in Firebase Authentication.`;
          } else if (firebaseErr?.code === "auth/wrong-password" || firebaseErr?.code === "auth/invalid-credential") {
            specificError = "Firebase password does not match. Ensure your Firebase Auth password matches your portal password.";
          } else if (firebaseErr?.message) {
            specificError = firebaseErr.message;
          }

          toast.warning(`Portal login succeeded, but Firebase verification sign-in failed: ${specificError}`, {
            duration: 9000,
          });
        }
      }
      toast.success("Welcome back! Signed in to Operations Portal.");
      navigate("/admin/hospitals");
    } catch (error: unknown) {
      console.error("Login error:", error);
      let errorMsg = "Invalid email or password. Please verify your credentials.";
      const axiosErr = error as { response?: { data?: { message?: string; error?: string } } };
      if (!axiosErr.response) {
        errorMsg = "Cannot reach backend server. Please verify the backend is running on port 5000.";
      } else if (axiosErr.response.data?.message) {
        errorMsg = axiosErr.response.data.message;
      } else if (axiosErr.response.data?.error) {
        errorMsg = axiosErr.response.data.error;
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Building2 className="w-4 h-4" />,
      title: "Facility Management",
      desc: "Manage hospital profiles, departmental assignments, and operational contacts in one place.",
    },
    {
      icon: <FileSpreadsheet className="w-4 h-4" />,
      title: "Bulk Data Imports",
      desc: "High-throughput Excel spreadsheet ingestion with automated validation and error reports.",
    },
    {
      icon: <Users2 className="w-4 h-4" />,
      title: "Role-Based Access Control",
      desc: "Secure invitation-driven onboarding with isolated access boundaries for managers and super admins.",
    },
  ];

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-[#eef7f0]">

      {/* ── LEFT PANEL — branding (hidden on mobile) ── */}
      <div className="hidden lg:flex relative w-[52%] flex-col justify-between px-12 py-8 overflow-hidden">

        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #197847 1px, transparent 0)`, backgroundSize: "26px 26px" }}
          aria-hidden="true"
        />
        {/* Subtle corner glows */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-200/25 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-emerald-100/35 blur-3xl pointer-events-none" aria-hidden="true" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <img src="/logo.png" alt="DrStethos" className="h-9 w-9 rounded-lg object-contain shadow-sm flex-shrink-0" />
          <div>
            <p className="text-[#1a3c2a] font-bold text-sm leading-none">DrStethos</p>
            <p className="text-[9.5px] font-semibold text-emerald-600 uppercase tracking-[0.2em] mt-0.5">Hospital Operations</p>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200 text-[11px] font-semibold text-emerald-700 shadow-sm">
            <ShieldCheck className="w-3 h-3" />
            Centralized Enterprise Platform
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-[2.15rem] font-extrabold text-[#1a2e22] leading-[1.15]">
              Hospital Operations &amp;
            </h1>
            <h1 className="text-[2.15rem] font-extrabold text-emerald-600 leading-[1.15]">
              Facility Governance
            </h1>
          </div>

          {/* Description */}
          <p className="text-[13px] text-slate-500 leading-relaxed max-w-[400px]">
            A unified portal for administrators and hospital managers to orchestrate operations,
            streamline credential verification, and manage facility access.
          </p>

          {/* Feature rows */}
          <div className="space-y-3.5 pt-1">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{f.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            MongoDB Powered
          </div>
          <span>© {new Date().getFullYear()} DrStethos</span>
        </div>
      </div>

      {/* ── RIGHT PANEL — login card ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-6 overflow-y-auto">

        {/* Mobile-only logo */}
        <div className="flex lg:hidden items-center gap-2 mb-5">
          <img src="/logo.png" alt="DrStethos" className="h-8 w-8 rounded-lg object-contain shadow-sm flex-shrink-0" />
          <div>
            <p className="text-[#1a3c2a] font-bold text-sm leading-none">DrStethos</p>
            <p className="text-[9px] font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">Hospital Operations</p>
          </div>
        </div>

        {/* Card wrapper — constrained, vertically stacked */}
        <div className="w-full max-w-[400px] space-y-3">

          {/* Secure Access — above card */}
          <div className="flex justify-end items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-700">Secure Access</span>
              <span className="text-[10px] text-slate-400 block leading-none mt-0.5">Only authorized personnel.</span>
            </div>
          </div>

          {/* White login card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 space-y-5">

            {/* Card header */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="DrStethos" className="h-10 w-10 rounded-xl object-contain shadow-sm flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">Sign In to Portal</h2>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Enter your credentials to access your operations workspace.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-[11px] font-semibold text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    autoComplete="email"
                    className="h-10 pl-9 text-sm bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-600 focus-visible:ring-emerald-600/20 rounded-lg"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-[11px] font-semibold text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-10 pl-9 pr-9 text-sm bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-600 focus-visible:ring-emerald-600/20 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-10 text-sm font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm transition-all gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating…</>
                ) : (
                  <><LogIn className="h-4 w-4" /> Sign In</>
                )}
              </Button>

              <p className="text-center text-[10px] text-slate-400">
                Need help? Contact your system administrator.
              </p>
            </form>

            {/* Role notice */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-slate-800">Role-Based Access Notice</p>
                <p className="text-[10.5px] text-slate-500 leading-relaxed mt-0.5">
                  <span className="font-medium text-emerald-700">Super Admins</span> and{" "}
                  <span className="font-medium text-emerald-700">Operations Managers</span> sign in here.
                  If newly assigned, check your inbox for an invitation link to set your password.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile footer */}
          <p className="flex lg:hidden items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            MongoDB Powered · © {new Date().getFullYear()} DrStethos
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
