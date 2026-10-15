import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  FileSpreadsheet, Upload, ArrowLeft, Loader2, Download,
  CheckCircle2, AlertCircle, FileText
} from "lucide-react";

interface ImportResult {
  message?: string;
  jobId?: string;
}

export const BulkImportPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose a valid Excel spreadsheet (.xlsx, .xls)");
      return;
    }

    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post<ImportResult>("/imports/hospitals", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      toast.success(res.data.message || "Bulk hospital ingestion started successfully!");
      setFile(null);
    } catch (error: unknown) {
      console.error("Upload failed:", error);
      const message = isAxiosError<{ error?: string }>(error) ? error.response?.data?.error : undefined;
      toast.error(message || "Failed to process hospital import.");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to generate a quick CSV / template sample download
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "S.No,Hospital Name,Hospital Type,Hospital Speciality,Location / Full Address,Contact Number,Email Address,Source,Vacancy\n" +
      "1,Apollo Hospitals Jubilee Hills,Multi-speciality,Cardiology,Road No 72 Film Nagar Hyderabad,+91 40 2360 7777,contact@apollo.example,https://apollo.example,12\n" +
      "2,Care Hospitals Banjara Hills,Multi-speciality,Oncology,Road No 1 Banjara Hills Hyderabad,+91 40 6165 6565,contact@care.example,https://care.example,8\n" +
      "3,Yashoda Hospitals Somajiguda,Multi-speciality,Neurology,Raj Bhavan Rd Somajiguda Hyderabad,+91 40 4567 4567,contact@yashoda.example,https://yashoda.example,5\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "drstethos_hospitals_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sample template downloaded!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
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
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Bulk Hospital Ingestion
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload spreadsheets to add hospital facilities and assign operational access automatically.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
          className="text-xs h-9 gap-1.5 border-slate-200"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          Download Sample Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleUpload} className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Upload Spreadsheet</h3>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-700">
                  Select an Excel workbook (.xlsx, .xls)
                </p>
                <p className="text-[11px] text-slate-400 mt-1 mb-4">
                  Headers supported include S.No, Hospital Name, Hospital Type, Hospital Speciality, Location / Full Address, Contact Number, Email Address, Source (or Source Website), and Vacancy.
                </p>
                <div className="max-w-xs mx-auto">
                  <Input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    className="text-xs cursor-pointer bg-white"
                  />
                </div>
              </div>

              {file && (
                <div className="p-3 bg-emerald-50 border border-emerald-200/60 rounded-lg flex items-center gap-3 text-xs text-emerald-800">
                  <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium truncate flex-1">{file.name}</span>
                  <span className="text-[11px] text-emerald-600">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={!file || isUploading}
              className="w-full h-10 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ingesting & Validating Hospital Records...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Start Bulk Ingestion
                </>
              )}
            </Button>
          </form>

          {/* Result Card if any */}
          {result && (
            <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Bulk Import Job In Progress</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {result.message} {result.jobId && `(Job Reference: ${result.jobId})`}
              </p>
              <div className="pt-2">
                <Link to="/admin/hospitals">
                  <Button size="sm" variant="outline" className="text-xs h-8 border-slate-200">
                    View Updated Hospitals Directory &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Instructions & Guidelines (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3 text-xs">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Spreadsheet Guidelines
            </h4>
            <div className="space-y-2.5 text-slate-600 text-[11px] leading-relaxed">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <p className="font-semibold text-slate-800">1. Hospital Name (Required)</p>
                <p className="text-slate-500">The full operational or branch name of the hospital facility.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <p className="font-semibold text-slate-800">Other columns (Optional)</p>
                <p className="text-slate-500">Hospital Type, Hospital Speciality, Location / Full Address (or Address), Contact Number (or Phone Number), Email Address (or Email ID), Source (or Source Website), and Vacancy. Vacancy must be a non-negative number. Re-uploading the same records as the same user updates them instead of creating duplicates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImportPage;
