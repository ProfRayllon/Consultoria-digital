import qrcode from "qrcode-generator";
import { useMemo } from "react";

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

// QR real (escaneável), desenhado como um único path SVG.
export function QrCode({ value, size = 132, className = "" }: QrCodeProps) {
  const { path, count } = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
      }
    }
    return { path: d, count: n };
  }, [value]);

  return (
    <svg
      viewBox={`-2 -2 ${count + 4} ${count + 4}`}
      width={size}
      height={size}
      className={`rounded-md bg-white ${className}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR code"
    >
      <path d={path} fill="#0b1220" />
    </svg>
  );
}
