import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileSectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function ProfileSection({ title, icon: Icon, children, className }: ProfileSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          {Icon ? <Icon className="h-4 w-4 text-blue-600" /> : null}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface InfoItemProps {
  label: string;
  value?: React.ReactNode;
  className?: string;
}

export function InfoItem({ label, value, className }: InfoItemProps) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}

export function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

interface DocumentLinkProps {
  label: string;
  href: string;
  meta?: string;
}

export function DocumentLink({ label, href, meta }: DocumentLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-800">{label}</p>
        {meta ? <p className="truncate text-xs text-slate-500">{meta}</p> : null}
      </div>
      <span className="shrink-0 text-xs font-semibold text-blue-600">Open</span>
    </a>
  );
}
