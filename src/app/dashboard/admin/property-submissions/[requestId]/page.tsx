// app/dashboard/admin/property-submissions/[requestId]/page.tsx

import PropertySubmissionDetailsContainer from "@/components/dashboard/properties/PropertySubmissionDetailsContainer";

type Props = {
  params: {
    requestId: string;
  };
};

export default async function PropertySubmissionDetailsPage({ params }: Props) {
  const { requestId } = await params;

  return <PropertySubmissionDetailsContainer requestId={requestId} />;
}
