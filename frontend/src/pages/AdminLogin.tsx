import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/admin/home");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden flex bg-white">
      {/* Left brand panel */}
      <aside className="hidden lg:flex lg:w-[44%] xl:w-[46%] relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white flex-col justify-between p-10 xl:p-14">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>
        <div className="absolute -top-24 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-16 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="DrStethos"
              className="w-9 h-9 object-contain rounded-full bg-white/10 p-0.5 group-hover:scale-105 transition-transform"
            />
            <span className="text-[15px] font-semibold tracking-tight">DrStethos</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-5 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Admin Access
          </div>
          <h1 className="text-3xl xl:text-4xl font-semibold leading-snug tracking-tight">
            Manage healthcare hiring with confidence
          </h1>
          <p className="text-sm xl:text-[15px] text-white/80 leading-relaxed font-normal">
            Sign in to verify doctors and hospitals, review profiles, and keep the DrStethos platform running smoothly.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/55 font-normal">
          © {new Date().getFullYear()} DrStethos. All rights reserved.
        </p>
      </aside>

      {/* Right form panel */}
      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-10 sm:py-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand header */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <img
                src="/logo.png"
                alt="DrStethos"
                className="w-9 h-9 object-contain rounded-full"
              />
              <span className="text-[15px] font-semibold text-gray-900 tracking-tight">DrStethos</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
              Admin Login
            </h2>
            <p className="text-sm text-gray-500 font-normal leading-relaxed">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 pl-10 text-sm bg-white border-gray-200 focus-visible:ring-primary/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 pl-10 pr-10 text-sm bg-white border-gray-200 focus-visible:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-primary transition-colors font-medium"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
