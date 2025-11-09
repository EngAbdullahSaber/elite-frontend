export type TooltipDP = {
    label: string;
    value: string;
    color: string;
};

export default function ChartTooltip({ tooltipData, visible, tooltiTitle }: { tooltipData: { dps: TooltipDP[]; left: number; top: number }, visible: boolean, tooltiTitle?: string }) {

    return <div
        style={{
            position: 'absolute',
            left: tooltipData.left + 10,
            top: tooltipData.top + 10,
            pointerEvents: 'none',
            zIndex: 1000,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',

            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 120ms ease-out, transform 120ms ease-out',
        }}
    >
        {/* Title bar */}
        <div
            style={{
                background: '#f3f4f6',
                padding: '4px 8px',
                fontFamily: "'DIN Next LT Arabic','Poppins',sans-serif",
                fontSize: 14,
                fontWeight: 600,
                borderBottom: '1px solid #e5e7eb',
            }}
        >
            {tooltiTitle ? tooltiTitle : tooltipData.dps[0]?.label}
        </div>

        {/* Body: white background */}
        <div
            style={{
                background: '#fff',
                padding: '6px 8px',
                fontFamily: "'DIN Next LT Arabic','Poppins',sans-serif",
                fontSize: 13,
            }}
        >
            {tooltipData.dps.map((pt, i) => (
                <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    {/* colored “O” */}
                    <span
                        style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: pt.color,
                        }}
                    />
                    <span>{pt.label}: {pt.value}</span>
                </div>
            ))}
        </div>
    </div>
}