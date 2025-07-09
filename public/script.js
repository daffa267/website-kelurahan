// Data contoh, silakan ganti sesuai kebutuhan
            const ctx = document.addEventListener(
              "DOMContentLoaded",
              function () {
                // Inisialisasi chart
                const ctx = document
                  .getElementById("population-chart")
                  .getContext("2d");
                const populationChart = new Chart(ctx, {
                  type: "line",
                  data: {
                    labels: ["2020", "2021", "2022", "Semester 1 - 2023"],
                    datasets: [
                      {
                        label: "Jumlah Penduduk",
                        data: [5200, 5100, 5000, 4950],
                        borderColor: "#2989d8",
                        backgroundColor: "rgba(41, 137, 216, 0.1)",
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: "#2989d8",
                        pointRadius: 5,
                        pointHoverRadius: 7,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: 4900,
                        max: 5250,
                        ticks: {
                          stepSize: 50,
                          callback: function (value) {
                            return value.toLocaleString();
                          },
                        },
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return (
                              "Jumlah Penduduk: " +
                              context.parsed.y.toLocaleString()
                            );
                          },
                        },
                      },
                    },
                  },
                });
              }
            );