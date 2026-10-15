import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { Building2, ArrowLeft, Loader2, Save, MapPin, Phone, Hospital, Mail } from "lucide-react";
import { HospitalOptionInput } from "@/components/hospital/HospitalOptionInput";

interface HospitalFieldOptions {
  hospitalTypes: string[];
  specialities: string[];
}

export const AddHospitalPage = () => {
  const navigate = useNavigate();
  const { hospitalId } = useParams();
  const isEditing = Boolean(hospitalId);
  const [name, setName] = useState("");
  const [hospitalType, setHospitalType] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [loadFailed, setLoadFailed] = useState(false);
  const [optionsLoadMessage, setOptionsLoadMessage] = useState("");
  const [fieldOptions, setFieldOptions] = useState<HospitalFieldOptions>({ hospitalTypes: [], specialities: [] });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const optionsResponse = await api.get<HospitalFieldOptions>("/hospital-options");
        setFieldOptions(optionsResponse.data);
      } catch (error) {
        console.error("Failed to load hospital field options:", error);
        const status = isAxiosError(error) ? error.response?.status : undefined;
        setOptionsLoadMessage(
          status === 404
            ? "Hospital dropdown options are not available from the backend yet. Restart the backend to load admin-managed choices; you can enter values manually meanwhile."
            : "Saved dropdown choices could not be loaded. You can enter values manually meanwhile.",
        );
      }

      if (hospitalId) {
        try {
          const hospitalResponse = await api.get(`/hospitals/${hospitalId}`);
          const hospital = hospitalResponse.data;
          setName(hospital.name ?? "");
          setHospitalType(hospital.hospitalType ?? "");
          setSpeciality(hospital.speciality ?? "");
          setLocation(hospital.location ?? "");
          setContactNumber(hospital.contactNumber ?? "");
          setEmail(hospital.email ?? "");
          setSource(hospital.source ?? "");
          setVacancy(hospital.vacancy == null ? "" : String(hospital.vacancy));
        } catch (error) {
          console.error("Failed to load hospital details for editing:", error);
          setLoadFailed(true);
          toast.error("Could not load hospital details for editing.");
        }
      }
      setIsLoading(false);
    };
    loadFormData();
  }, [hospitalId, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Hospital facility name is required.");
      return;
    }
    const vacancyNumber = vacancy === "" ? undefined : Number(vacancy);
    if (vacancyNumber !== undefined && (!Number.isInteger(vacancyNumber) || vacancyNumber < 0)) {
      toast.error("Vacancy must be a non-negative whole number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const hospitalData = {
        name: name.trim(),
        hospitalType: hospitalType.trim() || null,
        speciality: speciality.trim() || null,
        location: location.trim() || null,
        contactNumber: contactNumber.trim() || null,
        email: email.trim() || null,
        source: source.trim() || null,
        vacancy: vacancyNumber ?? null,
      };
      if (hospitalId) {
        await api.put(`/hospitals/${hospitalId}`, hospitalData);
      } else {
        await api.post("/hospitals", hospitalData);
      }
      toast.success(isEditing ? `Hospital "${name}" updated successfully!` : `Facility "${name}" created successfully!`);
      navigate("/admin/hospitals?scope=mine");
    } catch (error: unknown) {
      console.error("Error creating hospital:", error);
      const message = isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      toast.error(message || `Failed to ${isEditing ? "update" : "create"} hospital facility.`);
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
            to="/admin/hospitals"
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              {isEditing ? "Edit Hospital" : "Register New Hospital"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? "Update hospital contact and facility details" : "Add an operational hospital facility to the Doctor Stethos network"}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-10 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
          Loading hospital details…
        </div>
      ) : loadFailed ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-slate-700">Hospital details are unavailable.</p>
          <p className="mt-1 text-xs text-slate-500">No changes were made.</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => navigate("/admin/hospitals")}>
            Back to hospitals
          </Button>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        {optionsLoadMessage && (
          <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
            {optionsLoadMessage}
          </p>
        )}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
              Hospital Facility Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Hospital className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="name"
                required
                placeholder="e.g. Apollo Hospitals Jubilee Hills"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-10 text-sm bg-slate-50/50 border-slate-200 focus:bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400">The primary legal or operational title of the hospital.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HospitalOptionInput
              id="hospitalType"
              label="Hospital Type"
              value={hospitalType}
              options={fieldOptions.hospitalTypes}
              placeholder="Type a hospital type"
              onChange={setHospitalType}
            />
            <HospitalOptionInput
              id="speciality"
              label="Hospital Speciality"
              value={speciality}
              options={fieldOptions.specialities}
              placeholder="Type a speciality"
              onChange={setSpeciality}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs font-semibold text-slate-700">
              Address
            </Label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="location"
                placeholder="e.g. Road No 72, Film Nagar, Jubilee Hills, Hyderabad, Telangana 500033"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-10 text-sm bg-slate-50/50 border-slate-200 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contactNumber" className="text-xs font-semibold text-slate-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="contactNumber"
                  placeholder="e.g. +91 40 2360 7777"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="pl-10 h-10 text-sm bg-slate-50/50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email ID</Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. contact@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 text-sm bg-slate-50/50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="source" className="text-xs font-semibold text-slate-700">Source / Website</Label>
              <Input
                id="source"
                placeholder="e.g. www.hospital.com or Referral"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="h-10 bg-slate-50/50 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vacancy" className="text-xs font-semibold text-slate-700">Vacancy</Label>
              <Input
                id="vacancy"
                type="number"
                min="0"
                step="1"
                placeholder="Number of vacancies"
                value={vacancy}
                onChange={(e) => setVacancy(e.target.value)}
                className="h-10 bg-slate-50/50 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/hospitals")}
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
                Registering Facility...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                {isEditing ? "Save Hospital Changes" : "Save & Register Hospital"}
              </>
            )}
          </Button>
        </div>
      </form>
      )}
    </div>
  );
};

export default AddHospitalPage;
