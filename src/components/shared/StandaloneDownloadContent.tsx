// components/shared/DownloadContent/StandaloneDownloadContent.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import ExportMenuContent from "./ExportMenuContent";

interface DownloadContentProps {
  text?: string;
  module?: string;
  currentData?: any[];
  filters?: Record<string, any>;
}

export default function StandaloneDownloadContent({
  text = "تحميل القائمة",
  module = "",
  currentData = [],
  filters = {},
}: DownloadContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button className="btn-primary" onClick={toggle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
          className="w-5 h-5 inline-block ml-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        {text}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-80">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <ExportMenuContent
              onClose={close}
              module={module}
              currentData={currentData}
              filters={filters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
