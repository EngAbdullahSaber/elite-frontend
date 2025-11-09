type EmptyNotificationProps = {
    header: string;
    description?: string;
    className?: string;
}


export function Empty({ header, description, className }: EmptyNotificationProps) {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-10 text-neutral-700 ${className}`}>
            <h3 className="text-lg font-semibold text-neutral-700">{header}</h3>
            {description && <p className="text-sm mt-1">{description}</p>}
        </div>
    );
}