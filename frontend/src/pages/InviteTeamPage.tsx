import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { UserPlus, ArrowLeft, Loader2, Send, Mail, ShieldCheck, Building2, Users } from "lucide-react";

export const InviteTeamPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"SUPER_ADMIN" | "MANAGER">("MANAGER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/invitations", {
        email: email.trim().toLowerCase(),
        role,
      });
      toast.success(`Invitation successfully dispatched to ${email}!`);
      navigate("/admin/teams");
    } catch (error: any) {
      console.error("Invite error:", error);
      toast.error(error.response?.data?.error || "Failed to send invitation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/teams"
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Invite Team Member
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Send an onboarding invitation link via SMTP email to grant operations or administrative access
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Container (2 cols) */}
        <div className="md:col-span-2">
          <form onSubmit={handleSendInvite} className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  Recipient Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g. manager@hospitalgroup.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 text-sm bg-slate-50/50 border-slate-200 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  An activation email will be sent containing a secure 24-hour invitation link.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">
                  Select Role & Permission Level
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer rounded-xl border p-4 flex flex-col justify-between transition-all ${
                      role === "MANAGER"
                        ? "border-blue-600 bg-blue-50/40 text-blue-900 ring-1 ring-blue-600/30"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <Building2 className={`w-5 h-5 ${role === "MANAGER" ? "text-blue-600" : "text-slate-400"}`} />
                      <input
                        type="radio"
                        name="role"
                        value="MANAGER"
                        checked={role === "MANAGER"}
                        onChange={() => setRole("MANAGER")}
                        className="sr-only"
                      />
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-bold">Operations Manager</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Scoped access to manage assigned hospital operations and verify records.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`cursor-pointer rounded-xl border p-4 flex flex-col justify-between transition-all ${
                      role === "SUPER_ADMIN"
                        ? "border-purple-600 bg-purple-50/40 text-purple-900 ring-1 ring-purple-600/30"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <ShieldCheck className={`w-5 h-5 ${role === "SUPER_ADMIN" ? "text-purple-600" : "text-slate-400"}`} />
                      <input
                        type="radio"
                        name="role"
                        value="SUPER_ADMIN"
                        checked={role === "SUPER_ADMIN"}
                        onChange={() => setRole("SUPER_ADMIN")}
                        className="sr-only"
                      />
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-bold">Super Admin</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Full platform sovereignty: team invites, global hospitals, and audit logs.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/teams")}
                disabled={isSubmitting}
                className="text-xs h-9 px-4 border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Info Card (1 col) */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3 text-xs">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Onboarding Process
            </h4>
            <ol className="space-y-3 text-slate-600 text-[11px] list-decimal pl-4 leading-relaxed">
              <li>
                <strong>Invitation Sent:</strong> The recipient receives a branded invitation email with an acceptance button.
              </li>
              <li>
                <strong>Password Creation:</strong> Clicking the link opens the portal where they establish their secure credentials.
              </li>
              <li>
                <strong>Instant Access:</strong> Once activated, they can immediately log in with their assigned role privileges.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteTeamPage;
