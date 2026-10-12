import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Building2, Stethoscope, Clock, BadgeCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface VerificationItem {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  profileId?: string;
}

const AdminVerify = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "verified">("pending");
  const [roleFilter, setRoleFilter] = useState<"all" | "doctor" | "hospital">("all");

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const usersRef = collection(db, "users");
      let querySnapshot;
      try {
        querySnapshot = await getDocs(query(usersRef, orderBy("createdAt", "desc")));
      } catch {
        querySnapshot = await getDocs(usersRef);
      }

      const users: VerificationItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.profileId) {
          users.push({
            id: docSnap.id,
            uid: data.uid,
            name: data.name || "N/A",
            email: data.email || "N/A",
            role: data.role || "N/A",
            isVerified: data.isVerified || false,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            profileId: data.profileId,
          });
        }
      });

      users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setVerifications(users);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      toast.error("Failed to load verification requests");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = verifications.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.role.toLowerCase().includes(q);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && !item.isVerified) ||
      (activeTab === "verified" && item.isVerified);

    const matchesRole =
      roleFilter === "all" || item.role?.toLowerCase() === roleFilter;

    return matchesSearch && matchesTab && matchesRole;
  });

  const pendingCount = verifications.filter((v) => !v.isVerified).length;
  const verifiedCount = verifications.filter((v) => v.isVerified).length;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const openProfile = (item: VerificationItem) => {
    const route =
      item.role?.toLowerCase() === "hospital"
        ? `/admin/hospital/${item.profileId}`
        : `/admin/doctor/${item.profileId}`;
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 rounded bg-slate-100" />
        <div className="h-64 rounded bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-slate-500 border-b border-slate-100 pb-3">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 tabular-nums">{verifications.length}</span> total
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-semibold text-slate-900 tabular-nums">{pendingCount}</span> pending
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-semibold text-slate-900 tabular-nums">{verifiedCount}</span> verified
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 border-slate-200 bg-slate-50/60 pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(["all", "pending", "verified"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "h-8 rounded-md px-3 text-xs capitalize transition-colors",
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              )}
            >
              {tab}
              {tab === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          ))}
          <span className="mx-0.5 hidden h-8 w-px bg-slate-200 sm:block" />
          {(["all", "doctor", "hospital"] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={cn(
                "h-8 rounded-md px-3 text-xs capitalize transition-colors",
                roleFilter === role
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              )}
            >
              {role === "all" ? "All roles" : `${role}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-2 py-2.5 font-medium sm:px-3">Applicant</th>
              <th className="px-2 py-2.5 font-medium sm:px-3">Role</th>
              <th className="px-2 py-2.5 font-medium sm:px-3">Status</th>
              <th className="px-2 py-2.5 font-medium sm:px-3">Registered</th>
              <th className="px-2 py-2.5 font-medium text-right sm:px-3">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const isHospital = item.role?.toLowerCase() === "hospital";
              const RoleIcon = isHospital ? Building2 : Stethoscope;

              return (
                <tr
                  key={item.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-slate-50",
                    !item.isVerified && "bg-amber-50/30"
                  )}
                  onClick={() => openProfile(item)}
                >
                  <td className="px-2 py-2.5 sm:px-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-700">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-slate-900">{item.name}</p>
                        <p className="truncate text-[12px] text-slate-500">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium capitalize text-slate-700">
                      <RoleIcon className="h-3 w-3 text-slate-400" />
                      {item.role}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <span
                      className={cn(
                        "text-[12px] font-medium",
                        item.isVerified ? "text-emerald-700" : "text-amber-700"
                      )}
                    >
                      {item.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-[12px] text-slate-500 sm:px-3">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-2 py-2.5 text-right sm:px-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProfile(item);
                      }}
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Review
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-14 text-center">
            <p className="text-sm font-medium text-slate-600">No profiles match your filters</p>
            <p className="mt-1 text-xs text-slate-400">Try changing the status or role filter</p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
        Showing {filtered.length} of {verifications.length}
      </div>
    </div>
  );
};

export default AdminVerify;
