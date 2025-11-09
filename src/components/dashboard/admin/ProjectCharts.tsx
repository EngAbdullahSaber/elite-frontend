'use client'
import Card from '@/components/shared/Card'
import { DoughnutChart } from '@/components/shared/charts/DoughnutChart'

export default function ProjectCharts() {
    return (
        <div className='flex flex-col xl:flex-row gap-4 xl:gap-6'>

            <Card title='أنواع المشاريع'>
                <DoughnutChart
                    data={[350, 500, 200]}
                    labels={['أرض', 'منزل', 'فيلا']}
                    colors={['rgba(59, 130, 246, 0.9)', 'rgba(16, 185, 129, 0.9)', 'rgba(245, 158, 11, 0.9)']}
                />
            </Card>
        </div>
    )
}
