import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { collection, doc, getCountFromServer, getDoc, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "@/lib/firebase";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Briefcase, Search, Building2, MapPin, Phone, Mail,
  RefreshCw, Loader2, Tag, Users2, ExternalLink, Eye, Trash2,
  IndianRupee, Clock, CheckCircle2, AlertCircle, X
} from "lucide-react";

export interface PostedJob {
  id: string;
  jobTitle: string;
  hospitalId?: string;
  hospitalName: string;
  speciality?: string;
  location?: string;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceRequired?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  appliedCount?: number;
  viewedCount?: number;
  vacancyCount?: number;
  status: string;
  contactNumber?: string;
  email?: string;
  source: "App Post" | "Portal Vacancy";
  createdAt?: string;
}

export interface MongoHospitalItem {
  id?: string;
  _id?: string;
  name: string;
  vacancy?: number | null;
  speciality?: string;
  location?: string;
  hospitalType?: string;
  contactNumber?: string;
  email?: string;
  createdAt?: string;
}

interface JobApplicant {
  id: string;
  doctorId?: string;
  doctorName: string;
  specialization?: string;
  experience?: number;
  appliedAt?: Date;
  status: string;
  interviewAt?: Date;
}

const formatApplicationStatus = (status: string) =>
  status
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const toDate = (value: unknown): Date | undefined => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  if (typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function") {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : undefined;
  }
  return undefined;
};

const formatDateTime = (date?: Date) => date
  ? date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  : "Not scheduled";

