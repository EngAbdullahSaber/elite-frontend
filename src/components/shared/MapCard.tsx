type MapCardProps = {
    title?: string;
    subTitle?: string;
    lat: number | null;
    lng: number | null;
    className?: string; // 👈 إضافة جديدة
};

export default function MapCard({ title, subTitle, lat, lng, className = '' }: MapCardProps) {
    const isValidLocation = typeof lat === 'number' && typeof lng === 'number';

    return (
        <div
            className={`bg-white p-1 rounded-md shadow-lg overflow-hidden border border-gray-200/60 text-center h-full flex flex-col ${className}`}
        >
            {title && <h2 className="text-2xl md:text-xl font-bold text-gray-800 mb-3">{title}</h2>}
            {subTitle && <p className="text-gray-600 mb-8">{subTitle}</p>}
            <div className="flex-grow">
                {isValidLocation ? (
                    <iframe
                        className="w-full h-full rounded-lg border-0"
                        src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                        allowFullScreen
                        loading="lazy"
                    />
                ) : (
                    <p className="text-gray-500">لا تتوفر معلومات الموقع حالياً.</p>
                )}
            </div>
        </div>
    );
}
