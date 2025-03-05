import { chartsConfig } from "@/configs";
const dailySalesChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Sales",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
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
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  },
};


export const statisticsChartsData = [
  {
    color: "white",
    title: "Expense Table",
    description: "Last Campaign Performance",
    footer: "campaign sent 2 days ago",
    chart: dailySalesChart,
  },
  {
    color: "white",
    title: "Income Table",
    description: "15% increase in today sales",
    footer: "updated 4 min ago",
    chart: dailySalesChart,
  },
];

export default statisticsChartsData;
