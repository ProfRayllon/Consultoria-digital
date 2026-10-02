import { useEffect, useState } from "react";
import { ouvirCursor } from "./motor";
import type { CursorEstado } from "./motor";

// Seta de mouse no desktop; círculo de toque no celular.
export function Cursor({ tipo }: { tipo: "seta" | "toque" }) {
  const [c, setC] = useState<CursorEstado>({ x: -60, y: -60, visivel: false, clique: 0 });
  useEffect(() => ouvirCursor(setC), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{
        transform: `translate(${c.x}px, ${c.y}px)`,
        opacity: c.visivel ? 1 : 0,
        transition: "transform 680ms cubic-bezier(.45,.05,.2,1), opacity 300ms",
      }}
    >
      {c.clique > 0 ? <span key={c.clique} className="cursor-onda" /> : null}
      {tipo === "seta" ? (
        <svg width="26" height="26" viewBox="0 0 24 24" className="-translate-x-[3px] -translate-y-[2px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.55)]">
          <path d="M4 2.5 19.5 13l-7 1.2 3.9 7.3-2.6 1.4-3.9-7.3L4.8 20Z" fill="#ffffff" stroke="#0b1220" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="block h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 bg-white/25 shadow-[0_0_0_6px_rgba(255,255,255,0.12)]" />
      )}
    </div>
  );
}
