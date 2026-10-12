import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HospitalOptionInputProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}

export const HospitalOptionInput = ({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: HospitalOptionInputProps) => {
  const [customMode, setCustomMode] = useState(false);
  const valueIsOption = options.includes(value);
  const isCustom = options.length === 0 || customMode || (Boolean(value) && !valueIsOption);
  const selectValue = isCustom ? "__custom__" : value;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-slate-700">{label}</Label>
      {options.length > 0 ? (
        <select
          id={id}
          value={selectValue}
          onChange={(event) => {
            if (event.target.value === "__custom__") {
              setCustomMode(true);
              onChange("");
            } else {
              setCustomMode(false);
              onChange(event.target.value);
            }
          }}
          className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/30"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
          <option value="__custom__">Other — enter manually</option>
        </select>
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 bg-white text-sm"
        />
      )}
      {options.length > 0 && isCustom && (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 bg-white text-sm"
          aria-label={`Custom ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
};
