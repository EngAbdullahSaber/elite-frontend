"use client";

import { notFound, useRouter } from "next/navigation";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";
import {
  getPartners,
  getPartnerPerformance,
  getPartnerById,
} from "@/services/partner/partner";
import { useEffect, useState } from "react";
import { Partner } from "@/services/partner/partner";
import PartnerDetails from "@/components/dashboard/partner/PartnerDetails";

export default function PartnerPage() {
  const user = sessionStorage.getItem("user");
  const router = useRouter();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = JSON.parse(user);
  console.log(id);

  useEffect(() => {
    async function fetchPartnerData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch partner details
        const partnersResponse = await getPartnerById(id);

        setPartner(partnersResponse.partner[0]);

        // Fetch partner performance data
        try {
          const performance = await getPartnerPerformance(Number(id));
          setPerformanceData(performance);
        } catch (performanceError) {
          console.error(
            "Error fetching partner performance:",
            performanceError
          );
          // Continue without performance data
        }
      } catch (err) {
        console.error("Error fetching partner details:", err);
        setError("فشل في تحميل بيانات الشريك");
        notFound();
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchPartnerData();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <button
          onClick={() => router.push("/dashboard/admin/partners")}
          className="btn-primary"
        >
          <BiGroup /> العودة إلى قائمة الشركاء
        </button>
      </div>
    );
  }

  return (
    <>
      <PartnerDetails partner={partner} performance={performanceData} />
    </>
  );
}
