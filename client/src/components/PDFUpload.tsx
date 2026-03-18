import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/Card";

export const PDFUpload = () => {
  const [status, setStatus] = useState<"idle" | "uploading" | "success">(
    "idle",
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");

        setTimeout(() => {
          setStatus("idle");
          setFileName(null);
        }, 3000);
      } else {
        toast.error("Uploaded Failed .. Please try again");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="max-w-xl mx-auto" glass>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-400" />
          Knowledge Source
        </CardTitle>
        <CardDescription>
          Upload your PDF document to start questioning the model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "idle" && (
          <div
            className="border-2 border-dashed border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center gap-4 hover:border-primary-500/50 transition-colors cursor-pointer group"
            onClick={handleUpload}
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary-400" />
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
            </div>
            <div className="text-center">
              <p className="text-slate-200 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-slate-500 text-sm">PDF (max. 50MB)</p>
            </div>
          </div>
        )}
        {status === "uploading" && (
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
            <p className="text-slate-200 font-medium">Uploading...</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-4">
            <CheckCircle2 className="w-6 h-6 text-primary-400" />
            <p className="text-slate-200 font-medium">Upload successful</p>
            <p className="text-slate-500 text-sm">{fileName}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
