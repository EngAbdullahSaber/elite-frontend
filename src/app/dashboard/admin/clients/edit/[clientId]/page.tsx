// app/dashboard/admin/clients/[clientId]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BiGroup, BiUser } from "react-icons/bi";
import { notFound, useRouter } from "next/navigation";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import BasicInfoForm from "@/components/main/customer/personal-info/BasicInfoForm";
import CenteredContainer from "@/components/shared/CenteredContainer";
import { Client, getClientById } from "@/services/clinets/clinets";
import { baseUrl, ImageBaseUrl } from "@/libs/app.config";

type Props = {
  params: { clientId: string };
};

export default function EditClientPage({ params }: Props) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true);
        const clientId = parseInt(params.clientId);

        const clientData = await getClientById(clientId);
        setClient(clientData);
      } catch (error: any) {
        console.error("Error fetching client:", error);
        setError(error.response?.data?.message || "فشل في تحميل بيانات العميل");

        // If client not found, redirect to 404
        if (error.response?.status === 404) {
          notFound();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [params.clientId]);

  // Convert API client data to form client data
  const formClient = client
    ? {
        id: client.id,
        name: client.fullName,
        email: client.email,
        phone: client.phoneNumber,
        type: client.userType,
        image: ImageBaseUrl + client.profilePhotoUrl,
        nationalIdUrl: ImageBaseUrl + client.nationalIdUrl,
        residencyIdUrl: ImageBaseUrl + client.residencyIdUrl,
      }
    : undefined;

  if (isLoading) {
    return (
      <div>
        <DashboardHeaderTitle path={["العملاء", "جاري التحميل..."]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href="/dashboard/admin/clients">
              <BiGroup /> عرض جميع العملاء
            </Link>
          </div>
        </DashboardHeaderTitle>
        <CenteredContainer>
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-lg text-neutral-600">
              جاري تحميل بيانات العميل...
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div>
        <DashboardHeaderTitle path={["العملاء", "خطأ في التحميل"]}>
          <div className="flex gap-4 flex-wrap">
            <Link className="btn-primary" href="/dashboard/admin/clients">
              <BiGroup /> عرض جميع العملاء
            </Link>
          </div>
        </DashboardHeaderTitle>
        <CenteredContainer>
          <div className="flex justify-center items-center py-20">
            <div className="text-red-600 text-lg text-center">
              {error || "فشل في تحميل بيانات العميل"}
              <br />
              <button
                onClick={() => router.refresh()}
                className="mt-4 text-primary hover:underline"
              >
                حاول مرة أخرى
              </button>
            </div>
          </div>
        </CenteredContainer>
      </div>
    );
  }
  console.log(formClient);
  return (
    <div>
      <DashboardHeaderTitle
        path={["العملاء", `تعديل بيانات العميل: ${client.fullName}`]}
      >
        <div className="flex gap-4 flex-wrap">
          <Link
            className="btn-primary"
            href={`/dashboard/admin/clients/${client.id}`}
          >
            <BiUser /> صفحة العميل
          </Link>
          <Link className="btn-primary" href="/dashboard/admin/clients">
            <BiGroup /> عرض جميع العملاء
          </Link>
        </div>
      </DashboardHeaderTitle>

      <CenteredContainer>
        <BasicInfoForm
          client={formClient}
          clientId={client.id}
          isAdmin={true}
        />
      </CenteredContainer>
    </div>
  );
}
