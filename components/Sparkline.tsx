'use client';

import { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export default function Sparkline({ data, color = '#10b981', height = 20 }: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Create chart
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          borderWidth: 1.5,
          fill: false,
          pointRadius: 0,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        interaction: {
          mode: 'index',
          intersect: false,
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, color]);

  return <canvas ref={canvasRef} height={height} className="w-full" />;
}
