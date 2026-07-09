import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

function Charts({ atsScore, semanticScore, overallScore }) {
  const doughnutData = {
    labels: ["ATS Score", "Remaining"],
    datasets: [
      {
        data: [atsScore, 100 - atsScore],
        backgroundColor: ["#1976d2", "#eeeeee"],
      },
    ],
  };

  const barData = {
    labels: ["ATS", "Semantic", "Overall"],
    datasets: [
      {
        label: "Resume Analysis",
        data: [atsScore, semanticScore, overallScore],
      },
    ],
  };

  return (
    <div>
      <h3>📊 Resume Analytics</h3>

      <div
        style={{
          display: "flex",
          gap: 50,
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        <div
          style={{
            width: 300,
          }}
        >
          <Doughnut data={doughnutData} />
        </div>

        <div
          style={{
            width: 450,
          }}
        >
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}

export default Charts;
