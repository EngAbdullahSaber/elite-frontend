'use client';

import Map, { Marker } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Load RTL plugin for proper Arabic shaping
maplibregl.setRTLTextPlugin(
    'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',
    true // Lazy load
);

type Props = {
    lat: number;
    lng: number;
    onChange: (coords: { lat: number; lng: number }) => void;
};

export default function LocationMap({ lat, lng, onChange }: Props) {
    return (
        <Map

            initialViewState={{
                latitude: lat,
                longitude: lng,
                zoom: 8,
            }}
            style={{ width: '100%', height: '600px', borderRadius: 12 }}
            mapStyle="https://tiles.openfreemap.org/styles/liberty"
            onClick={(e) => {
                const { lat, lng } = e.lngLat;
                onChange({ lat, lng });
            }}

            dragRotate={false}
        >
            <Marker latitude={lat} longitude={lng} />
        </Map>
    );
}
