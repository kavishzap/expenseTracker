import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { chartsConfig } from "@/configs";
import StatisticsChart from "../../widgets/charts/statistics-chart"; // Import StatisticsChart component

const fetchExpensesData = async (userId) => {
  if (!userId) {
    console.error("User ID not found, returning empty expenses.");
    return [];
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("date, amount")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching expenses:", error.message);
    return [];
  }

  console.log("Fetched Expenses:", data); // ✅ Log response
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

  console.log("Transformed Expenses for Chart:", monthlyExpenses); // ✅ Log transformed data
  return Object.values(monthlyExpenses);
};

export function ExpenseChart({onExpensesUpdated}) {
  const [chartData, setChartData] = useState(Array(12).fill(0)); // Ensure all 12 months exist
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndExpenses = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user) {
        console.error("Error fetching user:", error?.message);
        return;
      }

      console.log("Logged-in User:", userData.user); // ✅ Log user data
      setUser(userData.user);

      // ✅ Fetch and process expenses for logged-in user
      const expenses = await fetchExpensesData(userData.user.id);
      const formattedData = transformDataForChart(expenses);
      setChartData(formattedData);
    };

    fetchUserAndExpenses();
  }, [onExpensesUpdated]);

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
