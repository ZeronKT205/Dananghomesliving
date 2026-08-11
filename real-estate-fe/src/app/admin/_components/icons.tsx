import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Một viewBox, một độ dày nét cho toàn bộ CMS — icon lệch tông là thứ
 *  làm giao diện quản trị trông chắp vá nhanh nhất. */
function Ic({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IcDashboard = (p: IconProps) => (
  <Ic {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </Ic>
);

export const IcInbox = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 12h4l2 3h6l2-3h4" />
    <path d="M5.5 5h13l2.5 7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5l2.5-7Z" />
  </Ic>
);

export const IcBuilding = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" />
    <path d="M14 10h4a2 2 0 0 1 2 2v9" />
    <path d="M3 21h18M7.5 8h3M7.5 12h3M7.5 16h3M17 14h.5M17 17.5h.5" />
  </Ic>
);

export const IcNews = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5V18a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5.5Z" />
    <path d="M16 8h2.5A1.5 1.5 0 0 1 20 9.5V18a2 2 0 0 1-2 2" />
    <path d="M7.5 8h5M7.5 11.5h5M7.5 15h3" />
  </Ic>
);

export const IcSettings = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </Ic>
);

export const IcMenu = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Ic>
);

export const IcClose = (p: IconProps) => (
  <Ic {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Ic>
);

export const IcExternal = (p: IconProps) => (
  <Ic {...p}>
    <path d="M15 3h6v6M10 14 21 3" />
    <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
  </Ic>
);

export const IcPlus = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 5v14M5 12h14" />
  </Ic>
);

export const IcSearch = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Ic>
);

export const IcPhone = (p: IconProps) => (
  <Ic {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </Ic>
);

export const IcMail = (p: IconProps) => (
  <Ic {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-9.4 6.3a2 2 0 0 1-2.2 0L2 7" />
  </Ic>
);

export const IcClock = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Ic>
);

export const IcCheck = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </Ic>
);

export const IcAlert = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 3.5 1.8 20.5h20.4L12 3.5Z" />
    <path d="M12 10v4M12 17.5h.01" />
  </Ic>
);

export const IcArrowRight = (p: IconProps) => (
  <Ic {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Ic>
);

export const IcLayers = (p: IconProps) => (
  <Ic {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5M3 16.5 12 21l9-4.5" />
  </Ic>
);

export const IcImages = (p: IconProps) => (
  <Ic {...p}>
    <rect x="3" y="4" width="18" height="15" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="m4 17 5-5 4 4 3-2.5 4 3.5" />
  </Ic>
);

export const IcEye = (p: IconProps) => (
  <Ic {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Ic>
);

export const IcEdit = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    <path d="m14.5 7.5 2 2" />
  </Ic>
);

export const IcTrash = (p: IconProps) => (
  <Ic {...p}>
    <path d="M4 7h16M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7" />
    <path d="M6.5 7 7.5 20h9L17.5 7M10.5 11v5M13.5 11v5" />
  </Ic>
);

export const IcPin = (p: IconProps) => (
  <Ic {...p}>
    <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.8" />
  </Ic>
);

export const IcTag = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 12.5V4.5A1.5 1.5 0 0 1 4.5 3h8L21 11.5 12.5 20 3 12.5Z" />
    <circle cx="7.5" cy="7.5" r="1.3" />
  </Ic>
);

export const IcGlobe = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.5 9h17M3.5 15h17" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
  </Ic>
);

export const IcBed = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 18v-8M3 13h18v5M21 18v-4a2 2 0 0 0-2-2h-8v-2a2 2 0 0 0-2-2H5" />
  </Ic>
);
