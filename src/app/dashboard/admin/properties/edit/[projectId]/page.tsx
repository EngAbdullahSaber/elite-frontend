import DashboardHeaderTitle from '@/components/dashboard/DashboardHeaderTitle';
import PropertyForm, { PropertyFormValues } from '@/components/dashboard/properties/PropertyForm';
import CenteredContainer from '@/components/shared/CenteredContainer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BiBuilding, BiListUl } from 'react-icons/bi';

// 👇 Mocked properties (مثال)
const mockedProperties: (PropertyFormValues & { id: number })[] = [
    {
        id: 1,
        title: 'شقة فاخرة في جدة',
        description: 'شقة 3 غرف وصالة مطلة على البحر',
        price: 1200000,
        propertyType: 'apartment',
        accessType: 'direct',
        rooms: 3,
        bathrooms: 2,
        area: 150,
        details: {
            planNumber: { name: 'رقم المخطط', value: '1234' },
            pieceNumber: { name: 'رقم القطعة', value: '56' },
        },
        warranties: {
            structure: { name: 'ضمان الهيكل', value: '10 سنوات' },
        },
        ownerName: 'أحمد محمد',
        ownerPhone: '0501234567',
        ownerEmail: 'owner@example.com',
        images: [
            { url: '/main/projects/property-2.webp', isPrimary: true },
            { url: '/main/projects/property-3.webp', isPrimary: false },
        ],
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        address: 'حي الشاطئ، جدة'
    },
    {
        id: 2,
        title: 'فيلا راقية في الرياض',
        description: 'فيلا 5 غرف مع مسبح وحديقة',
        price: 3500000,
        propertyType: 'villa',
        accessType: 'mediated',
        rooms: 5,
        bathrooms: 4,
        area: 500,
        details: {},
        warranties: {},
        ownerName: 'سارة علي',
        ownerPhone: '0559876543',
        ownerEmail: 'sara@example.com',
        images: [],
        video: '',
        address: 'حي الياسمين، الرياض'
    },
];

type Props = {
    params: { projectId: string };
};

export default async function EditProjectPage({ params }: Props) {
    const projectId = 1;
    const project = mockedProperties.find((p) => p.id === projectId);

    await new Promise((r) => setTimeout(r, 300)); // simulate loading

    if (!project) {
        notFound();
    }

    return (
        <div>
            <DashboardHeaderTitle path={['المشاريع', `تعديل بيانات المشروع: ${project.title}`]}>
                <div className="flex gap-4 flex-wrap">
                    <Link className="btn-primary" href={`/projects/${project.id}`}>
                        <BiBuilding /> صفحة المشروع
                    </Link>
                    <Link className="btn-primary" href="/dashboard/admin/projects">
                        <BiListUl /> عرض جميع المشاريع
                    </Link>
                </div>
            </DashboardHeaderTitle>


            <PropertyForm initialData={project} />

        </div>
    );
}
