// components/PropertySubmissionDetailsContainer.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BiListUl } from "react-icons/bi";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import PopertySubmissionDetails from "@/components/dashboard/admin/propertySubmissions/PopertySubmissionDetails";
import { propertySubmissionFull } from "@/types/dashboard/property-submissions";
import { getPropertySubmission } from "@/services/propertySubmissions/propertySubmissions";
import { ImageBaseUrl } from "@/libs/app.config";

interface Props {
  requestId: string;
}

// Helper functions
function getPropertyTypeFromApi(apiPropertyType: any): string {
  if (!apiPropertyType) return "شقة";

  // If it's an object with name property
  if (typeof apiPropertyType === "object" && apiPropertyType.name) {
    return apiPropertyType.name;
  }

  // If it's a string
  if (typeof apiPropertyType === "string") {
    return apiPropertyType;
  }

  return "شقة"; // Default fallback
}

function mapApiStatusToComponentStatus(apiStatus: string): string {
  const statusMap: Record<string, string> = {
    pending: "pending",
    under_review: "under_review",
    approved: "approved",
    rejected: "rejected",
    published: "published",
    pending_review: "pending",
    pending_inspection: "under_review",
    inspected: "approved",
  };
  return statusMap[apiStatus] || "pending";
}

function getFileExtension(url: string): string {
  if (!url) return "png";
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  return match ? match[1].toLowerCase() : "png";
}

function getMimeType(url: string): string {
  const ext = getFileExtension(url);
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    dbf: "application/dbf",
  };
  return mimeTypes[ext] || "image/png"; // Default to image/png since most attachments are images
}

function getFileNameFromUrl(url: string): string {
  if (!url) return "file";
  const filename = url.split("/").pop() || "file";
  // Remove any hash or query parameters
  return filename.split("?")[0];
}

// Transform API data to match your component's expected format
function transformApiDataToPropertySubmissionFull(
  apiData: any
): propertySubmissionFull {
  // Transform specifications from object to array format
  const transformedSpecifications = apiData.specifications
    ? Object.entries(apiData.specifications).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  // Parse location coordinates
  let locationText = "غير محدد";
  if (apiData.location) {
    try {
      const latMatch = apiData.location.match(/Lat:\s*([\d.-]+)/);
      const lngMatch = apiData.location.match(/Lng:\s*([\d.-]+)/);
      if (latMatch && lngMatch) {
        locationText = `خط العرض: ${latMatch[1]}, خط الطول: ${lngMatch[1]}`;
      } else {
        locationText = apiData.location;
      }
    } catch (error) {
      locationText = apiData.location;
    }
  }

  // Transform attachments - handle both old and new structure
  const transformedAttachments = (apiData.attachments || []).map(
    (attachment: any, index: number) => {
      const attachmentUrl = attachment.attachmentUrl || attachment.url;
      const fileName = getFileNameFromUrl(attachmentUrl);

      return {
        url: ImageBaseUrl + attachmentUrl,
        name: fileName,
        type: getMimeType(attachmentUrl),
        isPrimary: index === 0,
      };
    }
  );

  // Transform authorization document
  const transformedAuthorizationDoc = apiData.authorizationDocUrl
    ? {
        url: ImageBaseUrl + apiData.authorizationDocUrl,
        name: getFileNameFromUrl(apiData.authorizationDocUrl),
        type: getMimeType(apiData.authorizationDocUrl),
        isPrimary: false,
      }
    : undefined;

  // Transform ownership document
  const transformedOwnershipDoc = apiData.ownershipDocUrl
    ? {
        url: ImageBaseUrl + apiData.ownershipDocUrl,
        name: getFileNameFromUrl(apiData.ownershipDocUrl),
        type: getMimeType(apiData.ownershipDocUrl),
        isPrimary: false,
      }
    : undefined;

  // Combine all documents (attachments + authorization + ownership)
  const allAttachments = [
    ...transformedAttachments,
    ...(transformedOwnershipDoc ? [transformedOwnershipDoc] : []),
  ];

  return {
    id: apiData.id.toString(),
    requesterName: apiData.owner?.fullName || "غير معروف",
    requesterEmail: apiData.owner?.email || "غير معروف",
    requesterPhone: apiData.owner?.phoneNumber || "غير معروف",
    relationshipType: apiData.relationshipType === "owner" ? "مالك" : "مفوض",
    propertyType: getPropertyTypeFromApi(apiData.propertyType),
    price: parseFloat(apiData.askingPrice) || 0,
    status: mapApiStatusToComponentStatus(apiData.status),
    address: locationText,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
    attachments: allAttachments,
    authorizationDoc: transformedAuthorizationDoc,
    ownershipDoc: transformedOwnershipDoc,
    specifications: transformedSpecifications,
    location: apiData.location,
    askingPrice: apiData.askingPrice,
    owner: apiData.owner,
    publishedProperty: undefined,
  };
}

export default function PropertySubmissionDetailsContainer({
  requestId,
}: Props) {
  const [propertySubmission, setPropertySubmission] =
    useState<propertySubmissionFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertySubmission = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiData = await getPropertySubmission(parseInt(requestId));
 
        if (apiData) {
          const transformedData =
            transformApiDataToPropertySubmissionFull(apiData);
           setPropertySubmission(transformedData);
        } else {
          setError("لم يتم العثور على طلب العقار");
        }
      } catch (err: any) {
        console.error("Error fetching property submission:", err);

        // More specific error messages
        if (err.response?.status === 404) {
          setError("طلب العقار غير موجود");
        } else if (err.response?.status === 401) {
          setError("غير مصرح بالوصول إلى هذا الطلب");
        } else if (err.response?.status === 403) {
          setError("غير مسموح لك بالوصول إلى هذا الطلب");
        } else {
          setError("فشل في تحميل بيانات طلب العقار");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertySubmission();
  }, [requestId]);

  if (loading) {
    return (
      <>
        <DashboardHeaderTitle path={["طلبات عرض العقار", "جاري التحميل..."]}>
          <Link
            className="btn-primary"
            href="/dashboard/admin/property-submissions"
          >
            <BiListUl /> عرض جميع الطلبات
          </Link>
        </DashboardHeaderTitle>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="text-gray-600 text-lg">
              جاري تحميل بيانات طلب العقار...
            </div>
            <div className="text-gray-400 text-sm">رقم الطلب: {requestId}</div>
          </div>
        </div>
      </>
    );
  }

  if (error || !propertySubmission) {
    return (
      <>
        <DashboardHeaderTitle path={["طلبات عرض العقار", "خطأ في التحميل"]}>
          <Link
            className="btn-primary"
            href="/dashboard/admin/property-submissions"
          >
            <BiListUl /> عرض جميع الطلبات
          </Link>
        </DashboardHeaderTitle>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
          <div className="text-gray-500 mb-6">رقم الطلب: {requestId}</div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard/admin/property-submissions"
              className="btn-primary"
            >
              العودة إلى قائمة الطلبات
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeaderTitle
        path={[
          "طلبات عرض العقار",
          `تفاصيل طلب - ${propertySubmission.requesterName}`,
        ]}
      >
        <Link
          className="btn-primary"
          href="/dashboard/admin/property-submissions"
        >
          <BiListUl /> عرض جميع الطلبات
        </Link>
      </DashboardHeaderTitle>

      <PopertySubmissionDetails request={propertySubmission} />
    </>
  );
}
