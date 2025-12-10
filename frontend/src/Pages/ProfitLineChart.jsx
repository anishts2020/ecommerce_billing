import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import api from "../Api";

export default function DualAxisLineChart() {
    const [chartData, setChartData] = useState([
        ["Day", "Sales", "Profit"]
    ]);

    useEffect(() => {
        api.get("/sales-profit-line")
            .then((res) => {
                const rows = res.data.map(item => [
                    "Day " + item.day,
                    Number(item.total_sales),
                    Number(item.profit)
                ]);

                setChartData([
                    ["Day", "Sales", "Profit"],
                    ...rows
                ]);
            })
            .catch(err => console.error("Error loading chart", err));
    }, []);

    const options = {
        title: "Daily Sales & Profit (This Month)",
        curveType: "function",
        pointSize: 6,
        series: {
            0: { targetAxisIndex: 0, color: "#1f77b4" },
            1: { targetAxisIndex: 1, color: "#ff7f0e" },
        },
        vAxes: {
            0: { title: "Total Sales" },
            1: { title: "Profit" },
        },
        legend: { position: "bottom" },
        height: 400,
        chartArea: { width: "85%", height: "70%" },
    };

    return (
        <div className="w-full flex justify-center py-10 bg-gray-100">
            <div className="w-[900px] bg-white shadow-xl rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl">

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    📊 Daily Sales & Profit (This Month)
                </h2>

                {/* Chart */}
                <div className="w-full">
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={options}
                    />
                </div>
            </div>
        </div>
    );
}

