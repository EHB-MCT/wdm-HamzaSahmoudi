import "./GenreChart.css";
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function GenreChart({ games = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const counts = {};
    games.forEach((g) => {
      counts[g.genre] = (counts[g.genre] || 0) + 1;
    });

    const oldChart = Chart.getChart(canvas);
    if (oldChart) oldChart.destroy();

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: Object.keys(counts),
        datasets: [
          {
            label: "Games",
            data: Object.values(counts),
            backgroundColor: "#4f46e5",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
      },
    });
  }, [games]);

  return <canvas ref={canvasRef} className="chart" />;
}
