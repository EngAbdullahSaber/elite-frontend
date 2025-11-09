"use client";

import Card from "@/components/shared/Card";
import FilePreviewItem from "@/components/shared/Forms/FilePreviewItem";
import { propertySubmissionFull } from "@/types/dashboard/property-submissions";

type Props = {
  request: propertySubmissionFull;
};

export default function AuthorizationDocCard({ request }: Props) {
  return (
    <Card title="مستند التفويض">
      {request.authorizationDoc ? (
        <FilePreviewItem
          file={request.authorizationDoc}
          idx={0}
          allowMultiple={false}
          allowPrimary={false}
        />
      ) : (
        <div className="text-sm text-gray-500 italic min-h-[140px] flex justify-center items-center">
          لا يوجد مستند تفويض مرفق
        </div>
      )}
    </Card>
  );
}
