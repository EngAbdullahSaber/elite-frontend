type InfoBlockProps = {
    label: string;
    value: string;
    className?: string;        // wrapper <p>
    labelClassName?: string;   // label text
    valueClassName?: string;   // value <span>
};

export function InfoBlock({
    label,
    value,
    className,
    labelClassName,
    valueClassName,
}: InfoBlockProps) {
    return (
        <p className={`flex flex-wrap gap-2 ${className}`} >
            <span className={labelClassName}>{label}:</span>{' '}
            <span className={`font-medium ${valueClassName || ''}`}>{value}</span>
        </p>
    );
}
