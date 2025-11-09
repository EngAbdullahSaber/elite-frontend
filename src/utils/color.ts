import { ScriptableContext } from "chart.js";


export function createGradiant(ctx: ScriptableContext<'line'>, lineColor: string, bgGradient: { from: string; to: string }) {
    const chart = ctx.chart;
    const { ctx: canvasCtx, chartArea } = chart;
    if (!chartArea) return lineColor;

    const gradient = canvasCtx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
    );
    gradient.addColorStop(0, bgGradient.from);
    gradient.addColorStop(1, bgGradient.to);
    return gradient;
}