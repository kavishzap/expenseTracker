import { useNavigate } from "react-router-dom"; // Import navigation hook
import { supabase } from "../../supabase";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  Typography,
  Button
} from "@material-tailwind/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Show confirmation popup before logging out
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
      customClass: {
        popup: "swal-front" // Ensure it appears on top
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Logout Error:", error.message);
          Swal.fire("Error", "Failed to logout. Please try again.", "error");
          return;
        }
        Swal.fire("Logged Out", "You have been successfully logged out.", "success");
        navigate("/auth/sign-in"); // Redirect to Sign-in page
      }
    });
  };

  return (
    <Button
      variant="text"
      className="flex items-center justify-center bg-[#ff0000] text-white px-4 py-2 w-full"
      onClick={handleLogout}
    >
      <ArrowRightOnRectangleIcon className="w-5 sm:w-6 h-5 sm:h-6 mr-2" />
      <Typography 
        variant="h6" 
        className="text-white text-sm"
      >
        Logout
      </Typography>
    </Button>
  );
};

export default LogoutButton;
