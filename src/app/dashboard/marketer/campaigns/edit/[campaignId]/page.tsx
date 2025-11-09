import { notFound } from "next/navigation";
import DashboardHeaderTitle from "@/components/dashboard/DashboardHeaderTitle";
import CampaignForm from "@/components/dashboard/admin/campaign/CampaignFormUpdate";
import { Campaign } from "@/types/campaign";
import CenteredContainer from "@/components/shared/CenteredContainer";
import Link from "next/link";
import { BiListUl } from "react-icons/bi";
import { FaBullhorn } from "react-icons/fa";

interface Props {
  params: { campaignId: string };
}

const mockedCampaign: Campaign = {
  id: "1",
  campaignName: "حملة الصيف 2024",
  campaignTitle: "عروض الصيف الحصرية",
  campaignDescription:
    "احصل على أفضل العروض العقارية في الصيف مع خصومات تصل إلى 20%",
  campaignImages: [
    {
      url: "/campaigns/image-1.webp",
      isPrimary: false,
    },
    {
      url: "/campaigns/image-2.png",
      isPrimary: false,
    },
  ],
  campaignExcel: [
    {
      url: "/uploads/request-301/property-financials.xlsx",
      name: "البيانات_المالية.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  ],
  targetChannel: "email",
  targetAudience: "clients",
  runType: "once",
  runOnceDateTime: "2024-07-15T10:00",
  status: "draft",
  isDraft: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export default async function EditCampaignPage({ params }: Props) {
  const { campaignId } = await params;

  await new Promise((r) => setTimeout(r, 300)); // simulate loading
  if (!mockedCampaign) {
    notFound();
  }

  return (
    <div>
      <DashboardHeaderTitle path={["الحملات", "تحرير الحملة"]}>
        <div className="flex gap-4 flex-wrap">
          <Link
            className="btn-primary"
            href={`/dashboard/marketer/campaigns/${mockedCampaign.id}`}
          >
            <FaBullhorn /> صفحة الحمله
          </Link>
          <Link className="btn-primary" href="/dashboard/marketer/campaigns">
            <BiListUl /> عرض جميع الحملات
          </Link>
        </div>
      </DashboardHeaderTitle>
      <CenteredContainer>
        <CampaignForm
          initialData={{
            campaignName: mockedCampaign.campaignName,
            campaignTitle: mockedCampaign.campaignTitle,
            campaignDescription: mockedCampaign.campaignDescription,
            targetChannel: mockedCampaign.targetChannel,
            campaignImages: mockedCampaign.campaignImages,
            campaignExcel: mockedCampaign.campaignExcel,
            targetAudience: mockedCampaign.targetAudience,
            runType: mockedCampaign.runType,
            runOnceDateTime: mockedCampaign.runOnceDateTime,
            startDate: mockedCampaign.startDate,
            endDate: mockedCampaign.endDate,
            runFrequency: mockedCampaign.runFrequency,
            runTime: mockedCampaign.runTime,
            isDraft: mockedCampaign.isDraft || false,
          }}
        />
      </CenteredContainer>
    </div>
  );
}
