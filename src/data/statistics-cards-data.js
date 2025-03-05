import {
  ArrowUpIcon,
  CurrencyDollarIcon,
  ArrowDownIcon
  
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "red",
    icon: ArrowDownIcon,
    title: "Expense",
    value: "$53k",

  },
  {
    color: "green",
    icon: ArrowUpIcon,
    title: "Income",
    value: "2,300",
  },
  {
    color: "blue",
    icon: CurrencyDollarIcon,
    title: "Overall Budget",
    value: "3,462",
  },
];

export default statisticsCardsData;
