'use client';

import React, { useState, useEffect, useMemo, useRef } from "react";

import "leaflet/dist/leaflet.css";

// Ranh giới phường nằm ở public/geo/, KHÔNG import tĩnh. Import tĩnh sẽ nhét
// nguyên file JSON vào bundle client — trước đây là chunk 7.4 MB khiến
// /admin và /admin/properties có First Load JS 1.79 MB. Fetch lúc chạy thì
// trình duyệt cache được và phần còn lại của trang admin tương tác được ngay.
const WARDS_GEOJSON_URL = "/geo/danang-wards.json";

// Basic SVG Icons
const LayersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
);
const ChevronUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
);

interface PropertyLocation {
  id: string;
  title: string;
  address: string;
  price: string;
  image: string;
  lat: number;
  lng: number;
  status?: string;
  categoryName?: string;
}

interface AdminMapProps {
  properties: PropertyLocation[];
}

export function AdminMap({ properties }: AdminMapProps) {
  const center: [number, number] = [16.0544, 108.2022];

  const [showSurge, setShowSurge] = useState(true);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  // Bỏ state chọn lớp bản đồ: TileLayer đang hardcode ảnh vệ tinh và dropdown
  // chọn lớp đã gỡ, nên hai state này chỉ còn là code chết.
  
  const [activeWard, setActiveWard] = useState<{name: string, center: [number, number]} | null>(null);
  
  const geoJsonRef = useRef<any>(null);

  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(WARDS_GEOJSON_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then(setGeoData)
      .catch((err) => {
        // Huỷ khi unmount là bình thường, không phải lỗi thật.
        if (err?.name !== "AbortError") setGeoData({ type: "FeatureCollection", features: [] });
      });
    return () => controller.abort();
  }, []);

  // Pre-calculate properties per ward
  const wardData = useMemo(() => {
    const dataMap = new Map<string, PropertyLocation[]>();
    const features = geoData?.features ?? [];

    features.forEach((feature: any) => {
      const wardName = feature.properties?.ten_xa || "";
      const items: PropertyLocation[] = [];
      
      properties.forEach(p => {
        const address = p.address.toLowerCase();
        const cleanWard = wardName.toLowerCase().replace('phường ', '').replace('xã ', '');
        if (cleanWard && address.includes(cleanWard)) {
          items.push(p);
        }
      });

      dataMap.set(wardName, items);
    });
    return dataMap;
  }, [properties, geoData]);

  const [leaflet, setLeaflet] = useState<{
    MapContainer: any;
    TileLayer: any;
    GeoJSON: any;
    Popup: any;
    Marker: any;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("leaflet"),
      import("react-leaflet")
    ]).then(([L, mod]) => {
      if (!cancelled) {
        const DefaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        setLeaflet({
          MapContainer: mod.MapContainer,
          TileLayer: mod.TileLayer,
          GeoJSON: mod.GeoJSON,
          Popup: mod.Popup,
          Marker: mod.Marker,
        });
      }
    });

    const style = document.createElement("style");
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      
      .property-popup .leaflet-popup-content-wrapper { padding: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
      .property-popup .leaflet-popup-content { margin: 0; }
      .property-popup .leaflet-popup-tip-container { display: none; }
    `;
    document.head.appendChild(style);

    return () => {
      cancelled = true;
      document.head.removeChild(style);
    };
  }, []);

  if (!leaflet) {
    return (
      <div className="w-full h-full min-h-[500px] bg-slate-50 flex items-center justify-center rounded-xl animate-pulse">
        <span className="text-slate-400 text-[13px] font-bold uppercase">Đang tải bản đồ...</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, GeoJSON, Popup, Marker } = leaflet;

  const styleFeature = (feature: any) => {
    const wardName = feature.properties?.ten_xa;
    const count = wardData.get(wardName)?.length || 0;

    let fillColor = "#ffffff"; // Trắng đục
    let fillOpacity = 0.3; // Fill trắng mờ
    let color = "#ffffff"; // Viền trắng
    const weight = 1.5;
    let opacity = 0.6; // Viền trắng mờ

    if (count >= 5) {
      fillColor = "#991b1b";
      fillOpacity = 0.45;
      color = "white"; opacity = 1;
    } else if (count >= 2) {
      fillColor = "#ef4444";
      fillOpacity = 0.35;
      color = "white"; opacity = 1;
    } else if (count >= 1) {
      fillColor = "#fb923c";
      fillOpacity = 0.25;
      color = "white"; opacity = 1;
    }

    return {
      fillColor,
      fillOpacity,
      color,
      weight,
      dashArray: "",
      opacity
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const wardName = feature.properties?.ten_xa || "Chưa rõ";
    const count = wardData.get(wardName)?.length || 0;

    layer.bindTooltip(
      `<div style="text-align: center;">
         <strong style="color: #0b2545; font-size: 13px; text-transform: uppercase;">${wardName}</strong><br/>
         <span style="color: #64748b; font-size: 12px;">${count} Bất động sản</span>
       </div>`,
      { sticky: true, opacity: 0.95 }
    );

    layer.on({
      click: (e: any) => {
        if (!showSurge) return;
        const center = e.target.getBounds().getCenter();
        setActiveWard({
          name: feature.properties.ten_xa,
          center: [center.lat, center.lng]
        });
      }
    });
  };

  const activeWardItems = activeWard ? wardData.get(activeWard.name) || [] : [];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border-none relative z-0 bg-white">
      {/* Nút bật/tắt Layer */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-[1000]">
        <button
          onClick={() => {
            setShowSurge(!showSurge);
            if (showSurge) setActiveWard(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold shadow-lg transition-all text-[13px] ${
            showSurge
              ? "bg-navy text-white"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <LayersIcon />
          {showSurge ? "Đang bật Điểm nóng" : "Bật Điểm nóng"}
        </button>
      </div>

      {showSurge && (
        <div className="absolute bottom-6 right-4 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100 text-[13px] min-w-[150px] transition-all">
          <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => setIsLegendOpen(!isLegendOpen)}>
            <p className="font-bold text-navy uppercase tracking-wide text-[11px]">
              Mật độ tin đăng
            </p>
            {isLegendOpen ? <ChevronDown /> : <ChevronUp />}
          </div>
          {isLegendOpen && (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded" style={{ background: "#991b1b", opacity: 0.45 }}></div>
                <span className="font-medium text-slate-600">&ge; 5 BĐS</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded" style={{ background: "#ef4444", opacity: 0.35 }}></div>
                <span className="font-medium text-slate-600">2 - 4 BĐS</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded" style={{ background: "#fb923c", opacity: 0.25 }}></div>
                <span className="font-medium text-slate-600">1 BĐS</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded border border-slate-300" style={{ background: "rgba(255, 255, 255, 0.5)" }}></div>
                <span className="font-medium text-slate-600">0 BĐS</span>
              </div>
            </div>
          )}
        </div>
      )}

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url={"https://mt1.google.com/vt/lyrs=y&hl=vi&gl=VN&x={x}&y={y}&z={z}"}
        />

        {showSurge && geoData && (
          <GeoJSON
            // react-leaflet không cập nhật lại lớp GeoJSON khi prop `data` đổi,
            // nên cần key để nó dựng lại khi dữ liệu về / khi wardData đổi màu.
            key={`wards-${geoData.features?.length ?? 0}`}
            ref={geoJsonRef}
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}

        {showSurge && activeWard && (
          <Popup position={activeWard.center} onClose={() => setActiveWard(null)} className="property-popup">
            <div className="p-4 w-[280px]">
              <strong className="text-[14px] text-navy border-b border-line pb-2 mb-3 block font-bold uppercase">
                {activeWard.name} ({activeWardItems.length} BĐS)
              </strong>
              {activeWardItems.length > 0 ? (
                <div className="max-h-[220px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {activeWardItems.map((p, idx) => (
                    <a key={idx} href={`/admin/properties/${p.id}`} className="block bg-slate-50 p-2 rounded-lg border border-line hover:border-gold hover:shadow-sm transition-all group">
                      <div className="flex gap-3">
                        <img src={p.image} alt={p.title} className="w-14 h-14 object-cover rounded-md shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-navy text-[12px] leading-tight line-clamp-2 group-hover:text-[#C99224] transition-colors">{p.title}</h4>
                          <div className="font-bold text-[#C99224] text-[12px] mt-1">{p.price}</div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                              p.status === 'Đang mở bán' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-[12px] text-center py-2">Không có dữ liệu bất động sản</p>
              )}
            </div>
          </Popup>
        )}
          
        {/* Nếu không bật điểm nóng, hiện marker chi tiết cho từng bđs */}
        {!showSurge && properties.map((p, i) => (
          <Marker key={p.id || i} position={[p.lat, p.lng]}>
            <Popup className="property-popup">
              <div className="p-3 w-[220px]">
                <div className="h-[120px] bg-gray-100 relative mb-3 rounded-md overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-navy text-white text-[10px] px-2 py-1 rounded font-bold shadow">{p.status}</div>
                </div>
                <h3 className="font-bold text-navy text-[13px] leading-tight mb-1">{p.title}</h3>
                <p className="text-[11px] text-muted mb-2 line-clamp-1">{p.address}</p>
                <div className="text-[14px] font-bold text-[#C99224]">{p.price}</div>
                <a href={`/admin/properties/${p.id}`} className="mt-3 block w-full text-center bg-navy hover:bg-navy/90 text-white py-1.5 rounded text-[12px] font-bold transition-colors">
                  Xem chi tiết
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


