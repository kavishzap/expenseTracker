import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { chartsConfig } from "@/configs";
import StatisticsChart from "../../widgets/charts/statistics-chart"; // Import StatisticsChart component

const fetchExpensesData = async () => {
  const { data, error } = await supabase
    .from("expenses")
    .select("date, amount");

  if (error) {
    console.error("Error fetching expenses:", error.message);
    return [];
  }

  return data;
};

const transformDataForChart = (expenses) => {
  const monthlyExpenses = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  expenses.forEach(({ date, amount }) => {
    const month = new Date(date).toLocaleString("default", { month: "short" });
    if (monthlyExpenses[month] !== undefined) {
      monthlyExpenses[month] += amount;
    }
  });

  return Object.values(monthlyExpenses);
};

export function ExpenseChart() {
  const [chartData, setChartData] = useState(Array(12).fill(0)); // Ensure all 12 months exist

  useEffect(() => {
    const fetchAndTransform = async () => {
      const expenses = await fetchExpensesData();
      const formattedData = transformDataForChart(expenses);
      setChartData(formattedData);
    };

    fetchAndTransform();
  }, []);

  const dailySalesChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Expenses",
        data: chartData,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
      },
    },
  };

  const statisticsChartsData = [
    {
      color: "white",
      title: "Expense Chart",
      chart: dailySalesChart, // ✅ Now it's accessible
    },
  ];

  return (
    <div>
      {statisticsChartsData.map((props) => (
        <StatisticsChart key={props.title} {...props} />
      ))}
    </div>
  );
}

export default ExpenseChart;
