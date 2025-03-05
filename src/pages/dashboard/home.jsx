import React, { useState, useEffect } from "react";
import {
  Typography,
} from "@material-tailwind/react";
import LogoutButton from "./LogoutButton";
import Table from "../dashboard/tables"
import ExpenseChart from "./ExpenseChart";
export function Home() {
  const [expensesUpdated, setExpensesUpdated] = useState(false);

  // Function to trigger refresh in ExpenseChart
  const handleExpensesUpdated = () => {
    setExpensesUpdated((prev) => !prev);
  };
  
  return (
    <div className="mt-12">
      <div className="flex justify-center items-center gap-2">
  <Typography 
    variant="h5" 
    className="text-blue-gray-900 text-sm sm:text-lg"
  >
    Expense Tracker Dashboard
  </Typography>
</div>


      <div className="mb-12">
      <Table onExpensesUpdated={handleExpensesUpdated}/>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-1 xl:grid-cols-1">
        <ExpenseChart onExpensesUpdated={handleExpensesUpdated}/>
      </div>
<LogoutButton/>

    </div>
  );
}

export default Home;