export const HospitalJobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<PostedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<PostedJob | null>(null);
  const [jobToDelete, setJobToDelete] = useState<PostedJob | null>(null);
  const [isDeletingJob, setIsDeletingJob] = useState(false);
  const [applicants, setApplicants] = useState<JobApplicant[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState("");

  useEffect(() => {
    if (!selectedJob) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedJob(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedJob]);

  const openJobDetails = async (job: PostedJob) => {
    setSelectedJob(job);
    setApplicants([]);
    setApplicantsError("");
    if (job.source !== "App Post") return;

    setApplicantsLoading(true);
    try {
      const applicationsSnapshot = await getDocs(collection(db, "jobs", job.id, "applications"));
      const jobApplicants = await Promise.all(applicationsSnapshot.docs.map(async (applicationDoc) => {
        const data = applicationDoc.data();
        const doctorId = typeof data.doctorId === "string" ? data.doctorId : "";
        let doctorData: Record<string, unknown> | undefined;
        if (doctorId) {
          try {
            const doctorApplication = await getDoc(doc(db, "doctors", doctorId, "appliedJobs", applicationDoc.id));
            doctorData = doctorApplication.exists() ? doctorApplication.data() : undefined;
          } catch (error) {
            console.warn(`Could not load doctor-side status for application ${applicationDoc.id}:`, error);
          }
        }
        const interviewValue =
          data.interviewAt ?? data.interviewScheduledAt ?? data.interviewDateTime ??
          data.interviewDate ?? doctorData?.interviewAt ?? doctorData?.interviewScheduledAt ??
          doctorData?.interviewDateTime ?? doctorData?.interviewDate;

        return {
          id: applicationDoc.id,
          doctorId: doctorId || undefined,
          doctorName: data.doctorName || "Doctor",
          specialization: data.doctorSpecialization,
          experience: typeof data.doctorExperience === "number" ? data.doctorExperience : undefined,
          appliedAt: toDate(data.appliedAt),
          status: typeof data.status === "string"
            ? data.status
            : typeof doctorData?.applicationStatus === "string"
              ? doctorData.applicationStatus
              : "applied",
          interviewAt: toDate(interviewValue),
        };
      }));
      setApplicants(jobApplicants.sort((left, right) =>
        (right.appliedAt?.getTime() ?? 0) - (left.appliedAt?.getTime() ?? 0)
      ));
      setJobs((currentJobs) => currentJobs.map((currentJob) =>
        currentJob.id === job.id && currentJob.source === "App Post"
          ? { ...currentJob, appliedCount: jobApplicants.length }
          : currentJob
      ));
      setSelectedJob((currentJob) =>
        currentJob?.id === job.id && currentJob.source === "App Post"
          ? { ...currentJob, appliedCount: jobApplicants.length }
          : currentJob
      );
    } catch (error) {
      console.error("Failed to load job applications:", error);
      setApplicantsError("Could not load applicant and status details. Check Firebase access and try again.");
    } finally {
      setApplicantsLoading(false);
    }
  };

  const fetchAllJobs = async () => {
    try {
      setLoading(true);

      // 1. Fetch jobs posted by hospitals in Firestore
      let firestoreJobs: PostedJob[] = [];
      try {
        const jobsSnap = await getDocs(collection(db, "jobs"));
        firestoreJobs = await Promise.all(jobsSnap.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let appliedCount = typeof data.appliedCount === "number" ? data.appliedCount : 0;
          try {
            const applicationsCount = await getCountFromServer(
              collection(db, "jobs", docSnap.id, "applications")
            );
            appliedCount = applicationsCount.data().count;
          } catch (error) {
            console.warn(`Could not fetch application count for job ${docSnap.id}:`, error);
          }
          return {
            id: docSnap.id,
            jobTitle: data.jobTitle || "Medical Practitioner",
            hospitalId: data.hospitalId,
            hospitalName: data.hospitalName || "Hospital Facility",
            speciality: data.specialization || data.speciality || "Healthcare",
            location: data.location || "India",
            jobType: data.jobType || "Full-time",
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            experienceRequired: data.experienceRequired,
            description: data.description,
            requirements: Array.isArray(data.requirements) ? data.requirements : [],
            benefits: Array.isArray(data.benefits) ? data.benefits : [],
            appliedCount,
            viewedCount: typeof data.viewedCount === "number" ? data.viewedCount : 0,
            status: data.status || "active",
            source: "App Post",
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
          };
        }));
      } catch (err) {
        console.warn("Could not query Firestore jobs:", err);
      }

      // 2. Fetch hospital vacancies recorded in Operations Portal MongoDB
      const portalJobs: PostedJob[] = [];
      try {
        const res = await api.get("/hospitals");
        const list = Array.isArray(res.data) ? (res.data as MongoHospitalItem[]) : [];
        list
          .filter((h) => typeof h.vacancy === "number" && h.vacancy > 0)
          .forEach((h) => {
            portalJobs.push({
              id: h.id || h._id || "",
              jobTitle: `${h.speciality || "Specialist Doctor"} Opening`,
              hospitalId: h.id || h._id,
              hospitalName: h.name,
              speciality: h.speciality || "General Medicine",
              location: h.location || "Location not recorded",
              jobType: h.hospitalType || "Full-time",
              vacancyCount: h.vacancy || 0,
              contactNumber: h.contactNumber,
              email: h.email,
              status: "active",
              source: "Portal Vacancy",
              createdAt: h.createdAt,
            });
          });
      } catch (err) {
        console.warn("Could not query portal hospital vacancies:", err);
      }

      setJobs([...firestoreJobs, ...portalJobs]);
    } catch (err) {
      console.error("Failed to load hospital jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const specialities = Array.from(
    new Set(jobs.map((j) => j.speciality).filter(Boolean))
  ).sort() as string[];

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      j.jobTitle.toLowerCase().includes(q) ||
      j.hospitalName.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.speciality?.toLowerCase().includes(q);
    const matchSpeciality = !specialityFilter || j.speciality === specialityFilter;
    const matchSource = sourceFilter === "all" || j.source === sourceFilter;
    const matchStatus = statusFilter === "all" || j.status.toLowerCase() === statusFilter;
    return matchSearch && matchSpeciality && matchSource && matchStatus;
  });

  const appJobsCount = jobs.filter((j) => j.source === "App Post").length;
  const portalVacanciesCount = jobs.filter((j) => j.source === "Portal Vacancy").length;
  const totalOpenings = jobs.reduce((sum, j) => sum + (j.vacancyCount || 1), 0);

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    setIsDeletingJob(true);
    try {
      if (jobToDelete.source === "App Post") {
        const deleteJobPost = httpsCallable<{ jobId: string }, { success: boolean }>(
          functions,
          "deleteJobPost"
        );
        await deleteJobPost({ jobId: jobToDelete.id });
      } else {
        await api.delete(`/hospitals/${encodeURIComponent(jobToDelete.id)}/vacancy`);
      }

      setJobs((currentJobs) => currentJobs.filter((job) =>
        job.id !== jobToDelete.id || job.source !== jobToDelete.source
      ));
      if (selectedJob?.id === jobToDelete.id && selectedJob.source === jobToDelete.source) {
        setSelectedJob(null);
      }
      toast.success(jobToDelete.source === "App Post"
        ? "Job post and its applications were deleted."
        : "Hospital vacancy was removed. The hospital profile was kept.");
      setJobToDelete(null);
    } catch (error) {
      console.error("Failed to delete job or vacancy:", error);
      toast.error(jobToDelete.source === "App Post"
        ? "Could not delete the job post. Check Firebase admin access and try again."
        : "Could not remove the vacancy. Check your hospital access and try again.");
    } finally {
      setIsDeletingJob(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Openings</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{loading ? "-" : totalOpenings}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">App Posted Jobs</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{loading ? "-" : appJobsCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Portal Vacancies</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{loading ? "-" : portalVacanciesCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Hospitals</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{loading ? "-" : jobs.length}</p>
          </div>
          <button
            type="button"
            onClick={fetchAllJobs}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors disabled:opacity-50"
            title="Refresh jobs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search job title, hospital name, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm bg-slate-50 border-slate-200 rounded-lg focus:bg-white"
          />
        </div>

        {specialities.length > 0 && (
          <select
            value={specialityFilter}
            onChange={(e) => setSpecialityFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Specialities</option>
            {specialities.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}

        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setSourceFilter("all")}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
              sourceFilter === "all" ? "bg-white text-emerald-800 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter("App Post")}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
              sourceFilter === "App Post" ? "bg-white text-emerald-800 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            App Jobs
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter("Portal Vacancy")}
            className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
              sourceFilter === "Portal Vacancy" ? "bg-white text-emerald-800 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Vacancies
          </button>
        </div>

        <div aria-label="Filter jobs by status" className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
          {["all", "active", "closed", "draft"].map((status) => (
            <button
              key={status}
              type="button"
              aria-pressed={statusFilter === status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-2.5 py-1 font-medium capitalize transition-colors ${
                statusFilter === status
                  ? "bg-white font-semibold text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {status === "all" ? "All Statuses" : status}
            </button>
          ))}
        </div>

        {(search || specialityFilter || sourceFilter !== "all" || statusFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSpecialityFilter("");
              setSourceFilter("all");
              setStatusFilter("all");
            }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-500 hover:bg-slate-50"
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Briefcase className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-700">No hospital jobs found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {jobs.length === 0
              ? "Jobs posted by hospitals in the DrStethos app or vacancies configured in the portal will appear here."
              : "No jobs match your current search and filters. Try adjusting them."}
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <div
              key={`${job.source}-${job.id}`}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all"
            >
              <div>
                {/* Header row: badge and source */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    job.source === "App Post"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}>
                    {job.source}
                  </span>
                  {typeof job.vacancyCount === "number" ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {job.vacancyCount} {job.vacancyCount === 1 ? "vacancy" : "vacancies"}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      {job.status}
                    </span>
                  )}
                </div>

                {/* Job Title */}
                <h3 className="text-[14px] font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-1">
                  {job.jobTitle}
                </h3>

                {/* Hospital Name */}
                <p className="text-[12px] font-medium text-emerald-700 mt-0.5 flex items-center gap-1.5 truncate">
                  <Building2 className="h-3 w-3 flex-shrink-0" />
                  {job.hospitalName}
                </p>

                {/* Specs */}
                <div className="mt-3 space-y-1.5 text-[11.5px] text-slate-500">
                  {job.speciality && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Tag className="h-3 w-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{job.speciality}</span>
                    </div>
                  )}
                  {job.location && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  )}
                  {(job.salaryMin || job.salaryMax) && (
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                      <IndianRupee className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                      <span>
                        {job.salaryMin ? `₹${job.salaryMin.toLocaleString()}` : ""}
                        {job.salaryMin && job.salaryMax ? " - " : ""}
                        {job.salaryMax ? `₹${job.salaryMax.toLocaleString()}` : ""}
                      </span>
                    </div>
                  )}
                  {job.experienceRequired && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="h-3 w-3 text-slate-400 flex-shrink-0" />
                      <span>Exp: {job.experienceRequired}</span>
                    </div>
                  )}
                </div>

                {/* Metrics for App Posts */}
                {job.source === "App Post" && (
                  <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-2 text-[10.5px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-slate-400" />
                      {job.viewedCount || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users2 className="h-3 w-3 text-emerald-600" />
                      <strong className="text-slate-700">{job.appliedCount || 0}</strong> applicants
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "Active"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setJobToDelete(job)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    aria-label={job.source === "App Post" ? `Delete ${job.jobTitle}` : `Remove vacancy at ${job.hospitalName}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => void openJobDetails(job)}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors"
                  >
                    {job.source === "App Post" ? "Applicants & details" : "View Details"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!jobToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeletingJob) setJobToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {jobToDelete?.source === "App Post" ? "Delete this job post?" : "Remove this hospital vacancy?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {jobToDelete?.source === "App Post"
                ? `This permanently deletes "${jobToDelete.jobTitle}" and its application records. This cannot be undone.`
                : `This removes the vacancy listing for ${jobToDelete?.hospitalName}, but keeps the hospital profile and its other details.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingJob}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void confirmDeleteJob();
              }}
              disabled={isDeletingJob}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeletingJob ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Confirm delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal / Dialog for Job Details */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                {selectedJob.source}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedJob.jobTitle}</h2>
              <p className="text-sm font-medium text-emerald-700 flex items-center gap-1.5 mt-0.5">
                <Building2 className="h-4 w-4" />
                {selectedJob.hospitalName}
              </p>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="font-semibold text-slate-800">{selectedJob.location || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Speciality</span>
                <span className="font-semibold text-slate-800">{selectedJob.speciality || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Job Type</span>
                <span className="font-semibold text-slate-800">{selectedJob.jobType || "Full-time"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Experience</span>
                <span className="font-semibold text-slate-800">{selectedJob.experienceRequired || "N/A"}</span>
              </div>
            </div>

            {/* Description */}
            {selectedJob.description && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {selectedJob.description}
                </p>
              </div>
            )}

            {/* Requirements */}
            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">Requirements</h4>
                <ul className="space-y-1">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {selectedJob.benefits && selectedJob.benefits.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">Benefits</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.benefits.map((b, i) => (
                    <span key={i} className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedJob.source === "App Post" && (
              <section className="space-y-3 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Applicants</h3>
                    <p className="text-xs text-slate-500">
                      {applicantsLoading
                        ? "Loading applicants…"
                        : `${applicants.length} applicant${applicants.length === 1 ? "" : "s"}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void openJobDetails(selectedJob)}
                    disabled={applicantsLoading}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Refresh applicants
                  </button>
                </div>

                {applicantsError && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {applicantsError}
                  </p>
                )}
                {!applicantsLoading && !applicantsError && applicants.length === 0 && (
                  <p className="rounded-lg bg-slate-50 p-4 text-center text-xs text-slate-500">
                    No applications have been submitted for this job.
                  </p>
                )}
                {applicants.length > 0 && (
                  <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                    {applicants.map((applicant) => (
                      <article key={applicant.id} className="rounded-xl border border-slate-200 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <h4 className="text-sm font-semibold text-slate-900">{applicant.doctorName}</h4>
                              <button
                                type="button"
                                disabled={!applicant.doctorId}
                                onClick={() => {
                                  if (!applicant.doctorId) return;
                                  setSelectedJob(null);
                                  navigate(`/admin/doctor/${encodeURIComponent(applicant.doctorId)}`);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label={`View ${applicant.doctorName}'s profile`}
                              >
                                <Eye className="h-3 w-3" />
                                View profile
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            </div>
                            {(applicant.specialization || applicant.experience !== undefined) && (
                              <p className="mt-1 text-[11px] text-slate-500">
                                {[applicant.specialization, applicant.experience !== undefined ? `${applicant.experience} years experience` : ""]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            )}
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
                            Applied {applicant.appliedAt ? formatDateTime(applicant.appliedAt) : "date unavailable"}
                          </span>
                        </div>
                        <div className="mt-3 grid gap-2 border-t border-slate-100 pt-2 sm:grid-cols-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Application status</p>
                            <p className="mt-0.5 text-xs font-medium text-slate-700">
                              {formatApplicationStatus(applicant.status)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Interview</p>
                            <p className="mt-0.5 text-xs font-medium text-slate-700">{formatDateTime(applicant.interviewAt)}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Contact / Hospital Link */}
            {selectedJob.hospitalId && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">ID: {selectedJob.id}</span>
                <button
                  type="button"
                  onClick={() => {
                    const profilePath = selectedJob.source === "App Post"
                      ? `/admin/hospital/${selectedJob.hospitalId}`
                      : `/admin/hospitals/${selectedJob.hospitalId}/edit`;
                    setSelectedJob(null);
                    navigate(profilePath);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  Hospital Profile
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalJobsPage;
