"use client";
import { propertySubmissionFull } from "@/types/dashboard/property-submissions";
import RequesterDetailsCard from "./RequesterDetailsCard";
import GeneralInfoCard from "./GeneralInfoCard";

import PublishedPropertyCard from "./PublishedPropertyCard";
import AuthorizationDocCard from "./AuthorizationDocCard";
import PropertyInfoSection from "@/components/main/projects/property/PropertyInfoSection";
import AttachmentsCard from "@/components/shared/AttachmentsCard";

type Props = {
  request: propertySubmissionFull;
};

export default function PropertySubmissionDetails({ request }: Props) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 2xl:grid-cols-6 gap-4 lg:gap-6 ">
        <div className="h-full 2xl:col-span-2 space-y-4 lg:space-y-6">
          <div className="w-full">
            <RequesterDetailsCard request={request} />
          </div>
          {request.publishedProperty && (
            <PublishedPropertyCard
              publishedProperty={request.publishedProperty}
            />
          )}
          <div className="w-full">
            <GeneralInfoCard request={request} />
          </div>
        </div>
        <div className="h-full 2xl:col-span-4 flex flex-col gap-4 lg:gap-6">
          <PropertyInfoSection details={request.specifications} />
          <AuthorizationDocCard request={request} />
        </div>
      </div>
      <AttachmentsCard attachments={request.attachments} title="المرفقات" />
    </div>
  );
}
