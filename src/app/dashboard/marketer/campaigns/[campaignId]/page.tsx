import Link from 'next/link';
import { BiListUl } from 'react-icons/bi';
import DashboardHeaderTitle from '@/components/dashboard/DashboardHeaderTitle';

import { Campaign } from '@/types/campaign';
import CampaignDetails from '@/components/dashboard/admin/campaign/CampaignDetails';

const mockCampaign: Campaign = {
    id: '1',
    campaignName: 'حملة تسويقية',
    campaignTitle: 'حملة لزيادة الوعي',
    campaignDescription: 'تهدف هذه الحملة إلى تعزيز الوعي بالفرص العقارية المتاحة من خلال إرسال رسائل بريد إلكتروني شهرية إلى جميع المستخدمين. تشمل الرسائل عروضًا حصرية، تحديثات المشاريع، ونصائح استثمارية تساعد العملاء على اتخاذ قرارات مدروسة. تم تصميم الحملة لتكون مستمرة طوال عام 2025، مع متابعة الأداء وتحسين المحتوى بناءً على التفاعل الشهري.',
    campaignImages: [{
        url: '/campaigns/image-1.webp',
        isPrimary: false,
    }, {
        url: '/campaigns/image-2.png',
        isPrimary: false,
    }],
    campaignExcel: [{
        url: "/uploads/request-301/property-financials.xlsx",
        name: "البيانات_المالية.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }],
    targetChannel: 'email',
    targetAudience: 'all_users',
    runType: 'recurring',
    runOnceDateTime: '',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    runFrequency: 'monthly',
    runTime: '10:00',
    status: 'scheduled',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
};

type Props = {
    params: {
        campaignId: string;
    };
};

export default async function CampaignDetailsPage({ params }: Props) {
    const { campaignId } = await params;

    // simulate fetch delay
    await new Promise((r) => setTimeout(r, 300));

    return (
        <>
            <DashboardHeaderTitle path={['الحملات', `تفاصيل الحملة - ${mockCampaign.campaignName}`]}>
                <Link className="btn-primary" href="/dashboard/marketer/campaigns">
                    <BiListUl /> عرض جميع الحملات
                </Link>
            </DashboardHeaderTitle>

            <CampaignDetails
                campaign={mockCampaign}
            />
        </>
    );
}