import React from "react";

interface MiniSparklineProps {
  trend?: "up" | "down" | "neutral";
  className?: string;
  width?: number;
  height?: number;
}

export default function MiniSparkline({
  trend = "up",
  className = "",
  width = 56,
  height = 22,
}: MiniSparklineProps) {
  const isUp = trend === "up";
  const strokeColor = isUp ? "#10B981" : "#EF4444";
  const fillGradientId = isUp ? "sparkline-green-grad" : "sparkline-red-grad";

  // Pre-calculated smooth bezier curves for authentic financial market looks
  const pathD = isUp
    ? `M 2,17 Q 14,19 24,11 T 42,8 T 54,3`
    : `M 2,4 Q 14,3 26,11 T 42,14 T 54,19`;

  const fillD = isUp
    ? `M 2,17 Q 14,19 24,11 T 42,8 T 54,3 L 54,${height} L 2,${height} Z`
    : `M 2,4 Q 14,3 26,11 T 42,14 T 54,19 L 54,${height} L 2,${height} Z`;

  const lastPoint = isUp ? { x: 54, y: 3 } : { x: 54, y: 19 };

  return (
    <div
      className={`inline-flex items-center shrink-0 select-none ${className}`}
      title={isUp ? "Xu hướng tăng" : "Xu hướng điều chỉnh"}
      aria-hidden="true"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="sparkline-green-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="sparkline-red-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#${fillGradientId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2"
          fill={strokeColor}
          className={isUp ? "animate-pulse" : ""}
        />
      </svg>
    </div>
  );
}
