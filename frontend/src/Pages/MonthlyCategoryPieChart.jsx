import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import api from "../Api";

export default function MonthlyCategoryPieChart() {
    const [chartData, setChartData] = useState([["Category", "Total Sold"]]);
    const [selectedSlice, setSelectedSlice] = useState(null);

    useEffect(() => {
        api.get("/monthly-category-sales")
            .then((res) => {
                const rows = res.data.map((item) => [
                    item.category,
                    Number(item.total_sold)
                ]);
                setChartData([["Category", "Total Sold"], ...rows]);
            })
            .catch((err) => {
                console.error("Error loading chart data", err);
            });
    }, []);

    const options = {
        title: "Sales by Category (This Month)",
        is3D: true,
        pieSliceText: "percentage",
        legend: { position: "right" },
        slices: selectedSlice !== null ? { [selectedSlice]: { offset: 0.2 } } : {}
    };

    return (
        <div style={{ width: "700px", margin: "0 auto" }}>
            <Chart
                chartType="PieChart"
                data={chartData}
                options={options}
                width={"100%"}
                height={"450px"}
                chartEvents={[
                    {
                        eventName: "select",
                        callback: ({ chartWrapper }) => {
                            const chart = chartWrapper.getChart();
                            const sel = chart.getSelection();
                            if (sel.length > 0) {
                                setSelectedSlice(sel[0].row);
                            } else {
                                setSelectedSlice(null);
                            }
                        },
                    },
                ]}
            />
        </div>
    );
}
