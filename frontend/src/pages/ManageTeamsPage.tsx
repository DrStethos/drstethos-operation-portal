import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, UserPlus, Mail, ShieldCheck, Trash2, Clock,
  Search, RefreshCw, Loader2, UserCheck, ShieldAlert
} from "lucide-react";

interface TeamMember {
  id: string;
  _id?: string;
  email: string;
  role: "SUPER_ADMIN" | "MANAGER";
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

interface PendingInvitation {
  id: string;
  _id?: string;
  email: string;
  role: "SUPER_ADMIN" | "MANAGER";
  expiresAt: string;
  createdAt?: string;
}

export const ManageTeamsPage = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"members" | "invitations">("members");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersRes, invitesRes] = await Promise.allSettled([
        api.get("/users"),
        api.get("/invitations"),
      ]);

      if (membersRes.status === "fulfilled") {
        setMembers(membersRes.value.data);
      }
      if (invitesRes.status === "fulfilled") {
        setInvitations(invitesRes.value.data);
      }
    } catch (error) {
      console.error("Error loading team data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteMember = async (id: string, email: string) => {
    if (id === currentUser?.id) {
      toast.error("You cannot delete your own active account.");
      return;
    }
    if (!confirm(`Are you sure you want to remove team member "${email}"?`)) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("Team member removed successfully.");
      setMembers((prev) => prev.filter((m) => (m.id || m._id) !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to remove member.");
    }
  };

  const handleRevokeInvitation = async (id: string, email: string) => {
    if (!confirm(`Revoke pending invitation for "${email}"?`)) return;

    try {
      await api.delete(`/invitations/${id}`);
      toast.success("Invitation revoked successfully.");
      setInvitations((prev) => prev.filter((i) => (i.id || i._id) !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to revoke invitation.");
    }
  };

  const filteredMembers = members.filter((m) =>
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.role?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredInvitations = invitations.filter((i) =>
    i.email?.toLowerCase().includes(search.toLowerCase()) ||
    i.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Manage Operations Team
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer platform personnel, access privileges, and active team invitations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/teams/invite">
            <Button size="sm" className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <UserPlus className="w-3.5 h-3.5" />
              Invite Team Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "members"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Active Team ({members.length})
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "invitations"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Pending Invites ({invitations.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search team by email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs w-64 bg-slate-50/50 border-slate-200"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="h-9 px-3 border-slate-200 text-slate-600"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-xs">Loading team records...</p>
        </div>
      ) : activeTab === "members" ? (
        /* Active Team Members Table */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Assigned Role</th>
                  <th className="px-5 py-3.5">Joined Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-400 text-xs">
                      No team members found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const mid = member.id || member._id || "";
                    const isSelf = mid === currentUser?.id;
                    return (
                      <tr key={mid} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                              {member.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">
                                {member.email} {isSelf && <span className="text-[10px] text-blue-600 font-normal">(You)</span>}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {member.firstName ? `${member.firstName} ${member.lastName || ""}` : "Portal Administrator"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                              member.role === "SUPER_ADMIN"
                                ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                                : "bg-blue-50 text-blue-700 border border-blue-200/60"
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {member.role === "SUPER_ADMIN" ? "Super Administrator" : "Operations Manager"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                          {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "Active"}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {!isSelf && (
                            <button
                              onClick={() => handleDeleteMember(mid, member.email)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1"
                              title="Remove Team Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Pending Invitations Table */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Invited Recipient</th>
                  <th className="px-5 py-3.5">Assigned Role</th>
                  <th className="px-5 py-3.5">Expires At</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInvitations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-400 text-xs">
                      No pending invitations currently active.
                    </td>
                  </tr>
                ) : (
                  filteredInvitations.map((invite) => {
                    const iid = invite.id || invite._id || "";
                    const expires = new Date(invite.expiresAt);
                    const isExpired = expires < new Date();
                    return (
                      <tr key={iid} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Mail className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold text-slate-900">{invite.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {invite.role === "SUPER_ADMIN" ? "Super Admin" : "Operations Manager"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[11px]">
                          <span className={isExpired ? "text-red-500 font-semibold" : "text-slate-500"}>
                            {isExpired ? "Expired" : expires.toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleRevokeInvitation(iid, invite.email)}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                          >
                            Revoke Invite
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeamsPage;
