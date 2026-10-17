import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export function QrFrame({
  value,
  size = 176,
  className,
  caption,
  muted,
}: {
  value: string;
  size?: number;
  className?: string;
  caption?: string;
  muted?: boolean;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-2xl border border-border bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.35)]",
          muted && "opacity-40",
        )}
      >
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          bgColor="#ffffff"
          fgColor="#10201b"
          marginSize={0}
        />
      </div>
      {caption && (
        <p className="text-center text-[11.5px] leading-snug text-muted-foreground">{caption}</p>
      )}
    </div>
  );
}
