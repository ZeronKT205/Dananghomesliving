'use client';
import dynamic from 'next/dynamic';

export interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChangeLocation: (lat: number, lng: number) => void;
  className?: string;
}

const MapPickerClient = dynamic(() => import('./map-picker-client'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[240px] bg-slate-50 flex items-center justify-center rounded-md border border-line text-muted text-sm">
      Đang tải bản đồ...
    </div>
  ),
});

export function MapPicker(props: MapPickerProps) {
  return <MapPickerClient {...props} />;
}
