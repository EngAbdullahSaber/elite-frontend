'use client';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
    TooltipModel,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    data: number[];
    labels: string[];
    colors?: string[];  // custom slice colors
}

export function DoughnutChart({
    data,
    labels,
    colors,
}: DoughnutChartProps) {
    const baseColors =
        colors?.length === data.length
            ? colors
            : [
                'rgba(255, 99, 132, 0.9)',
                'rgba(54, 162, 235, 0.9)',
                'rgba(255, 206, 86, 0.9)',
                'rgba(75, 192, 192, 0.9)',
            ];

    const chartData: ChartData<'doughnut', number[], string> = {
        labels,
        datasets: [
            {
                data,
                backgroundColor: baseColors,
                borderWidth: 0,
                borderRadius: 0,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        maintainAspectRatio: false,
        cutout: '0%', // full pie
        animation: {
            animateRotate: true,
            animateScale: false,
            duration: 1500,
            easing: 'easeOutCubic',
        },
        plugins: {
            legend: { display: false },

            tooltip: {
                enabled: true,
                displayColors: false,
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                // scriptable background to match slice
                backgroundColor: (ctx) => {
                    const idx = (ctx.tooltip as TooltipModel<'doughnut'>)
                        .dataPoints![0].dataIndex;
                    return baseColors[idx];
                },
                titleFont: {
                    family: "'DIN Next LT Arabic', 'Poppins', sans-serif",
                    size: 16,
                    weight: 'normal',
                },
                titleColor: '#fff',
                bodyFont: {
                    family: 'Tajawal, sans-serif',
                    size: 14,
                },
                bodyColor: '#fff',
                callbacks: {
                    title: (items) => '',
                    // raw value
                    label: (ctx) => {
                        const value = ctx.formattedValue;
                        const sliceLabel = ctx.label;
                        return `${sliceLabel}: ${value}`;
                    },
                },
            },
        },

        elements: {
            arc: {
                borderRadius: 0,
            },
        },
    };



    return (
        <div className="flex items-center gap-12 ">
            <ul className="space-y-4">
                {labels.map((label, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                        <span className="text-lg font-main">{label}</span>
                        <span
                            className="block w-3 h-3 rounded-full"
                            style={{ backgroundColor: baseColors[i] }}
                        />
                    </li>
                ))}
            </ul>
            <div style={{ width: 300, height: 300 }}>
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
}
