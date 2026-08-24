'use client';

import L from 'leaflet';
import { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, GeoJSON } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { type MapPickerProps } from './map-picker';

// `@types/leaflet` đã có sẵn trong dự án — dùng kiểu thật thay cho `any`, để
// gọi nhầm phương thức trên map/marker là báo lỗi ngay lúc biên dịch.
import type {
  LeafletEvent,
  LeafletEventHandlerFnMap,
  LeafletMouseEvent,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from 'leaflet';


const DEFAULT_CENTER: [number, number] = [16.0544, 108.2022]; // Đà Nẵng
const DEFAULT_MAP_ZOOM = 11.5;

// Icon ghim vị trí (giống dự án cũ)
const customIcon = L.divIcon({
  className: '',
  html: `
    <div style="position: relative; width: 32px; height: 42px;">
      <div style="
        position: absolute;
        left: 3px;
        top: 2px;
        width: 26px;
        height: 26px;
        border-radius: 50% 50% 50% 0;
        background: #0b5ed7;
        border: 3px solid #ffffff;
        box-shadow: 0 10px 22px rgba(11, 94, 215, 0.35);
        transform: rotate(-45deg);
        display: grid;
        place-items: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #111111;
          transform: rotate(45deg);
        "></div>
      </div>
    </div>
  `,
  iconSize: [32, 42] as [number, number],
  iconAnchor: [16, 42] as [number, number],
  popupAnchor: [0, -42] as [number, number],
});

// Component cập nhật trung tâm bản đồ
function MapViewUpdaterInner({
  center,
  zoom = DEFAULT_MAP_ZOOM,
  useMap,
}: {
  center: [number, number];
  zoom?: number;
  useMap: () => LeafletMap;
}) {
  const map = useMap();
  useEffect(() => {
    window.setTimeout(() => map.invalidateSize(), 0);
    map.flyTo(center, zoom, { animate: true, duration: 0.8 });
  }, [center, zoom, map]);
  return null;
}

// Component xử lý sự kiện click trên bản đồ
function MapEventsHandler({
  onChangeLocation,
  useMapEvents,
}: {
  onChangeLocation?: (lat: number, lng: number) => void;
  useMapEvents: (handlers: LeafletEventHandlerFnMap) => LeafletMap;
}) {
  useMapEvents({
    click(e) {
      onChangeLocation?.((e as LeafletMouseEvent).latlng.lat, (e as LeafletMouseEvent).latlng.lng);
    },
  });
  return null;
}

export default function MapPickerClient({ latitude, longitude, onChangeLocation, className = '', readOnly = false, zoom = DEFAULT_MAP_ZOOM, label, showDaNangBoundary }: MapPickerProps) {
  const [mapLayerType, setMapLayerType] = useState<"osm" | "satellite">("osm");
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geoData, setGeoData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showDaNangBoundary) {
      fetch('/geo/danang-outline.json')
        .then(res => res.json())
        .then(data => {
          setGeoData(data);
        })
        .catch(err => console.error("Could not load Da Nang GeoJSON", err));
    }
  }, [showDaNangBoundary]);

  // Vị trí trung tâm: ưu tiên vị trí hiện tại nếu có, nếu không thì dùng mặc định
  const centerPosition: [number, number] = (latitude !== null && longitude !== null) 
    ? [latitude, longitude] 
    : DEFAULT_CENTER;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLayersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const markerEventHandlers = useMemo(
    () => ({
      dragend(e: LeafletEvent) {
        if (readOnly || !onChangeLocation) return;
        const marker = e.target as LeafletMarker | null;
        if (marker !== null) {
          const latLng = marker.getLatLng();
          onChangeLocation(latLng.lat, latLng.lng);
        }
      },
      click(e: LeafletEvent) {
        const marker = e.target as LeafletMarker | null;
        if (marker !== null) {
          const latLng = marker.getLatLng();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const map = (marker as any)._map;
          if (map) {
            map.flyTo(latLng, Math.max(map.getZoom(), 15), { animate: true, duration: 0.8 });
          }
        }
      }
    }),
    [onChangeLocation, readOnly],
  );

  return (
    <div className={`w-full h-[300px] relative rounded-md border border-line overflow-hidden ${className}`}>
      {/* Nút chuyển đổi lớp bản đồ */}
      <div
        ref={dropdownRef}
        className="absolute top-2 right-2 flex flex-col items-end gap-2 text-xs"
        style={{ zIndex: 1000 }}
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className="w-9 h-9 bg-white hover:bg-slate-50 border border-slate-200 rounded shadow-md flex items-center justify-center cursor-pointer transition text-navy"
            title="Lớp bản đồ"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>

          {isLayersOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-xl py-1 z-[1100] text-left">
              <button
                type="button"
                onClick={() => { setMapLayerType("osm"); setIsLayersOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs transition ${
                  mapLayerType === "osm" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50 font-semibold"
                }`}
              >
                🗺️ Bản đồ (Google)
              </button>
              <button
                type="button"
                onClick={() => { setMapLayerType("satellite"); setIsLayersOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs transition ${
                  mapLayerType === "satellite" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-700 hover:bg-slate-50 font-semibold"
                }`}
              >
                🛰️ Vệ tinh
              </button>
            </div>
          )}
        </div>
      </div>

      <MapContainer
        center={centerPosition}
        zoom={zoom}
        className="w-full h-full z-0"
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          attribution="&copy; Google Maps"
          maxZoom={21}
          maxNativeZoom={20}
          url={
            mapLayerType === "osm"
              ? "https://mt1.google.com/vt/lyrs=m&hl=vi&gl=VN&x={x}&y={y}&z={z}"
              : "https://mt1.google.com/vt/lyrs=y&hl=vi&gl=VN&x={x}&y={y}&z={z}"
          }
        />
        
        <MapViewUpdaterInner center={centerPosition} zoom={zoom} useMap={useMap} />
        {!readOnly && <MapEventsHandler onChangeLocation={onChangeLocation} useMapEvents={useMapEvents} />}
        
        {latitude !== null && longitude !== null && (
          <Marker
            position={[latitude, longitude]}
            icon={customIcon}
            draggable={!readOnly}
            eventHandlers={markerEventHandlers}
          >
            <Popup>
              <strong>{label || "Vị trí đã chọn"}</strong>
              {!readOnly && <p className="text-sm mt-1">Kéo thả để di chuyển, hoặc nhấp vào bản đồ để chọn lại.</p>}
            </Popup>
          </Marker>
        )}
        
        {showDaNangBoundary && geoData && (
          <GeoJSON 
            data={geoData} 
            style={{
              color: '#0b5ed7',
              weight: 2,
              fillColor: 'transparent',
              dashArray: '5, 5'
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
