import { Bell, Bookmark, Home, MessageCircle, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import PhoneFrame from "@/components/PhoneFrame";

const BRAND = "#00964C";
const MINT = "#EEF8F2";
const PAGE = "#F7F8FA";

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 pt-3 pb-1 text-[10px] font-medium",
        dark ? "text-white/90" : "text-black/80"
      )}
    >
      <span>9:41</span>
      <span className="opacity-70">DrStethos</span>
    </div>
  );
}

function DoctorNav({ active = "home" }: { active?: "home" | "search" | "chat" | "profile" }) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "profile", icon: User, label: "Profile" },
  ] as const;
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-black/5 bg-white px-2 pb-3 pt-2 flex justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const on = item.id === active;
        return (
          <div key={item.id} className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <Icon className="h-4 w-4" style={{ color: on ? BRAND : "#9CA3AF" }} strokeWidth={on ? 2.4 : 2} />
            <span className="text-[9px]" style={{ color: on ? BRAND : "#9CA3AF" }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Faithful Doctor Home mock from Flutter doctors_home_page */
export function DoctorHomeScreen({ className }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <div className="relative h-full w-full text-left" style={{ background: PAGE }}>
        <StatusBar />
        <div className="px-3 pt-1 pb-16 overflow-hidden h-[calc(100%-28px)]">
          <div className="rounded-2xl bg-white p-3 shadow-sm border border-black/5 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ background: BRAND }}
                >
                  DR
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#010101] leading-tight">Dr. Ananya</p>
                  <p className="text-[10px] text-[#6B7280]">Find your next opportunity</p>
                </div>
              </div>
              <Bell className="h-4 w-4 text-[#6B7280]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl p-2.5" style={{ background: "rgb(228,205,255)" }}>
              <p className="text-[10px] text-[#4B4B4B]">Active Jobs</p>
              <p className="text-lg font-semibold text-[#010101]">24</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "rgb(187,246,230)" }}>
              <p className="text-[10px] text-[#4B4B4B]">Hospitals</p>
              <p className="text-lg font-semibold text-[#010101]">12</p>
            </div>
          </div>

          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-[13px] font-semibold text-[#010101]">Featured Jobs</p>
              <p className="text-[10px] text-[#6B7280]">Curated opportunities for you</p>
            </div>
          </div>

          <div className="flex gap-1.5 mb-2 overflow-hidden">
            {["All", "Full-time", "Part-time"].map((c, i) => (
              <span
                key={c}
                className="rounded-full px-2.5 py-1 text-[9px] font-medium whitespace-nowrap"
                style={{
                  background: i === 0 ? BRAND : MINT,
                  color: i === 0 ? "#fff" : BRAND,
                }}
              >
                {c}
              </span>
            ))}
          </div>

          {[
            { role: "Cardiologist", hospital: "City Care Hospital", loc: "Hyderabad", pay: "₹1.2L–1.8L" },
            { role: "Pediatrician", hospital: "Sunrise Multi-speciality", loc: "Bengaluru", pay: "₹80K–1.2L" },
          ].map((job) => (
            <div key={job.role} className="rounded-xl bg-white border border-black/5 p-2.5 mb-2 shadow-sm">
              <div className="flex justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#010101] truncate">{job.role}</p>
                  <p className="text-[10px] text-[#6B7280] truncate">{job.hospital}</p>
                  <p className="text-[9px] text-[#9CA3AF] mt-1">{job.loc} · Full-time</p>
                  <p className="text-[10px] mt-1">
                    <span className="text-[#6B7280]">Salary </span>
                    <span className="font-semibold" style={{ color: BRAND }}>
                      {job.pay}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Bookmark className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  <span
                    className="rounded-full px-2.5 py-1 text-[9px] font-semibold text-white"
                    style={{ background: BRAND }}
                  >
                    Apply
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <DoctorNav active="home" />
      </div>
    </PhoneFrame>
  );
}

/** Job details screen from Flutter job_details_page */
export function DoctorJobDetailsScreen({ className }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <div className="relative h-full w-full text-left bg-white">
        <StatusBar />
        <div className="px-4 pt-2 pb-4 overflow-hidden h-[calc(100%-28px)] flex flex-col">
          <p className="text-[11px] text-[#6B7280] mb-3">← Back</p>
          <div className="flex flex-col items-center text-center mb-4">
            <div
              className="h-12 w-12 rounded-2xl mb-2 flex items-center justify-center text-white text-sm font-bold"
              style={{ background: BRAND }}
            >
              CC
            </div>
            <p className="text-[15px] font-semibold text-[#010101]">Cardiologist</p>
            <p className="text-[11px] text-[#6B7280]">City Care Hospital</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl p-2.5" style={{ background: "#E7F6ED" }}>
              <p className="text-[9px] text-[#6B7280]">Specialization</p>
              <p className="text-[11px] font-semibold text-[#010101]">Cardiology</p>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "#E7F6ED" }}>
              <p className="text-[9px] text-[#6B7280]">Experience</p>
              <p className="text-[11px] font-semibold text-[#010101]">3–5 years</p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-[12px] font-semibold text-[#010101] mb-1">Salary Range</p>
            <p className="text-[13px] font-semibold" style={{ color: BRAND }}>
              ₹1,20,000 – ₹1,80,000
            </p>
          </div>

          <div className="mb-3 flex-1">
            <p className="text-[12px] font-semibold text-[#010101] mb-1">Job Description</p>
            <p className="text-[10px] leading-relaxed text-[#4B4B4B]">
              Join a verified hospital team. Clear responsibilities, structured interviews, and
              in-app application tracking.
            </p>
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              type="button"
              className="flex-1 rounded-full py-2.5 text-[12px] font-semibold text-white"
              style={{ background: BRAND }}
            >
              Apply Now
            </button>
            <button
              type="button"
              className="rounded-full px-4 py-2.5 text-[12px] font-semibold border"
              style={{ borderColor: BRAND, color: BRAND }}
            >
              Message
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/** Hospital home from Flutter hospitals_home_page */
export function HospitalHomeScreen({ className }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <div className="relative h-full w-full text-left" style={{ background: PAGE }}>
        <StatusBar />
        <div className="px-3 pt-1 pb-16 overflow-hidden h-[calc(100%-28px)]">
          <div className="rounded-2xl bg-white p-3 shadow-sm border border-black/5 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-semibold"
                  style={{ background: BRAND }}
                >
                  HC
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#010101] leading-tight">Hope Care</p>
                  <p className="text-[10px] text-[#6B7280]">Manage your job postings</p>
                </div>
              </div>
              <Bell className="h-4 w-4 text-[#6B7280]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {[
              ["Active Jobs", "5"],
              ["Applications", "42"],
              ["Views", "318"],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-white border border-black/5 p-2 text-center">
                <p className="text-[14px] font-semibold text-[#010101]">{v}</p>
                <p className="text-[8px] text-[#6B7280] leading-tight">{l}</p>
              </div>
            ))}
          </div>

          <p className="text-[13px] font-semibold text-[#010101] mb-0.5">Posted Jobs</p>
          <p className="text-[10px] text-[#6B7280] mb-2">Manage your job listings</p>

          <div className="flex gap-1.5 mb-2">
            {["All Jobs", "Active", "Draft"].map((c, i) => (
              <span
                key={c}
                className="rounded-full px-2.5 py-1 text-[9px] font-medium"
                style={{
                  background: i === 0 ? BRAND : MINT,
                  color: i === 0 ? "#fff" : BRAND,
                }}
              >
                {c}
              </span>
            ))}
          </div>

          <div className="rounded-xl bg-white border border-black/5 p-2.5 shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-[12px] font-semibold text-[#010101]">Senior Consultant</p>
                <p className="text-[9px] text-[#6B7280]">Posted 2 days ago</p>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[8px] font-semibold"
                style={{ background: MINT, color: BRAND }}
              >
                Active
              </span>
            </div>
            <p className="text-[9px] text-[#9CA3AF] mb-2">Hyderabad · Full-time · ₹1.5L–2L</p>
            <div className="flex gap-3 text-[9px] text-[#6B7280] mb-2">
              <span>18 Applications</span>
              <span>6 Shortlisted</span>
            </div>
            <button
              type="button"
              className="w-full rounded-full border py-2 text-[10px] font-semibold"
              style={{ borderColor: BRAND, color: BRAND }}
            >
              View Applications
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 border-t border-black/5 bg-white px-2 pb-3 pt-2 flex justify-around">
          {[
            { icon: Home, label: "Home", on: true },
            { icon: Search, label: "Post Job", on: false },
            { icon: MessageCircle, label: "Chat", on: false },
            { icon: User, label: "Profile", on: false },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center gap-0.5 min-w-[48px]">
                <Icon className="h-4 w-4" style={{ color: item.on ? BRAND : "#9CA3AF" }} />
                <span className="text-[9px]" style={{ color: item.on ? BRAND : "#9CA3AF" }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </PhoneFrame>
  );
}

/** Compact profile screen for How it works */
export function DoctorProfileScreen({ className }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <div className="relative h-full w-full text-left" style={{ background: MINT }}>
        <StatusBar />
        <div className="px-4 pt-4 pb-16">
          <div className="flex flex-col items-center text-center mb-4">
            <div
              className="h-16 w-16 rounded-full mb-2 flex items-center justify-center text-white text-lg font-semibold"
              style={{ background: BRAND }}
            >
              DR
            </div>
            <p className="text-[15px] font-semibold text-[#010101]">Dr. Ananya Rao</p>
            <p className="text-[11px] text-[#6B7280]">Cardiologist · Verified</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              ["8", "Years Exp"],
              ["12", "Certificates"],
              ["6", "Applied"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-white p-2 text-center shadow-sm">
                <p className="text-sm font-semibold text-[#010101]">{v}</p>
                <p className="text-[8px] text-[#6B7280]">{l}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-sm space-y-2.5">
            {["Personal Information", "Resume & Documents", "Work Experience", "Education"].map(
              (row) => (
                <div
                  key={row}
                  className="flex items-center justify-between text-[11px] font-medium text-[#010101] py-1 border-b border-black/5 last:border-0"
                >
                  {row}
                  <span className="text-[#9CA3AF]">›</span>
                </div>
              )
            )}
          </div>
        </div>
        <DoctorNav active="profile" />
      </div>
    </PhoneFrame>
  );
}
