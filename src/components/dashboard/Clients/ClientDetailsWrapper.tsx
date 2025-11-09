"use client";

import ClientDetails from "./ClientDetails";
import DashboardHeaderTitle from "../DashboardHeaderTitle";
import DownloadContent from "@/components/shared/DownloadContent";
import Link from "next/link";
import { BiGroup } from "react-icons/bi";
import { getClientById } from "@/services/clinets/clinets";
import { useEffect, useState } from "react";

type Props = {
  clientId: number;
};

export default function ClientDetailsWrapper({ clientId }: Props) {
  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        setError(null);
        const clientData = await getClientById(clientId);
        setClient(clientData);
      } catch (err) {
        console.error("Error fetching client:", err);
        setError("فشل في تحميل بيانات العميل");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-64"></div>;
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {error || "لم يتم العثور على العميل"}
        </h3>
        <Link href="/dashboard/admin/clients" className="btn-primary mt-4">
          <BiGroup /> العودة إلى قائمة العملاء
        </Link>
      </div>
    );
  }

  return (
    <>
      <DashboardHeaderTitle
        path={["العملاء", `تفاصيل العميل - ${client.fullName}`]}
      >
        <div className="flex gap-4 flex-wrap">
          <DownloadContent text="تحميل المعلومات" />
          <Link className="btn-primary" href="/dashboard/admin/clients">
            <BiGroup /> عرض جميع العملاء
          </Link>
        </div>
      </DashboardHeaderTitle>

      <ClientDetails client={client} />
    </>
  );
}
