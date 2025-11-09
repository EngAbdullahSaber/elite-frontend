'use client'
import { TwoLineChart } from '@/components/shared/charts/TwoLineChart'

interface VisitsRegistrationsChartProps {
    data?: {
        visits: number[]
        registrations: number[]
        labels: string[]
    }
}

export default function VisitsRegistrationsChart({
    data = {
        visits: [1200, 1500, 1800, 1600, 2000, 2200],
        registrations: [45, 52, 68, 55, 78, 85],
        labels: ['يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    }
}: VisitsRegistrationsChartProps) {
    return (
        <TwoLineChart
            labels={data.labels}
            data1={data.visits}
            data2={data.registrations}
            tooltiTitle='الزيارات والتسجيلات'
            data1Label='عدد الزيارات'
            data2Label='التسجيلات الجديدة'
            line1Color="#363aed"
            line2Color="#37d279"
            line1Gradient={{
                from: 'rgba(54, 58, 237, 0.1)',
                to: 'rgba(54, 58, 237, 0.45)',
            }}
            line2Gradient={{
                from: 'rgba(55, 210, 121, 0.1)',
                to: 'rgba(55, 210, 121, 0.45)',
            }}
        />
    )
}
