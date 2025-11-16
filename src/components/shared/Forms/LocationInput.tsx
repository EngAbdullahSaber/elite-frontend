"use client";

import dynamic from "next/dynamic";
import { ReactElement, useEffect, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
});

async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`;
    const res = await fetch(url, {
      signal,
      headers: {
        "User-Agent": "YourAppName/1.0 (your-email@example.com)",
      },
    });
    if (!res.ok) throw new Error("Reverse geocoding failed");
    const data = await res.json();
    return data.display_name || "عنوان غير معروف";
  } catch (e: any) {
    // If aborted, rethrow to be caught and ignored by caller
    if (e?.name === "AbortError") throw e;
    return "تعذر جلب العنوان";
  }
}

// New function for forward geocoding (search by city name)
async function forwardGeocode(
  query: string,
  signal?: AbortSignal
): Promise<any[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&accept-language=ar&countrycodes=sa&limit=5`;
    const res = await fetch(url, {
      signal,
      headers: {
        "User-Agent": "YourAppName/1.0 (your-email@example.com)",
      },
    });
    if (!res.ok) throw new Error("Forward geocoding failed");
    const data = await res.json();
    return data || [];
  } catch (e: any) {
    if (e?.name === "AbortError") throw e;
    return [];
  }
}

type LocationInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>; // this ensures the name is a valid path
};

export type LocationInputType = <T extends FieldValues>(
  props: LocationInputProps<T>
) => ReactElement;

function LocationInput<T extends FieldValues>({
  control,
  name,
}: LocationInputProps<T>) {
  const {
    field: { value: position, onChange },
  } = useController({
    name,
    control,
  });

  // Position state
  const [address, setAddress] = useState<string>("جاري جلب العنوان...");
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  // Text inputs (editable)
  const [latInput, setLatInput] = useState(position.lat.toFixed(6));
  const [lngInput, setLngInput] = useState(position.lng.toFixed(6));
  const [error, setError] = useState<string>("");

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

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
        const addr = await reverseGeocode(
          position.lat,
          position.lng,
          controller.signal
        );
        if (!isMounted) return; // component unmounted
        setAddress(addr);
      } catch (err) {
        if (!isMounted) return;
        // Ignore abort errors; handle real errors gracefully
        setAddress("تعذر جلب العنوان");
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

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await forwardGeocode(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Select search result
  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      onChange({ lat, lng });
      setSearchQuery(result.display_name);
      setShowResults(false);
      setError("");
    }
  };

  // Validate and apply changes when either input updates
  const applyFromInputs = (latStr: string, lngStr: string) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      if (lat < -90 || lat > 90) {
        setError("خط العرض يجب أن يكون بين -90 و 90");
        return;
      }
      if (lng < -180 || lng > 180) {
        setError("خط الطول يجب أن يكون بين -180 و 180");
        return;
      }
      setError("");
      onChange({ lat, lng });
    } else {
      setError("المدخلات غير صالحة، يرجى إدخال أرقام صحيحة");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Section */}
      <div className="space-y-2">
        <label
          htmlFor="location-search"
          className="block text-sm font-medium text-gray-700"
        >
          ابحث عن المدينة
        </label>
        <div className="relative">
          <input
            id="location-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="اكتب اسم المدينة بالعربية أو الإنجليزية..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />

          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary)]"></div>
            ) : (
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full px-4 py-3 text-right text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                >
                  <div className="font-medium">{result.display_name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {parseFloat(result.lat).toFixed(6)},{" "}
                    {parseFloat(result.lon).toFixed(6)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {showResults &&
            searchResults.length === 0 &&
            searchQuery &&
            !isSearching && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  لم يتم العثور على نتائج
                </div>
              </div>
            )}
        </div>

        {/* Search Help Text */}
        <p className="text-xs text-gray-500">
          ابحث بأسماء المدن مثل "الرياض"، "جدة"، "مكة"، "Riyadh"، "Jeddah" إلخ.
        </p>
      </div>

      {/* Address and inputs */}
      <div className="text-lg font-semibold text-gray-600 mt-2 md:mt-0">
        {loadingAddress ? "جاري جلب العنوان..." : `العنوان: ${address}`}
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
        {/* Selected position summary */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            الموقع المحدد:
          </label>
          <span className="text-sm text-gray-700">
            خط العرض: {position.lat.toFixed(6)} — خط الطول:{" "}
            {position.lng.toFixed(6)}
          </span>
        </div>

        {/* Inputs with labels + helper + hover tooltip */}
        <div className="flex gap-3 w-full md:w-auto">
          {/* Latitude */}
          <div className="flex-1">
            <label
              htmlFor="lat"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              خط العرض (Latitude)
              <span className="ml-1 inline-block align-middle group relative cursor-help">
                <svg
                  className="w-3 h-3 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
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
            <label
              htmlFor="lng"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              خط الطول (Longitude)
              <span className="ml-1 inline-block align-middle group relative cursor-help">
                <svg
                  className="w-3 h-3 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
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

      {/* Full width map container */}
      <div className="w-full">
        <LocationMap
          lat={position.lat}
          lng={position.lng}
          onChange={(coords) => onChange(coords)}
        />
      </div>
    </div>
  );
}

export default LocationInput;
