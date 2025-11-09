'use client';

import React, { useRef } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
    ChartData,
    ScriptableContext,

} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartTooltip from './ChartTooltip';
import { createGradiant } from '@/utils/color';
import useChartToolTip from '@/hooks/useChartToolTip';

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Filler
);

interface TwoLineChartProps {
    labels: string[];
    data1Label: string;
    data2Label: string;
    data1: number[];
    data2: number[];
    line1Color?: string;
    line2Color?: string;
    line1Gradient?: { from: string; to: string };
    line2Gradient?: { from: string; to: string };
    tooltiTitle: string;
}

export function TwoLineChart({
    labels,
    data1,
    data1Label,
    data2,
    data2Label,
    line1Color = '#363aed',
    line2Color = '#37d279',
    line1Gradient = { from: 'rgba(54, 58, 237, 0.1)', to: 'rgba(54, 58, 237, 0.45)' },
    line2Gradient = { from: 'rgba(55, 210, 121, 0.1)', to: 'rgba(55, 210, 121, 0.45)' },
    tooltiTitle = ''
}: TwoLineChartProps) {
    const chartRef = useRef<ChartJS<'line'>>(null);

    // tooltip state
    const { handleTooltip, tooltipData, showTip } = useChartToolTip();
    // data + gradients
    const chartData: ChartData<'line'> = {
        labels,
        datasets: [
            {
                label: data1Label,
                data: data1,
                borderColor: line1Color,
                borderWidth: 4,
                backgroundColor: (ctx: ScriptableContext<'line'>) => createGradiant(ctx, line1Color, line1Gradient),
                fill: { target: 1 }, // fill between dataset[0] and dataset[1]
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: line1Color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHitRadius: 20,
            },
            {
                label: data2Label,
                data: data2,
                borderColor: line2Color,
                borderWidth: 4,
                backgroundColor: (ctx: ScriptableContext<'line'>) => createGradiant(ctx, line2Color, line2Gradient),
                fill: 'start',
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: line2Color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHitRadius: 20,
            },
        ],
    };

    // chart options with external tooltip
    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: false, // disable built-in
                external: (context) => handleTooltip(context),
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: "'DIN Next LT Arabic','Poppins',sans-serif", size: 12 },
                },
            },
            y: {
                grid: { color: 'rgba(0,0,0,0.05)', lineWidth: 1.5 },
                ticks: {
                    font: { family: "'DIN Next LT Arabic','Poppins',sans-serif", size: 12 },
                },
            },
        },
    };

    return (
        <div style={{ position: 'relative', width: 'auto', height: 400 }}>
            <Line ref={chartRef} data={chartData} options={options} />
            <ChartTooltip tooltipData={tooltipData} visible={showTip} tooltiTitle={tooltiTitle} />

        </div>
    );
}


