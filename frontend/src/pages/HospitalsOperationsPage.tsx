import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2, Plus, Upload, Search, Phone, MapPin, Mail, BriefcaseBusiness,
  Trash2, RefreshCw, Loader2, Hospital, Pencil, Filter, MessageSquare, PhoneCall,
  MoreHorizontal
} from "lucide-react";

interface HospitalItem {
  id: string;
  _id?: string;
  serialNumber?: string;
  name: string;
  hospitalType?: string;
  speciality?: string;
  location?: string;
  contactNumber?: string;
  email?: string;
  source?: string;
  vacancy?: number | null;
  contactStatus?: "Connected" | "Not Connected" | null;
  outreachVacancies?: number | null;
  outreachNotes?: string | null;
  hospitalCommitments?: string | null;
  createdById?: string;
  createdByName?: string;
  createdByEmail?: string;
  createdByRole?: string;
  createdAt?: string;
}

const isSuperAdminRole = (role?: string) => ["SUPER_ADMIN", "super_admin"].includes(role ?? "");
const isCreatedByUser = (hospital: HospitalItem, user?: { id?: string; email?: string } | null) =>
  Boolean(
    (user?.id && hospital.createdById === user.id) ||
    (user?.email && hospital.createdByEmail?.toLowerCase() === user.email.toLowerCase())
  );
const creatorLabel = (hospital: HospitalItem) =>
  hospital.createdByEmail || "support@drstethos.com";
const hospitalVacancy = (hospital: HospitalItem) => hospital.vacancy ?? hospital.outreachVacancies ?? null;
const outreachComment = (hospital: HospitalItem) =>
  [hospital.outreachNotes, hospital.hospitalCommitments]
    .filter((comment): comment is string => Boolean(comment?.trim()))
    .join("\n\n");
const uniqueValues = (values: Array<string | undefined>) =>
  Array.from(new Set(values.filter((value): value is string => Boolean(value?.trim())))).sort((a, b) =>
    a.localeCompare(b)
  );
const apiErrorMessage = (error: unknown, fallback: string) =>
  isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || fallback : fallback;

