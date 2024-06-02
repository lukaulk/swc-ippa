import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface RadarGraficoProps {
  data: number[];
  labels: string[];
  width: number;
  height: number;
}

const RadarGrafico: React.FC<RadarGraficoProps> = ({ data, labels, width, height }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            datasets: [
              {
                data: data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)',
                  'rgba(255, 159, 64, 0.7)',
                ],
              },
            ],
            labels: labels,
          },
          options: {
            responsive: false, // Disable responsive behavior
            maintainAspectRatio: false, // Disable aspect ratio
          },
        });
      }
    }
  }, [data, labels, width, height]);

  return <canvas ref={chartRef} width={width} height={height} />;
};

export default RadarGrafico;
