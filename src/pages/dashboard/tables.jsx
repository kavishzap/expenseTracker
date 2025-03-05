import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { 
  Card, CardHeader, CardBody, Typography, Button, Input, Select, Option, Dialog, DialogHeader, DialogBody, DialogFooter 
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { supabase } from "../../supabase";

export function Tables({ onExpensesUpdated }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [filters, setFilters] = useState({ description: "", amount: "", types: "" });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
    types: "",
  });
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .swal-front {
        z-index: 1000000 !important;
      }
    `;
    document.head.appendChild(style);
  }, []);
  useEffect(() => {
    const fetchUserAndExpenses = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
        fetchExpenses(userData.user.id);
      }
    };
    fetchUserAndExpenses();
  }, []);
   // ✅ Fetch expenses for the logged-in user
   const fetchExpenses = async (userId) => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) console.error(error);
    else setExpenses(data);
  };

  // Open Modal for Adding New or Editing Existing
  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      // Prefill form for edit
      setFormData({
        date: item.date,
        description: item.description,
        amount: item.amount,
        types: item.types,
      });
    } else {
      // Reset form for new entry
      setFormData({ date: "", description: "", amount: "", types: "" });
    }
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission (Add or Update)
  const handleSubmit = async () => {
    if (!user) {
      alert("User not authenticated!");
      return;
    }

    // ✅ Validation
    if (!formData.date) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select a date.",
        icon: "warning",
        customClass: {
          popup: "swal-front" // Ensure it appears on top
        }
      });
      return;
    }

    if (!formData.description.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Description cannot be empty.",
        icon: "warning",
        customClass: {
          popup: "swal-front" // Ensure it appears on top
        }
      });
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      Swal.fire({
        title: "Validation Error",
        text: "Amount must be greater than zero.",
        icon: "warning",
        customClass: {
          popup: "swal-front" // Ensure it appears on top
        }
      });
      return;
    }

    if (!formData.types) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select a type.",
        icon: "warning",
        customClass: {
          popup: "swal-front" // Ensure it appears on top
        }
      });
      return;
    }

  let response;
  if (editingItem) {
    // ✅ Update Expense
    response = await supabase
      .from("expenses")
      .update({
        date: formData.date,
        description: formData.description.trim(),
        amount: formData.amount,
        types: formData.types,
      })
      .eq("id", editingItem.id);
  } else {
    // ✅ Add New Expense
    response = await supabase.from("expenses").insert([
      {
        user_id: user.id,
        date: formData.date,
        description: formData.description.trim(),
        amount: formData.amount,
        types: formData.types,
      },
    ]);
  }
  if (response.error) {
    Swal.fire({
      title: "Error",
      text: response.error.message,
      icon: "error",
      customClass: {
        popup: "swal-front" // Ensures it appears on top
      }
    });
  } else {
    Swal.fire({
      title: "Success",
      text: editingItem ? "Expense updated successfully!" : "Expense added successfully!",
      icon: "success",
      customClass: {
        popup: "swal-front"
      }
    });
    closeModal();
    fetchExpenses(user.id); // Refresh Data
    onExpensesUpdated();
  }
  
  };

 // ✅ Handle Delete Expense
 const handleDelete = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the expense!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          customClass: {
            popup: "swal-front" // Ensures it appears above modal
          }
        });
      } else {
        Swal.fire({
          title: "Deleted!",
          text: "Expense has been deleted.",
          icon: "success",
          customClass: {
            popup: "swal-front"
          }
        });
        fetchExpenses(user.id); // Refresh Data
      }
      
    }
  });
};
  // Filter Data based on input
    // ✅ Filter Data based on input
    const filteredData = expenses.filter((row) => {
      const rowDate = new Date(row.date);
    
      const isWithinDateRange =
        (!startDate || rowDate >= startDate) &&
        (!endDate || rowDate <= endDate);
    
      const matchesDescription = row.description.toLowerCase().includes(filters.description.toLowerCase());
      const matchesAmount = filters.amount === "" || row.amount.toString().includes(filters.amount);
      
      // ✅ If "All" is selected, show all types
      const matchesType = filters.types === "All" || filters.types === "" || (row.types && row.types.toLowerCase() === filters.types.toLowerCase());
    
      return isWithinDateRange && matchesDescription && matchesAmount && matchesType;
    });
    

  // Calculate Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="green" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Expense Table
          </Typography>
        </CardHeader>
        <div className="flex justify-end mb-4 mr-10">
            <Button 
              className="flex items-center bg-[#000000] text-white px-4 py-2 rounded-md"
              onClick={() => openModal()}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
        </div>

        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          
          <table className="w-full table-auto">
          <thead>
  <tr>
    {["Date", "Description", "Amount", "Type", "Action"].map((el) => (
      <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
          {el}
        </Typography>
      </th>
    ))}
  </tr>
  
  {/* Filter Row */}
  <tr>
    {/* Date Range Filter */}
    <th className="py-2 px-5">
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
          setCurrentPage(1);
        }}
        isClearable
        placeholderText="Filter by Date Range"
        className="w-full border border-gray-300 rounded p-1 text-xs"
      />
    </th>

    {/* Description Filter */}
    <th className="py-2 px-5">
      <Input
        type="text"
        name="description"
        value={filters.description}
        onChange={(e) => setFilters({ ...filters, description: e.target.value })}
        placeholder="Filter by Description"
        className="w-full border border-gray-300 rounded p-1 text-xs"
      />
    </th>

    {/* Amount Filter */}
    <th className="py-2 px-5">
      <Input
        type="text"
        name="amount"
        value={filters.amount}
        onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
        placeholder="Filter by Amount"
        className="w-full border border-gray-300 rounded p-1 text-xs"
      />
    </th>

    {/* Type Filter */}
    <th className="py-2 px-5">
    <Select 
  value={formData.types}
  onChange={(val) => setFormData((prev) => ({ ...prev, types: val }))}
  className="mt-1"
>
  <Option value="All">All</Option>
  <Option value="Expense">Expense</Option>
</Select>
    </th>

    <th className="py-2 px-5"></th> {/* Empty column for action */}
  </tr>
</thead>


            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">{item.date}</td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">{item.description}</td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">Rs {item.amount.toFixed(2)}</td>
                 <td className={`py-3 px-5 border-b border-blue-gray-50 
  ${item.types === "Income" ? "text-green-500 font-bold" : 
    item.types === "Expense" ? "text-red-500 font-bold" : "text-blue-500 font-bold"}`}>
  {item.types}
</td>
                  <td className="py-3 px-5 border-b border-blue-gray-50 w-[120px]">
                    <div className="flex items-center gap-3">
                      <Button variant="text" className="text-blue-500 hover:text-blue-700" onClick={() => openModal(item)}>
                        <PencilIcon className="w-5 h-5" />
                      </Button>
                      <Button variant="text" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                        <TrashIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
        <div className="flex justify-between items-center mt-4 px-6 mb-6">
  <Button
    variant="outlined"
    size="sm"
    className="flex items-center gap-2"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  >
    <ChevronLeftIcon className="w-4 h-4" />
  </Button>

  <Typography variant="small" className="text-blue-gray-600">
    Page {currentPage} of {totalPages}
  </Typography>

  <Button
    variant="outlined"
    size="sm"
    className="flex items-center gap-2"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
  >
    <ChevronRightIcon className="w-4 h-4" />
  </Button>
</div>
      </Card>

     {/* Add/Edit Expense Modal */}
<Dialog open={isModalOpen} handler={closeModal} size="sm" className="rounded-lg shadow-lg">
  <DialogHeader className="bg-gray-100 text-gray-900 font-semibold px-6 py-4 rounded-t-lg">
    {editingItem ? "Edit Expense" : "Add Expense"}
  </DialogHeader>

  <DialogBody className="px-6 py-4 space-y-4">
    {/* Date Input */}
    <div>
      <Typography variant="small" className="font-medium text-gray-700">Date</Typography>
      <Input 
        type="date" 
        name="date" 
        value={formData.date} 
        onChange={handleChange} 
        className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>

    {/* Description Input */}
    <div>
      <Typography variant="small" className="font-medium text-gray-700">Description</Typography>
      <Input 
        type="text" 
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
        placeholder="Enter details"
        className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>

    {/* Amount Input */}
    <div>
      <Typography variant="small" className="font-medium text-gray-700">Amount</Typography>
      <Input 
        type="number" 
        name="amount" 
        value={formData.amount} 
        onChange={handleChange} 
        placeholder="Enter amount"
        className="mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>

    {/* Type Dropdown */}
    <div>
      <Typography variant="small" className="font-medium text-gray-700">Type</Typography>
      <Select 
  value={formData.types}
  onChange={(val) => setFormData((prev) => ({ ...prev, types: val }))}
  className="mt-1"
>
  <Option value="All">All</Option>
  <Option value="Expense">Expense</Option>
</Select>
    </div>
  </DialogBody>

  <DialogFooter className="bg-gray-100 px-6 py-4 rounded-b-lg flex justify-end space-x-2">
    <Button variant="text" className="text-gray-600 hover:text-gray-900" onClick={closeModal}>
      Cancel
    </Button>
    <Button variant="gradient" color="green" className="px-4 py-2 rounded-md" onClick={handleSubmit}>
      {editingItem ? "Update" : "Add"}
    </Button>
  </DialogFooter>
</Dialog>

    </div>
  );
}

export default Tables;