export const HospitalsOperationsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isSuperAdmin = isSuperAdminRole(user?.role);
  const [hospitals, setHospitals] = useState<HospitalItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [isDeleteSelectionMode, setIsDeleteSelectionMode] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const listScope = new URLSearchParams(location.search).get("scope") === "mine" ? "mine" : "all";
  const [typeFilter, setTypeFilter] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("");
  const [outreachHospital, setOutreachHospital] = useState<HospitalItem | null>(null);
  const [contactStatus, setContactStatus] = useState<"Connected" | "Not Connected">("Not Connected");
  const [vacancy, setVacancy] = useState("");
  const [outreachNotes, setOutreachNotes] = useState("");
  const [isSavingOutreach, setIsSavingOutreach] = useState(false);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hospitals");
      setHospitals(res.data);
    } catch (error: unknown) {
      console.error("Failed to fetch hospitals:", error);
      toast.error(apiErrorMessage(error, "Failed to load hospitals."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    setSelectedIds(new Set());
    setIsDeleteSelectionMode(false);
  }, [listScope]);

  const handleDeleteHospital = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove hospital facility "${name}"?`)) return;

    try {
      await api.delete(`/hospitals/${id}`);
      toast.success("Hospital facility deleted successfully.");
      setHospitals((prev) => prev.filter((h) => (h.id || h._id) !== id));
    } catch (error: unknown) {
      console.error("Failed to delete hospital:", error);
      toast.error(apiErrorMessage(error, "Failed to delete hospital."));
    }
  };

  const toggleHospitalSelection = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const canDeleteHospital = (hospital: HospitalItem) => {
    return isSuperAdmin || isCreatedByUser(hospital, user);
  };
  const canBulkDeleteHospitals = isSuperAdmin || listScope === "mine";
  const canSelectHospitals = canBulkDeleteHospitals && isDeleteSelectionMode;

  const scopedHospitals = hospitals.filter((hospital) =>
    listScope === "all" || isCreatedByUser(hospital, user)
  );
  const hospitalTypes = uniqueValues(hospitals.map((hospital) => hospital.hospitalType));
  const specialities = uniqueValues(hospitals.map((hospital) => hospital.speciality));
  const sources = uniqueValues(hospitals.map((hospital) => hospital.source));
  const creators = Array.from(
    new Map(hospitals.map((hospital) => [
      hospital.createdById || `unrecorded:${creatorLabel(hospital)}`,
      {
        id: hospital.createdById || `unrecorded:${creatorLabel(hospital)}`,
        label: creatorLabel(hospital),
      },
    ])).values()
  ).sort((a, b) => a.label.localeCompare(b.label));
  const filteredHospitals = scopedHospitals.filter((h) => {
    const q = search.trim().toLowerCase();
    return (
      (!q ||
        h.name?.toLowerCase().includes(q) ||
        h.hospitalType?.toLowerCase().includes(q) ||
        h.speciality?.toLowerCase().includes(q) ||
        h.location?.toLowerCase().includes(q) ||
        h.contactNumber?.toLowerCase().includes(q) ||
        h.email?.toLowerCase().includes(q) ||
        h.source?.toLowerCase().includes(q) ||
        h.serialNumber?.toLowerCase().includes(q) ||
        h.contactStatus?.toLowerCase().includes(q) ||
        h.outreachNotes?.toLowerCase().includes(q) ||
        outreachComment(h).toLowerCase().includes(q) ||
        creatorLabel(h).toLowerCase().includes(q) ||
        String(hospitalVacancy(h) ?? "").includes(q)) &&
      (!typeFilter || h.hospitalType === typeFilter) &&
      (!specialityFilter || h.speciality === specialityFilter) &&
      (!sourceFilter || h.source === sourceFilter) &&
      (!contactStatusFilter || (h.contactStatus ?? "Not Connected") === contactStatusFilter) &&
      (!isSuperAdmin || !creatorFilter || (h.createdById || `unrecorded:${creatorLabel(h)}`) === creatorFilter)
    );
  });
  const deletableFilteredHospitals = filteredHospitals.filter(canDeleteHospital);
  const selectedDeletableIds = canBulkDeleteHospitals && isDeleteSelectionMode
    ? Array.from(selectedIds).filter((id) =>
        filteredHospitals.some((hospital) => (hospital.id || hospital._id) === id && canDeleteHospital(hospital))
      )
    : [];
  const allFilteredSelected = deletableFilteredHospitals.length > 0 &&
    deletableFilteredHospitals.every((hospital) => selectedIds.has(hospital.id || hospital._id || ""));

  const toggleFilteredSelection = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      deletableFilteredHospitals.forEach((hospital) => {
        const id = hospital.id || hospital._id;
        if (!id) return;
        if (checked) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedDeletableIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const response = await api.delete("/hospitals/bulk", { data: { ids: selectedDeletableIds } });
      const deletedIds = new Set(selectedDeletableIds);
      setHospitals((current) => current.filter((hospital) => !deletedIds.has(hospital.id || hospital._id || "")));
      setSelectedIds(new Set());
      setIsDeleteSelectionMode(false);
      setBulkDeleteOpen(false);
      toast.success(`${response.data.deletedCount} hospital${response.data.deletedCount === 1 ? "" : "s"} deleted.`);
    } catch (error: unknown) {
      console.error("Failed to delete selected hospitals:", error);
      toast.error(apiErrorMessage(error, "Failed to delete selected hospitals."));
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const openOutreachDialog = (hospital: HospitalItem) => {
    setOutreachHospital(hospital);
    setContactStatus(hospital.contactStatus ?? "Not Connected");
    const currentVacancy = hospitalVacancy(hospital);
    setVacancy(currentVacancy == null ? "" : String(currentVacancy));
    setOutreachNotes(outreachComment(hospital));
  };

  const saveOutreach = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!outreachHospital) return;
    const vacancyCount = vacancy.trim() === "" ? null : Number(vacancy);
    if (vacancyCount !== null && (!Number.isInteger(vacancyCount) || vacancyCount < 0)) {
      toast.error("Vacancy must be a non-negative whole number.");
      return;
    }

    setIsSavingOutreach(true);
    try {
      const response = await api.patch(`/hospitals/${outreachHospital.id || outreachHospital._id}/outreach`, {
        contactStatus,
        vacancy: contactStatus === "Connected" ? vacancyCount : null,
        outreachNotes: outreachNotes.trim() || null,
      });
      setHospitals((current) => current.map((hospital) =>
        (hospital.id || hospital._id) === (outreachHospital.id || outreachHospital._id)
          ? { ...hospital, ...response.data }
          : hospital
      ));
      setOutreachHospital(null);
      toast.success("Hospital outreach details saved.");
    } catch (error: unknown) {
      console.error("Failed to save hospital outreach details:", error);
      toast.error(apiErrorMessage(error, "Failed to save hospital outreach details."));
    } finally {
      setIsSavingOutreach(false);
    }
  };

  const vacancyTotal = scopedHospitals.reduce((total, hospital) => total + (hospitalVacancy(hospital) ?? 0), 0);
  const categorizedCount = scopedHospitals.filter((hospital) => hospital.hospitalType && hospital.speciality).length;
  const contactedCount = scopedHospitals.filter((hospital) => hospital.contactStatus).length;
  const connectedCount = scopedHospitals.filter((hospital) => hospital.contactStatus === "Connected").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Hospitals Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSuperAdmin
              ? "Shared hospital directory with creator and facility filters"
              : "Browse all hospitals or focus on records you added"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/imports">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 gap-1.5 border-slate-200"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              Bulk Import (Excel)
            </Button>
          </Link>

          <Link to="/admin/hospitals/new">
            <Button
              size="sm"
              className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Hospital
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-slate-500">{listScope === "mine" ? "Hospitals added by you" : "Hospitals in directory"}</p>
            <p className="mt-0.5 text-xl font-semibold text-slate-900">{loading ? "—" : scopedHospitals.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-slate-500">{listScope === "mine" ? "Your listed vacancies" : "Listed vacancies"}</p>
            <p className="mt-0.5 text-xl font-semibold text-slate-900">{loading ? "—" : vacancyTotal}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Hospital className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-slate-500">Type and speciality added</p>
            <p className="mt-0.5 text-xl font-semibold text-slate-900">
              {loading ? "—" : `${categorizedCount} / ${scopedHospitals.length}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <PhoneCall className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-slate-500">Hospitals contacted</p>
            <p className="mt-0.5 text-xl font-semibold text-slate-900">{loading ? "—" : `${contactedCount} / ${scopedHospitals.length}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-slate-500">Connected</p>
            <p className="mt-0.5 text-xl font-semibold text-slate-900">{loading ? "—" : connectedCount}</p>
          </div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-[240px] flex-1 lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search name, contact, source, or added by..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 bg-slate-50/50 pl-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filters</span>
            </div>
            <select
              aria-label="Filter by hospital type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-10 min-w-[145px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              <option value="">All types</option>
              {hospitalTypes.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <select
              aria-label="Filter by speciality"
              value={specialityFilter}
              onChange={(event) => setSpecialityFilter(event.target.value)}
              className="h-10 min-w-[150px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              <option value="">All specialities</option>
              {specialities.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <select
              aria-label="Filter by source"
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="h-10 min-w-[130px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              <option value="">All sources</option>
              {sources.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <select
              aria-label="Filter by contact status"
              value={contactStatusFilter}
              onChange={(event) => setContactStatusFilter(event.target.value)}
              className="h-10 min-w-[150px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700"
            >
              <option value="">All contact statuses</option>
              <option value="Connected">Connected</option>
              <option value="Not Connected">Not Connected</option>
            </select>
            {isSuperAdmin && (
              <select
                aria-label="Filter by creator"
                value={creatorFilter}
                onChange={(event) => setCreatorFilter(event.target.value)}
                className="h-10 min-w-[160px] rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700"
              >
                <option value="">All added by</option>
                {creators.map((creator) => <option key={creator.id} value={creator.id}>{creator.label}</option>)}
              </select>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          {canBulkDeleteHospitals && (
            <Button
              variant={isDeleteSelectionMode ? "ghost" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedIds(new Set());
                setIsDeleteSelectionMode((current) => !current);
              }}
              className="h-9 border-slate-200 text-xs"
            >
              {isDeleteSelectionMode ? "Cancel selection" : "Select to delete"}
            </Button>
          )}
          {canSelectHospitals && deletableFilteredHospitals.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFilteredSelection(!allFilteredSelected)}
              className="h-9 border-slate-200 text-xs"
            >
              {allFilteredSelected ? "Deselect visible" : "Select visible"}
            </Button>
          )}
          {canSelectHospitals && (
            <>
              {selectedDeletableIds.length > 0 && (
                <span className="text-xs text-slate-500">{selectedDeletableIds.length} selected</span>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteOpen(true)}
                disabled={selectedDeletableIds.length === 0}
                className="h-9 gap-1.5 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete selected
              </Button>
              {selectedDeletableIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                  className="h-9 text-xs"
                >
                  Clear
                </Button>
              )}
            </>
          )}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Card View
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchHospitals}
            className="h-9 px-3 border-slate-200 text-slate-600"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-xs">Loading hospital facilities...</p>
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="py-16 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 p-8">
          <Hospital className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Hospitals Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {listScope === "mine" && scopedHospitals.length === 0
              ? "You have not added any hospitals yet. Hospitals added by other admins and managers are available in All List."
              : search || typeFilter || specialityFilter || sourceFilter || creatorFilter || contactStatusFilter
                ? "No facilities match the selected search and filters."
                : "Get started by registering a new facility or uploading a bulk Excel spreadsheet."}
          </p>
          {!search && !typeFilter && !specialityFilter && !sourceFilter && !creatorFilter && !contactStatusFilter && listScope === "all" && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <Link to="/admin/hospitals/new">
                <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Add First Hospital
                </Button>
              </Link>
              <Link to="/admin/imports">
                <Button size="sm" variant="outline" className="text-xs border-slate-200 gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Bulk Import
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full ${isSuperAdmin ? "min-w-[1968px]" : "min-w-[1828px]"} table-fixed text-left text-xs`}>
              <colgroup>
                {canSelectHospitals && <col className="w-12" />}
                <col className="w-[220px]" />
                <col className="w-[150px]" />
                <col className="w-[135px]" />
                <col className="w-[145px]" />
                <col className="w-[190px]" />
                <col className="w-[200px]" />
                <col className="w-[125px]" />
                <col className="w-[85px]" />
                <col className="w-[130px]" />
                <col className="w-[160px]" />
                {isSuperAdmin && <col className="w-[280px]" />}
                <col className="w-[100px]" />
              </colgroup>
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  {canSelectHospitals && (
                    <th className="w-12 px-3 py-3.5">
                      <Checkbox
                        aria-label="Select all deletable visible hospitals"
                        checked={allFilteredSelected}
                        onCheckedChange={(checked) => toggleFilteredSelection(checked === true)}
                      />
                    </th>
                  )}
                  <th className="px-5 py-3.5">Hospital Name</th>
                  <th className="px-5 py-3.5">Hospital Type</th>
                  <th className="px-5 py-3.5">Speciality</th>
                  <th className="px-5 py-3.5">Phone Number</th>
                  <th className="px-5 py-3.5">Email ID</th>
                  <th className="px-5 py-3.5">Address</th>
                  <th className="px-5 py-3.5">Source</th>
                  <th className="px-5 py-3.5">Vacancy</th>
                  <th className="px-5 py-3.5">Contact Status</th>
                  <th className="px-5 py-3.5">Comments</th>
                  {isSuperAdmin && <th className="px-3 py-3.5">Added By</th>}
                  <th className="px-3 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredHospitals.map((h) => {
                  const hid = h.id || h._id || "";
                  return (
                    <tr key={hid} className="hover:bg-slate-50/60 transition-colors">
                      {canSelectHospitals && (
                        <td className="px-3 py-3.5">
                          <Checkbox
                            aria-label={`Select ${h.name}`}
                            checked={selectedIds.has(hid)}
                            disabled={!canDeleteHospital(h)}
                            onCheckedChange={(checked) => toggleHospitalSelection(hid, checked === true)}
                          />
                        </td>
                      )}
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        <div className="flex min-w-[180px] max-w-[250px] items-center gap-2.5">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <span className="whitespace-normal break-words leading-5">{h.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">{h.hospitalType || <span className="text-slate-300">N/A</span>}</td>
                      <td className="px-5 py-3.5">{h.speciality || <span className="text-slate-300">N/A</span>}</td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {h.contactNumber ? <span className="flex w-full min-w-0 items-start gap-1.5"><Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" /><span className="min-w-0 whitespace-normal break-all">{h.contactNumber}</span></span> : <span className="text-slate-300">N/A</span>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {h.email ? <span className="flex w-full min-w-0 items-start gap-1.5"><Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" /><span className="min-w-0 whitespace-normal break-all">{h.email}</span></span> : <span className="text-slate-300">N/A</span>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {h.location ? <span className="flex w-full min-w-0 items-start gap-1.5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" /><span className="min-w-0 whitespace-normal break-words">{h.location}</span></span> : <span className="text-slate-300">N/A</span>}
                      </td>
                      <td className="min-w-0 px-5 py-3.5"><span className="block whitespace-normal break-all">{h.source || <span className="text-slate-300">N/A</span>}</span></td>
                      <td className="whitespace-nowrap px-5 py-3.5">{hospitalVacancy(h) ?? <span className="text-slate-300">—</span>}</td>
                      <td className="px-5 py-3.5">
                        {h.contactStatus ? (
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            h.contactStatus === "Connected"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}>{h.contactStatus}</span>
                        ) : <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">Not Connected</span>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        <div className="max-w-[160px]">
                          {outreachComment(h)
                            ? <p className="whitespace-normal break-words" title={outreachComment(h)}>{outreachComment(h)}</p>
                            : <span className="text-slate-300">—</span>}
                        </div>
                      </td>
                      {isSuperAdmin && (
                        <td className="whitespace-nowrap px-3 py-3.5 text-slate-500">
                          <span title={creatorLabel(h)}>{creatorLabel(h)}</span>
                        </td>
                      )}
                      <td className="px-3 py-3.5 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="mx-auto h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
                              aria-label={`Actions for ${h.name}`}
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[190px]">
                            <DropdownMenuItem onSelect={() => openOutreachDialog(h)}>
                              <PhoneCall className="mr-2 h-4 w-4" />
                              {h.contactStatus ? "Update outreach" : "Record contact"}
                            </DropdownMenuItem>
                            {(isSuperAdmin || isCreatedByUser(h, user)) && (
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/hospitals/${hid}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit hospital
                                </Link>
                              </DropdownMenuItem>
                            )}
                            {canDeleteHospital(h) && (
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={() => handleDeleteHospital(hid, h.name)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete hospital
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredHospitals.map((hospital) => {
            const hid = hospital.id || hospital._id || "";
            return (
              <div
                key={hid}
                className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    {canSelectHospitals && (
                      <Checkbox
                        aria-label={`Select ${hospital.name}`}
                        checked={selectedIds.has(hid)}
                        disabled={!canDeleteHospital(hospital)}
                        onCheckedChange={(checked) => toggleHospitalSelection(hid, checked === true)}
                        className="mt-1 shrink-0"
                      />
                    )}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-semibold leading-5 text-slate-900 sm:text-base [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                        {hospital.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {hospital.hospitalType && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                            {hospital.hospitalType}
                          </span>
                        )}
                        {hospital.speciality && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                            {hospital.speciality}
                          </span>
                        )}
                        <AlertDialog open={bulkDeleteOpen} onOpenChange={(open) => !isBulkDeleting && setBulkDeleteOpen(open)}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete selected hospitals?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently deletes {selectedDeletableIds.length} selected hospital
                                {selectedDeletableIds.length === 1 ? "" : "s"} and removes their access assignments. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isBulkDeleting}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(event) => {
                                  event.preventDefault();
                                  void handleBulkDelete();
                                }}
                                disabled={isBulkDeleting || selectedDeletableIds.length === 0}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                {isBulkDeleting ? "Deleting..." : "Delete selected"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        size="sm"
                        className="h-8 gap-1.5 bg-emerald-600 px-2.5 text-[11px] text-white hover:bg-emerald-700"
                        onClick={() => openOutreachDialog(hospital)}
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        {hospital.contactStatus ? "Update contact" : "Record contact"}
                      </Button>
                      {(isSuperAdmin || isCreatedByUser(hospital, user)) && (
                        <Link
                          to={`/admin/hospitals/${hid}/edit`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700"
                          title="Edit hospital"
                          aria-label={`Edit ${hospital.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      )}
                      {canDeleteHospital(hospital) && (
                        <button
                          onClick={() => handleDeleteHospital(hid, hospital.name)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete Hospital"
                          aria-label={`Delete ${hospital.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Phone</p>
                        <p className="mt-0.5 break-words text-xs font-medium text-slate-700">{hospital.contactNumber || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex min-w-0 items-start gap-2.5">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Email</p>
                        <p className="mt-0.5 break-all text-xs font-medium text-slate-700">{hospital.email || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="flex min-w-0 items-start gap-2.5 sm:col-span-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Address</p>
                        <p className="mt-0.5 break-words text-xs font-medium text-slate-700">{hospital.location || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-xs sm:px-5">
                  <span className="text-slate-500">
                    <span className="font-medium text-slate-700">Contact:</span>{" "}
                    {hospital.contactStatus || "Not Connected"}
                  </span>
                  <span className="text-slate-500">
                    <span className="font-medium text-slate-700">Vacancy:</span> {hospitalVacancy(hospital) ?? "—"}
                  </span>
                  <span className="text-slate-500">
                    <span className="font-medium text-slate-700">Source:</span> {hospital.source || "—"}
                  </span>
                  {isSuperAdmin && (
                    <span className="ml-auto max-w-full truncate text-slate-500" title={creatorLabel(hospital)}>
                      Added by <span className="font-medium text-slate-700">{creatorLabel(hospital)}</span>
                    </span>
                  )}
                </div>
                {outreachComment(hospital) && (
                  <div className="space-y-2 border-t border-slate-100 px-4 py-3 text-xs sm:px-5">
                    <p className="whitespace-pre-wrap break-words text-slate-600">
                      <span className="font-medium text-slate-800">Comments:</span> {outreachComment(hospital)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <Dialog
        open={Boolean(outreachHospital)}
        onOpenChange={(open) => {
          if (!open && !isSavingOutreach) setOutreachHospital(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Hospital outreach</DialogTitle>
            <DialogDescription>
              Record contact status, vacancy, and comments for {outreachHospital?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveOutreach} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-status">Contact status</Label>
              <select
                id="contact-status"
                value={contactStatus}
                onChange={(event) => {
                  setContactStatus(event.target.value === "Connected" ? "Connected" : "Not Connected");
                }}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="Connected">Connected</option>
                <option value="Not Connected">Not Connected</option>
              </select>
            </div>
            {contactStatus === "Connected" && (
              <div className="space-y-2">
                <Label htmlFor="outreach-vacancy">Vacancy</Label>
                <Input
                  id="outreach-vacancy"
                  type="number"
                  min="0"
                  step="1"
                  value={vacancy}
                  onChange={(event) => setVacancy(event.target.value)}
                  placeholder="Enter vacancy count"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="outreach-notes">Comments / notes</Label>
              <Textarea
                id="outreach-notes"
                maxLength={5000}
                value={outreachNotes}
                onChange={(event) => setOutreachNotes(event.target.value)}
                placeholder="Add feedback, follow-up details, or commitments shared by the hospital"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSavingOutreach}>
                {isSavingOutreach ? "Saving..." : "Save outreach details"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalsOperationsPage;
