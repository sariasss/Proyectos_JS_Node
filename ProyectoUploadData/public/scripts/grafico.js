export const createChart = (recycleSize, uploadSize) => {
    let canvas = document.getElementById("miCanva");
    const div = document.getElementById("chart");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "miCanva";
      canvas.width = 400;
      canvas.height = 200;
      div.appendChild(canvas);
    }
  
    const ctx = canvas.getContext("2d");
  
    if (!canvas.chart) {
      canvas.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Papelera", "Archivos subidos"],
          datasets: [
            {
              label: "Espacio ocupado (bytes)",
              data: [recycleSize, uploadSize],
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)",
                "rgba(54, 162, 235, 0.8)",
              ],
              borderColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 10,
                },
              },
            },
            x: {
              ticks: {
                font: {
                  size: 10,
                },
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 10,
                },
              },
            },
          },
        },
      });
    }
  };
  