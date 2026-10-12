import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, Clock, ArrowRight, FileWarning, Activity, ShieldCheck } from "lucide-react";
import { collection, query, where, getDocs, Timestamp, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Stats {
  totalUsers: number;
  pendingVerifications: number;
  verifiedToday: number;
  activeSessions: number;
}

interface ActivityItem {
  action: string;
  time: string;
  type: "info" | "success";
}

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingVerifications: 0,
    verifiedToday: 0,
    activeSessions: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRef = collection(db, "users");

        const totalUsersSnapshot = await getCountFromServer(usersRef);
        const totalUsers = totalUsersSnapshot.data().count;

        let pendingVerifications = 0;
        try {
          const onboardedQuery = query(usersRef, where("profileId", "!=", null));
          const onboardedSnapshot = await getCountFromServer(onboardedQuery);
          const onboardedCount = onboardedSnapshot.data().count;

          const onboardedAndVerifiedQuery = query(
            usersRef,
            where("profileId", "!=", null),
            where("isVerified", "==", true)
          );
          const onboardedAndVerifiedSnapshot = await getCountFromServer(onboardedAndVerifiedQuery);
          pendingVerifications = onboardedCount - onboardedAndVerifiedSnapshot.data().count;
        } catch (err) {
          console.log("Error calculating pending verifications:", err);
        }

        let verifiedToday = 0;
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const verifiedTodayQuery = query(
            usersRef,
            where("verifiedAt", ">=", Timestamp.fromDate(today))
          );
          verifiedToday = (await getCountFromServer(verifiedTodayQuery)).data().count;
        } catch (err) {
          console.log("No users verified today:", err);
        }

        let activeSessions = 0;
        try {
          const yesterday = new Date();
          yesterday.setHours(yesterday.getHours() - 24);
          const activeQuery = query(
            usersRef,
            where("lastSeenAt", ">=", Timestamp.fromDate(yesterday))
          );
          activeSessions = (await getCountFromServer(activeQuery)).data().count;
        } catch (err) {
          console.log("No active sessions:", err);
        }

        setStats({ totalUsers, pendingVerifications, verifiedToday, activeSessions });

        const recentUsersSnapshot = await getDocs(
          query(usersRef, where("profileId", "!=", null))
        );

        const recentUsers = recentUsersSnapshot.docs
          .sort((a, b) => {
            const aTime = a.data().createdAt?.toDate() || new Date(0);
            const bTime = b.data().createdAt?.toDate() || new Date(0);
            return bTime.getTime() - aTime.getTime();
          })
          .slice(0, 8);

        setActivities(
          recentUsers.map((docSnap) => {
            const data = docSnap.data();
            const timeDiff = Date.now() - (data.createdAt?.toDate().getTime() || 0);
            return {
              action: data.isVerified
                ? `${data.role === "doctor" ? "Doctor" : "Hospital"} verified — ${data.name}`
                : `New registration — ${data.name}`,
              time: formatTimeAgo(timeDiff),
              type: data.isVerified ? "success" : "info",
            };
          })
        );
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatTimeAgo = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-28 rounded-lg bg-slate-100" />
        <div className="h-48 rounded-lg bg-slate-100" />
      </div>
    );
  }

  const queues = [
    {
      title: "Pending verification",
      count: stats.pendingVerifications,
      desc: "Profiles waiting for admin review",
      to: "/admin/verify",
      icon: Clock,
      primary: true,
    },
    {
      title: "Incomplete documents",
      count: null as number | null,
      desc: "Doctors missing required uploads",
      to: "/admin/incomplete-documents",
      icon: FileWarning,
      primary: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-emerald-700">Platform snapshot</p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Operations Overview</h2>
        <p className="text-sm text-slate-500">Review verification activity and keep key queues moving.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total app accounts", value: stats.totalUsers, icon: Users },
          { label: "Pending verification", value: stats.pendingVerifications, icon: Clock },
          { label: "Verified today", value: stats.verifiedToday, icon: ShieldCheck },
          { label: "Active in 24 hours", value: stats.activeSessions, icon: Activity },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3">
          <h3 className="text-base font-semibold text-slate-900">Needs attention</h3>
          <p className="mt-0.5 text-xs text-slate-500">Open a queue to continue your review work.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {queues.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.to)}
                className={`group flex items-start justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-colors ${
                  item.primary
                    ? "border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${item.primary ? "text-emerald-700" : "text-slate-500"}`} />
                    <p className="text-[13px] font-semibold text-slate-900">{item.title}</p>
                  </div>
                  <p className="text-[12px] font-normal text-slate-500">{item.desc}</p>
                  {item.count !== null && (
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                      {item.count}
                    </p>
                  )}
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400 group-hover:text-slate-700" />
              </button>
            );
          })}
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Recent activity</h3>
            <p className="mt-0.5 text-xs text-slate-500">Latest hospital and doctor profile activity.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/verify")}
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            View verifications
          </button>
        </div>
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                      activity.type === "success" ? "bg-emerald-500" : "bg-teal-500"
                    }`}
                  />
                  <span className="text-[13px] text-slate-700 truncate font-normal">
                    {activity.action}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No recent activity</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
