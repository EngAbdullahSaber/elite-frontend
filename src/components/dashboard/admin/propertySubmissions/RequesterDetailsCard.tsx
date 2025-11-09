"use client";

import Card from "@/components/shared/Card";
import { propertySubmissionFull } from "@/types/dashboard/property-submissions";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";

type Props = { request: propertySubmissionFull };

export default function RequesterDetailsCard({ request }: Props) {
  return (
    <Card title="بيانات مقدم الطلب" className="relative">
      <Link
        href={`/dashboard/admin/property-submissions/edit/${request.id}`}
        className="absolute top-4 left-4 bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:bg-gray-50 transition z-10"
        title="تعديل بيانات الطلب"
      >
        <BiEdit className="w-5 h-5 text-gray-600" />
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-medium">الاسم:</span> {request.requesterName}
        </div>
        <div>
          <span className="font-medium">نوع العلاقة:</span>{" "}
          {request.relationshipType}
        </div>
        <div>
          <span className="font-medium">العنوان:</span> {request.address}
        </div>
      </div>
    </Card>
  );
}
