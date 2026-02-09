"use client";

import { useMemo } from "react";

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    status?: 'good' | 'moderate' | 'bad';
}

export default function UserProfileMetricSparkline({ 
    data, 
    width = 80, 
    height = 40, 
    status = 'good' 
}: SparklineProps) {

    const colors = {
        good: "#359160",
        moderate: "#FF9249",
        bad: "#FF392B"
    }

    const strokeColor = colors[status];

    const { pathData, lastX, lastY } = useMemo(() => {
        if (!data || data.length < 2) return { pathData: "", lastX: 0, lastY: 0 };

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const padding = 6;
        const innerHeight = height - padding * 2;

        const points = data.map((val, i) => ({
            x: (i / (data.length - 1)) * width,
            y: padding + (innerHeight - ((val - min) / range) * innerHeight)
        }));

        // Create a smooth curve using Cubic Bezier points
        // M x,y starts the path, then C (controlPoint1) (controlPoint2) (targetPoint)
        let d = `M ${points[0].x},${points[0].y}`;
        
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const centerX = (curr.x + next.x) / 2;
            d += ` C ${centerX},${curr.y} ${centerX},${next.y} ${next.x},${next.y}`;
        }

        return {
            pathData: d,
            lastX: points[points.length - 1].x,
            lastY: points[points.length - 1].y
        };
    }, [data, width, height]);

    if (!pathData) return null;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Soft Shadow Glow */}
            <path
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-20 blur-[1.5px]"
            />
            {/* Main Smooth Line */}
            <path
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* End Indicator Dot */}
            <circle 
                cx={lastX} 
                cy={lastY} 
                r="3.5" 
                fill={strokeColor} 
                className="drop-shadow-sm"
            />
        </svg>
    )
}