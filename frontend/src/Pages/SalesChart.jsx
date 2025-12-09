import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../Api";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function SalesChart() {
    const [chartData, setChartData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // ⭐ Generate Year Options Dynamically
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 5;
        const endYear = currentYear + 5;

        const years = [];
        for (let y = startYear; y <= endYear; y++) {
            years.push(y);
        }
        return years;
    };

    const years = generateYearOptions();

    // ⭐ Convert "2025-11" => "November"
    const convertToMonthName = (monthStr) => {
        const [year, month] = monthStr.split("-");
        return new Date(year, month - 1).toLocaleString("en-US", {
            month: "long",
        });
    };

    // ⭐ Fetch Chart Data by Year
    useEffect(() => {
        api
            .get(`/sales/monthly-summary/${selectedYear}`)
            .then((res) => {
                const data = res.data;

                // Bottom X-axis labels (date)
                const bottomAxisLabels = data.map((d) => d.month);

                // Top labels (month name)
                const monthNameLabels = data.map((d) =>
                    convertToMonthName(d.month)
                );

                

                const totals = data.map((d) => Number(d.total));

                setChartData({
                    labels: bottomAxisLabels, // bottom axis shows YYYY-MM
                    datasets: [
                        {
                            label: `Monthly Sales (₹) - ${selectedYear}`,
                            data: totals,
                            backgroundColor: "rgba(79, 70, 229, 0.7)",
                            borderColor: "rgba(79, 70, 229, 1)",
                            borderWidth: 2,
                            borderRadius: 8,

                            // ⭐ SAFE way: store top labels inside dataset
                            datalabels: {
                                labels: monthNameLabels,
                            },
                        },
                    ],
                });
            })
            .catch((err) => console.log(err));
    }, [selectedYear]);

    if (!chartData)
        return (
            <div className="w-full flex justify-center p-20">
                <p className="text-lg text-gray-600 animate-pulse">Loading chart...</p>
            </div>
        );

    return (
        <div className="p-6 flex justify-center">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg hover:shadow-2xl 
                transition-all duration-300 p-10 border border-gray-200">

                {/* 🔥 Title + Year Filter */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                        📊 Monthly Sales Overview
                    </h2>

                    {/* YEAR DROPDOWN */}
                    <select
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 
                            shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white text-lg"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subtitle */}
                <p className="text-gray-600 mb-8 text-lg">
                    Yearly breakdown for{" "}
                    <span className="font-semibold text-gray-900">{selectedYear}</span>
                </p>

                {/* Chart */}
                <div className="h-[370px]">
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                datalabels: {
                                    anchor: "end",
                                    align: "end",
                                    color: "#111827",
                                    font: {
                                        size: 13,
                                        weight: "bold",
                                    },

                                    // ⭐ FIXED FORMATTER (NO MORE CRASH)
                                    formatter: (_, ctx) => {
                                        const labels =
                                            ctx.dataset.datalabels.labels || [];
                                        return labels[ctx.dataIndex] || "";
                                    },
                                },
                                legend: {
                                    labels: {
                                        font: { size: 14 },
                                        color: "#374151",
                                    },
                                },
                            },
                            scales: {
                                y: {
                                    ticks: { color: "#4B5563" },
                                    grid: { color: "rgba(0,0,0,0.05)" },
                                },
                                x: {
                                    ticks: { color: "#4B5563" },
                                    grid: { display: false },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
