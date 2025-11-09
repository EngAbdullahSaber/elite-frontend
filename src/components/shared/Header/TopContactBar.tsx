"use client";

import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineMailOpen } from "react-icons/hi";
import { IoLocation } from "react-icons/io5";
import { useCallback, useState, useEffect } from "react";
import PrimaryButton from "../Button";
import LogoIcon from "../LogoIcon";
import ContactItem from "./ContactItem";
import { MdAddHomeWork } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import Tooltip from "../Tooltip";
import { getSiteSettings } from "@/services/settings/siteSettings";

// Define the type for the API response
interface UpdatedBy {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  userType: string;
}

interface ContactInfo {
  id: number;
  createdAt: string;
  updatedAt: string;
  latitude: string;
  longitude: string;
  email: string;
  phoneNumber: string;
  customerCount: number;
  yearsExperience: number;
  projectCount: number;
  updatedBy: UpdatedBy;
}

interface TopContactBarProps {
  contactData?: ContactInfo;
}

export default function TopContactBar({ contactData }: TopContactBarProps) {
  const [copied, setCopied] = useState<"phone" | "email" | "location" | null>(
    null
  );
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  // Set contact data when component mounts or when prop changes
  useEffect(() => {
    if (contactData) {
      setContactInfo(contactData);
    } else {
      // You can also fetch data here if not passed as prop
      fetchContactData();
    }
  }, [contactData]);

  const fetchContactData = async () => {
    try {
      const data = await getSiteSettings();
      setContactInfo(data);
    } catch (error) {
      console.error("Failed to fetch contact data:", error);
    }
  };

  const copy = useCallback(
    async (text: string, key: "phone" | "email" | "location") => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
      } catch {}
    },
    []
  );

  // Format phone number for display (you can customize this)
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1\u00A0$2\u00A0$3");
  };

  // Default values in case API data is not available
  const phone = contactInfo?.phoneNumber
    ? formatPhoneNumber(contactInfo.phoneNumber.replace("+", ""))
    : "966\u00A054\u00A0364\u00A00639+";
  const email = contactInfo?.email || "ali@albarakati.net";
  const location = "طريق الملك عبدالعزيز، جدة"; // This isn't in the API, you might want to add it

  return (
    <header aria-label="شريط التواصل العلوي" className="bg-bg-1 border-b">
      <div className="container mx-auto flex items-center justify-between py-3 lg:py-5 gap-2 px-3">
        {/* Logo */}
        <div className="flex items-center z-[11]">
          <Link href="/">
            <div className="block">
              <LogoIcon className="text-black" />
            </div>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="hidden md:flex items-stretch divide-x">
          <ContactItem
            icon={<FiPhoneCall size={20} aria-hidden />}
            label="اتصال مجاني"
            value={phone}
            type="phone"
            copied={copied}
            onCopy={copy}
          />
          <ContactItem
            icon={<HiOutlineMailOpen size={20} aria-hidden />}
            label="الدعم الإلكتروني"
            value={email}
            type="email"
            copied={copied}
            onCopy={copy}
          />
          <ContactItem
            icon={<IoLocation size={20} aria-hidden />}
            label="موقعنا"
            value={location}
            type="location"
            copied={copied}
            onCopy={copy}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-2">
          {/* Desktop buttons */}
          <Tooltip text="أضف عقارك" tipClassName="block md:hidden ">
            <PrimaryButton
              href="/add-property"
              className="max-md:p-2 md:inline-flex focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <span className="hidden md:block">أضف عقارك</span>
              <MdAddHomeWork size={22} className="block md:hidden " />
            </PrimaryButton>
          </Tooltip>

          <Tooltip text="انضم كوسيط" tipClassName="block md:hidden">
            <PrimaryButton
              href="/become-agent"
              className="max-md:p-2 md:inline-flex focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <span className="hidden md:block">انضم كوسيط</span>
              <FaUserPlus size={22} className="block md:hidden " />
            </PrimaryButton>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
