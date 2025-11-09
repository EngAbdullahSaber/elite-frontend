// components/shared/DownloadContent/ExportMenuContent.tsx
"use client";

import { useState } from "react";
import {
  exportModule,
  ExportModuleParams,
  downloadExportFile,
  exportWithConfig,
  createCommonExportConfig,
  exportCustomData,
  downloadFileFromBlob,
} from "@/services/exports/exports";
import toast from "react-hot-toast";

interface ExportMenuContentProps {
  onClose?: () => void;
  module?: string;
  currentData?: any[];
  filters?: Record<string, any>;
}

export default function ExportMenuContent({
  onClose,
  module = "campaign",
  currentData = [],
  filters = {},
}: ExportMenuContentProps) {
  const [isLoading, setLoading] = useState(false);
  const [scope, setScope] = useState<"current" | "more">("current");
  const [maxRows, setMaxRows] = useState(1000);
  const [format, setFormat] = useState<"excel" | "csv" | "pdf">("excel");
  const [exportType, setExportType] = useState<"module" | "custom">("module");

  async function handleModuleExport() {
    const exportParams: ExportModuleParams = {
      module,
      format,
      filters: { ...filters },
    };

    // Set limit based on scope
    if (scope === "current") {
      exportParams.limit = currentData.length || 1000;
    } else {
      exportParams.limit = maxRows >= 10000 ? "all" : maxRows;
    }

    console.log("Exporting module with params:", exportParams);

    const result = await exportModule(exportParams);
    console.log("Export module result:", result);

    // Check if result is a Blob (file) or a regular response
    if (result instanceof Blob) {
      // It's a file blob - download directly
      const fileName = `${module}_export_${
        new Date().toISOString().split("T")[0]
      }.${format === "excel" ? "xlsx" : format === "csv" ? "csv" : "pdf"}`;

      downloadFileFromBlob(result, fileName);

      toast.success("تم تصدير البيانات بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } else if (result.success && result.downloadUrl) {
      // It's a URL-based response
      downloadExportFile(
        result.downloadUrl,
        `${module}_export_${new Date().toISOString().split("T")[0]}.${
          format === "excel" ? "xlsx" : format === "csv" ? "csv" : "pdf"
        }`
      );

      toast.success("تم تصدير البيانات بنجاح", {
        duration: 4000,
        position: "top-center",
        icon: "✅",
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "14px",
        },
      });
    } else {
      throw new Error(result.message || "فشل في تصدير البيانات");
    }

    onClose?.();
  }

  return (
    <div className="space-y-3" data-popup>
      {/* Export Type */}
      <div className="space-y-1">
        <div className="text-sm font-medium">نوع التصدير</div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="export-type"
              className="radio"
              checked={exportType === "module"}
              onChange={() => setExportType("module")}
            />
            <span>تصدير من السيرفر</span>
          </label>
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="export-type"
              className="radio"
              checked={exportType === "custom"}
              onChange={() => setExportType("custom")}
            />
            <span>تصدير البيانات المعروضة</span>
          </label>
        </div>
      </div>

      {/* Export Scope - Only show for module export */}
      {exportType === "module" && (
        <>
          <div className="space-y-1">
            <div className="text-sm font-medium">نطاق التصدير</div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="export-scope"
                  className="radio"
                  checked={scope === "current"}
                  onChange={() => setScope("current")}
                />
                <span>الجدول الحالي ({currentData.length} عنصر)</span>
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="export-scope"
                  className="radio"
                  checked={scope === "more"}
                  onChange={() => setScope("more")}
                />
                <span>بيانات أكثر</span>
              </label>
            </div>
          </div>

          {/* Max Rows - Only show for "more" scope */}
          <div
            className={`space-y-1 ${
              scope !== "more" && "opacity-50 select-none"
            }`}
          >
            <label className="block text-sm font-medium" htmlFor="max-rows">
              أقصى عدد للصفوف
            </label>
            <input
              id="max-rows"
              type="number"
              min={1}
              max={100000}
              className={`input rounded-sm block input-bordered w-full ${
                scope !== "more" && "cursor-not-allowed"
              }`}
              value={maxRows}
              disabled={scope !== "more"}
              onChange={(e) =>
                setMaxRows(Math.max(1, Number(e.target.value) || 0))
              }
            />
            {scope === "more" && maxRows >= 10000 && (
              <p className="text-xs text-gray-500">
                سيتم تصدير جميع البيانات المتاحة
              </p>
            )}
          </div>
        </>
      )}

      {/* Data Info for Custom Export */}
      {exportType === "custom" && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <strong>معلومات التصدير:</strong>
            <br />• سيتم تصدير {currentData.length} عنصر
            <br />
            • التنسيف: Excel (.xlsx)
            <br />• البيانات المعروضة حالياً في الجدول
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-start gap-2 pt-1">
        <button
          className={`bg-primary rounded-full py-2 px-4 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={handleModuleExport}
          disabled={
            isLoading || (exportType === "custom" && currentData.length === 0)
          }
        >
          {isLoading ? "جاري التصدير..." : "تصدير"}
        </button>
        <button
          className="btn btn-ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}
