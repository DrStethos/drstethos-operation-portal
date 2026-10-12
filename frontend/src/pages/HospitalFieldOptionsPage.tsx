import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Tags } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

interface HospitalOptions {
  hospitalTypes: string[];
  specialities: string[];
}

const fields = [
  { key: "hospitalTypes", title: "Hospital types", description: "Examples: General, Multi-speciality, Clinic" },
  { key: "specialities", title: "Hospital specialities", description: "Examples: Cardiology, Oncology, Neurology" },
] as const;

type OptionField = typeof fields[number]["key"];

const HospitalFieldOptionsPage = () => {
  const [options, setOptions] = useState<HospitalOptions>({ hospitalTypes: [], specialities: [] });
  const [values, setValues] = useState<Record<OptionField, string>>({ hospitalTypes: "", specialities: "" });
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<OptionField | null>(null);

  const loadOptions = async () => {
    try {
      const response = await api.get<HospitalOptions>("/hospital-options");
      setOptions(response.data);
    } catch (error) {
      console.error("Failed to load hospital field options:", error);
      toast.error("Could not load hospital field options.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const addOption = async (field: OptionField, event: FormEvent) => {
    event.preventDefault();
    const value = values[field].trim();
    if (!value) {
      toast.error("Enter an option before adding it.");
      return;
    }
    setSavingField(field);
    try {
      const response = await api.post<HospitalOptions>("/hospital-options", { field, value });
      setOptions(response.data);
      setValues((current) => ({ ...current, [field]: "" }));
      toast.success("Hospital field option added.");
    } catch (error) {
      console.error("Failed to add hospital field option:", error);
      toast.error("Could not add this option.");
    } finally {
      setSavingField(null);
    }
  };

  const removeOption = async (field: OptionField, value: string) => {
    try {
      const response = await api.delete<HospitalOptions>("/hospital-options", { data: { field, value } });
      setOptions(response.data);
      toast.success("Hospital field option removed.");
    } catch (error) {
      console.error("Failed to remove hospital field option:", error);
      toast.error("Could not remove this option.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <Link
          to="/admin/hospitals"
          aria-label="Back to hospitals"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <Tags className="h-5 w-5 text-emerald-700" />
            Hospital Field Options
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage dropdown choices shown in the hospital form. Managers can still enter custom values.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading hospital field options…
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {fields.map(({ key, title, description }) => (
            <section key={key} className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-xs text-slate-500">{description}</p>
              </div>
              <form onSubmit={(event) => addOption(key, event)} className="space-y-2">
                <Label htmlFor={`option-${key}`} className="text-xs font-medium text-slate-700">Add an option</Label>
                <div className="flex gap-2">
                  <Input
                    id={`option-${key}`}
                    value={values[key]}
                    maxLength={100}
                    onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder={`Add ${key === "hospitalTypes" ? "a hospital type" : "a speciality"}`}
                    className="h-10"
                  />
                  <Button type="submit" disabled={savingField === key} className="h-10 shrink-0 bg-emerald-700 hover:bg-emerald-800">
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </form>
              <div className="space-y-2">
                {options[key].length ? options[key].map((value) => (
                  <div key={value} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
                    <span className="min-w-0 truncate text-sm text-slate-700">{value}</span>
                    <button
                      type="button"
                      onClick={() => removeOption(key, value)}
                      className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${value}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )) : (
                  <p className="rounded-lg border border-dashed border-slate-200 px-3 py-5 text-center text-xs text-slate-400">
                    No options added yet.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalFieldOptionsPage;
