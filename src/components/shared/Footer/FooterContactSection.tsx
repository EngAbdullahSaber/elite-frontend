"use client";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineMailOpen } from "react-icons/hi";
import { IoLocation } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getFooterSettings } from "@/services/settings/footerSettings";

interface FooterSettings {
  id: number;
  email: string;
  phoneNumber: string;
  // Add other properties as needed from your response
}

export default function FooterContactSection() {
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFooterSettings() {
      try {
        setLoading(true);
        setError(null);

        const settings = await getFooterSettings();

        // Handle different response structures
        const footerData = settings?.data || settings?.record || settings;
        setFooterSettings(footerData);
      } catch (err) {
        console.error("Error fetching footer settings:", err);
        setError("فشل في تحميل بيانات التواصل");
        setFooterSettings(null);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterSettings();
  }, []);

  // Fallback data
  const fallbackData = {
    phoneNumber: "+966543640639",
    email: "ali@albarakati.net",
  };

  // Safely get values with proper fallbacks
  const phoneNumber = footerSettings?.phoneNumber || fallbackData.phoneNumber;
  const email = footerSettings?.email || fallbackData.email;
  const location = "طريق الملك عبدالعزيز، جدة"; // Location is not in the API response, so keep static

  // Format phone number for display (remove + and add spaces)
  const formatPhoneNumber = (phone: string) => {
    if (!phone)
      return fallbackData.phoneNumber
        .replace("+", "")
        .replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");

    return phone
      .replace("+", "")
      .replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
  };

  // Loading state
  if (loading) {
    return (
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-32 mb-6"></div>
        <ul className="flex flex-col gap-4">
          {[1, 2, 3].map((item) => (
            <li key={item}>
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 text-gray-200 text-2xl p-2 rounded-full animate-pulse">
                  <div className="w-5 h-5"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-3">
      <h4 className="text-2xl font-semibold mb-6">تواصل معنا</h4>

      {error && (
        <div className="mb-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <ul className="flex flex-col gap-4">
        <li>
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white text-2xl p-2 rounded-full">
              <FiPhoneCall size={20} />
            </div>
            <Link
              href={`tel:${phoneNumber}`}
              className="text-neutral-300 hover:text-white transition-colors"
            >
              {formatPhoneNumber(phoneNumber)}
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-4">
            <div className="bg-secondary text-neutral-700 text-2xl p-2 rounded-full">
              <HiOutlineMailOpen size={20} />
            </div>
            <Link
              href={`mailto:${email}`}
              className="text-neutral-300 hover:text-white transition-colors"
            >
              {email}
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-4">
            <div className="bg-tertiary text-neutral-700 text-2xl p-2 rounded-full">
              <IoLocation size={20} />
            </div>
            <p className="text-neutral-300">{location}</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
