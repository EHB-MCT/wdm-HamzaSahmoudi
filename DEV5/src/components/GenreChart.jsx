import "./GenreChart.css";
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function GenreChart({ games = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const genres = {};
    for (let i = 0; i < games.length; i++) {
      const g = games[i];
      if (!genres[g.genre]) {
        genres[g.genre] = 1;
      } else {
        genres[g.genre]++;
      }
    }

    const old = Chart.getChart(canvasRef.current);
    if (old) old.destroy();

    new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: Object.keys(genres),
        datasets: [
          {
            label: "Games",
            data: Object.values(genres),
            backgroundColor: "purple",
          },
        ],
      },
    });
  }, [games]);

  return <canvas ref={canvasRef} className="chart" />;
}
