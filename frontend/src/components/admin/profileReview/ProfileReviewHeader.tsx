import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileReviewHeaderProps {
  name: string;
  subtitle: string;
  isVerified: boolean;
  photoUrl?: string;
  onBack: () => void;
  fallbackInitial?: string;
}

export function ProfileReviewHeader({
  name,
  subtitle,
  isVerified,
  photoUrl,
  onBack,
  fallbackInitial,
}: ProfileReviewHeaderProps) {
  const initial = (fallbackInitial || name).charAt(0).toUpperCase();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="-ml-2 h-9 px-2 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to verifications
      </Button>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-4">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-semibold text-blue-700">
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">{name}</h1>
            <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <Badge
          className={cn(
            "w-fit shrink-0 border px-3 py-1 text-xs font-medium",
            isVerified
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-orange-200 bg-orange-50 text-orange-700"
          )}
        >
          {isVerified ? "Verified" : "Pending review"}
        </Badge>
      </div>
    </div>
  );
}
