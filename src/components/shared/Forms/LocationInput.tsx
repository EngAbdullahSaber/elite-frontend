'use client';

import dynamic from 'next/dynamic';
import { ReactElement, useEffect, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

const LocationMap = dynamic(() => import('./LocationMap'), {
    ssr: false,
});


async function reverseGeocode(lat: number, lng: number, signal?: AbortSignal): Promise<string> {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`;
        const res = await fetch(url, {
            signal,
            headers: {
                'User-Agent': 'YourAppName/1.0 (your-email@example.com)',
            },
        });
        if (!res.ok) throw new Error('Reverse geocoding failed');
        const data = await res.json();
        return data.display_name || 'عنوان غير معروف';
    } catch (e: any) {
        // If aborted, rethrow to be caught and ignored by caller
        if (e?.name === 'AbortError') throw e;
        return 'تعذر جلب العنوان';
    }
}


type LocationInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>; // this ensures the name is a valid path
};

export type LocationInputType = <T extends FieldValues>(
    props: LocationInputProps<T>
) => ReactElement;

function LocationInput<T extends FieldValues>({ control, name }: LocationInputProps<T>) {
    const {
        field: { value: position, onChange },
    } = useController({
        name,
        control,
    });


    // Position state
    const [address, setAddress] = useState<string>('جاري جلب العنوان...');
    const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
    // Text inputs (editable)
    const [latInput, setLatInput] = useState(position.lat.toFixed(6));
    const [lngInput, setLngInput] = useState(position.lng.toFixed(6));
    const [error, setError] = useState<string>('');


    // Sync text inputs when position changes (e.g., map click)
    useEffect(() => {
        setLatInput(position.lat.toFixed(6));
        setLngInput(position.lng.toFixed(6));
    }, [position]);

    // Fetch address when position changes — race-safe
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchAddress = async () => {
            try {
                setLoadingAddress(true);
                const addr = await reverseGeocode(position.lat, position.lng, controller.signal);
                if (!isMounted) return; // component unmounted
                setAddress(addr);
            } catch (err) {
                if (!isMounted) return;
                // Ignore abort errors; handle real errors gracefully
                setAddress('تعذر جلب العنوان');
            } finally {
                if (isMounted) setLoadingAddress(false);
            }
        };

        fetchAddress();

        return () => {
            isMounted = false;
            controller.abort(); // cancel any in-flight request
        };
    }, [position]);


    // Validate and apply changes when either input updates
    const applyFromInputs = (latStr: string, lngStr: string) => {
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            if (lat < -90 || lat > 90) {
                setError('خط العرض يجب أن يكون بين -90 و 90');
                return;
            }
            if (lng < -180 || lng > 180) {
                setError('خط الطول يجب أن يكون بين -180 و 180');
                return;
            }
            setError('');
            onChange({ lat, lng });
        } else {
            setError('المدخلات غير صالحة، يرجى إدخال أرقام صحيحة');
        }
    };

    return (
        <div className="space-y-4">
            {/* Address and inputs */}
            <div className="text-lg font-semibold text-gray-600 mt-2 md:mt-0">
                {loadingAddress ? 'جاري جلب العنوان...' : `العنوان: ${address}`}
            </div>
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                {/* Selected position summary */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">الموقع المحدد:</label>
                    <span className="text-sm text-gray-700">
                        خط العرض: {position.lat.toFixed(6)} — خط الطول: {position.lng.toFixed(6)}
                    </span>
                </div>

                {/* Inputs with labels + helper + hover tooltip */}
                <div className="flex gap-3 w-full md:w-auto">
                    {/* Latitude */}
                    <div className="flex-1">
                        <label htmlFor="lat" className="block text-xs font-medium text-gray-600 mb-1">
                            خط العرض (Latitude)
                            <span className="ml-1 inline-block align-middle group relative cursor-help">
                                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zM9 9h2v6H9V9zm0-4h2v2H9V5z" />
                                </svg>
                                {/* tooltip */}
                                <span className="pointer-events-none absolute -top-2 left-4 z-10 hidden group-hover:block bg-black/80 text-white text-[11px] rounded px-2 py-1">
                                    شمال/جنوب بالنسبة لخط الاستواء. المدى: -90 إلى 90
                                </span>
                            </span>
                        </label>
                        <input
                            id="lat"
                            type="number"
                            step="0.000001"
                            min={-90}
                            max={90}
                            inputMode="decimal"
                            aria-label="خط العرض"
                            placeholder="مثال: 21.285400"
                            value={latInput}
                            onChange={(e) => {
                                const val = e.target.value;
                                setLatInput(val);
                                applyFromInputs(val, lngInput);
                            }}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    {/* Longitude */}
                    <div className="flex-1">
                        <label htmlFor="lng" className="block text-xs font-medium text-gray-600 mb-1">
                            خط الطول (Longitude)
                            <span className="ml-1 inline-block align-middle group relative cursor-help">
                                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zM9 9h2v6H9V9zm0-4h2v2H9V5z" />
                                </svg>
                                {/* tooltip */}
                                <span className="pointer-events-none absolute -top-2 left-4 z-10 hidden group-hover:block bg-black/80 text-white text-[11px] rounded px-2 py-1">
                                    شرق/غرب بالنسبة لخط الطول 0°. المدى: -180 إلى 180
                                </span>
                            </span>
                        </label>
                        <input
                            id="lng"
                            type="number"
                            step="0.000001"
                            min={-180}
                            max={180}
                            inputMode="decimal"
                            aria-label="خط الطول"
                            placeholder="مثال: 39.237600"
                            value={lngInput}
                            onChange={(e) => {
                                const val = e.target.value;
                                setLngInput(val);
                                applyFromInputs(latInput, val);
                            }}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                </div>
            </div>


            {error && <div className="text-xs text-red-600">{error}</div>}

            <LocationMap
                lat={position.lat}
                lng={position.lng}
                onChange={(coords) => onChange(coords)}
            />

        </div>
    );
}

export default LocationInput;
