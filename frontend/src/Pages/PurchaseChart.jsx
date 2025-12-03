import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PurchaseChart() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Create 5 years back + 5 years ahead
    const getYearRange = () => {
        const current = new Date().getFullYear();
        const years = [];
        for (let i = current - 5; i <= current + 5; i++) {
            years.push(i);
        }
        return years;
    };

    const years = getYearRange();

    useEffect(() => {
        fetchChartData(year);
    }, [year]);

    const fetchChartData = async (selectedYear) => {
        try {
            setLoading(true);

            // ✅ FIXED: You forgot backticks `
            const res = await axios.get(
                `http://localhost:8000/api/purchase-chart-data?year=${selectedYear}`
            );

            if (!Array.isArray(res.data)) {
                console.error("Invalid API response format");
                setLoading(false);
                return;
            }

            const labels = res.data.map(
                (item) => `${selectedYear}-${String(item.month).padStart(2, "0")}`
            );

            const totals = res.data.map((item) => item.total);

            setChartData({
                labels,
                datasets: [
                    {
                        label: `Monthly Purchases (₹) - ${selectedYear}`,
                        data: totals,
                        backgroundColor: "rgba(99, 102, 241, 0.4)",
                        borderColor: "rgba(99, 102, 241, 1)",
                        borderWidth: 2,
                        borderRadius: 12,
                        barThickness: 80,
                        maxBarThickness: 100,
                    },
                ],
            });

            setLoading(false);
        } catch (error) {
            console.error("Error loading chart:", error);
            setLoading(false);
        }
    };

    // Plugin to draw month names inside bars
    const monthLabelPlugin = {
        id: "monthLabelPlugin",
        afterDatasetsDraw: (chart) => {
            const {
                ctx,
                data,
                scales: { x, y },
            } = chart;

            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "bold 13px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const dataset = data.datasets[0];

            dataset.data.forEach((value, index) => {
                if (!value) return;

                const xPos = x.getPixelForValue(index);
                const barTop = y.getPixelForValue(value);
                const barBottom = y.getPixelForValue(0);

                const yPos = barTop + (barBottom - barTop) * 0.3;

                const labelParts = data.labels[index]?.split("-");
                const monthIndex = labelParts?.[1]
                    ? parseInt(labelParts[1], 10) - 1
                    : -1;

                const monthName =
                    monthIndex >= 0 && monthIndex < 12 ? monthNames[monthIndex] : "";

                if (monthName) {
                    ctx.fillText(monthName, xPos, yPos);
                }
            });

            ctx.restore();
        },
    };

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 20 },
            },
            plugins: {
                legend: {
                    position: "top",
                    labels: { font: { size: 14 } },
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `₹ ${ctx.raw.toLocaleString("en-IN")}`,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => `₹ ${value.toLocaleString("en-IN")}`,
                    },
                    grid: { color: "rgba(0,0,0,0.05)" },
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        display: true,
                        callback: (value, index) =>
                            chartData?.labels[index] || "",
                        font: { size: 12, weight: "bold" },
                        color: "#374151",
                    },
                },
            },
        }),
        [chartData]
    );

    if (loading || !chartData) {
        return (
            <div className="max-w-5xl mx-auto mt-6 bg-white p-8 rounded-2xl shadow-lg border">
                <p className="text-center text-lg py-12">Loading chart...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-6 bg-white p-8 rounded-2xl shadow-lg ">
            <div className="flex justify-between items-center mb-6 h-0.5" >
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    📊 Monthly Purchase Chart
                </h2>

                <select
                    className="border rounded-xl px-4 py-2 text-lg shadow-sm"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            <p className="text-gray-600 mb-4">
                Showing purchase data for <strong>{year}</strong>
            </p>

            <div style={{ height: "370px" }}>
                <Bar data={chartData} options={options} plugins={[monthLabelPlugin]} />
            </div>
        </div>
    );
}
