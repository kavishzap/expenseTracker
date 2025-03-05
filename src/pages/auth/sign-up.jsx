import { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { supabase } from "../../supabase";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
const backgroundStyle = {
  backgroundImage: "radial-gradient(circle, #454545, transparent 1px)",
  backgroundSize: "10px 10px",
  padding: "0 1rem",
};

export function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  // ✅ Email Validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // ✅ Password Validation (Min 8 chars, at least one letter & one number)
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validate Email
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // ✅ Validate Password
    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 8 characters long and include at least one letter and one number."
      );
      return;
    }

    // ✅ Confirm Password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ✅ Register User in Supabase
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      // ✅ Show SweetAlert Success Message
      Swal.fire({
        title: "Registration Successful!",
        text: "Please log in to access your account.",
        icon: "success",
        confirmButtonColor: "#03C13A",
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/auth/sign-in"); // Redirect to Sign In
      });
    }
  };

  return (
    <section
      className="flex justify-center items-center min-h-screen w-full px-4"
      style={backgroundStyle}
    >
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        <div className="text-center">
          <Typography variant="paragraph" className="text-sm md:text-lg font-bold">
            MINDKORE EXPENSE TRACKER
          </Typography>
          <img src={Logo} alt="logo" className="w-48 mx-auto" />
          <Typography variant="h2" className="font-bold mb-2 text-xl md:text-2xl">
            Join Us Today
          </Typography>
          <Typography variant="paragraph" className="text-sm md:text-lg font-normal">
            Enter your email and password to register.
          </Typography>
        </div>

        {error && <Typography className="text-red-500 text-sm mt-2">{error}</Typography>}

        <form className="mt-2" onSubmit={handleSignUp}>
          {/* Email Input */}
          <div className="mb-2">
            <Typography variant="small" color="blue-gray" className="font-medium">
              Your Email
            </Typography>
            <Input
              type="email"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@mail.com"
              className="border border-gray-300 focus:border-gray-900 rounded-md mt-1"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
  <Typography variant="small" color="blue-gray" className="font-medium">
    Password
  </Typography>
  <Input
    type={showPassword ? "text" : "password"} // Toggle between text and password
    size="lg"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    placeholder="********"
    className="border border-gray-300 focus:border-gray-900 rounded-md mt-1 pr-10"
  />
  <button
    type="button"
    className="absolute right-3 top-9 text-gray-500"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
  </button>
</div>


          {/* Confirm Password Input */}
          {/* Confirm Password Input */}
<div className="mb-4 relative">
  <Typography variant="small" color="blue-gray" className="font-medium">
    Confirm Password
  </Typography>
  <Input
    type={showConfirmPassword ? "text" : "password"}
    size="lg"
    value={confirmPassword}
    onChange={(e) => {
      setConfirmPassword(e.target.value);
      if (password !== e.target.value) {
        setPasswordMatchError("Passwords do not match.");
      } else {
        setPasswordMatchError("");
      }
    }}
    required
    placeholder="********"
    className="border border-gray-300 focus:border-gray-900 rounded-md mt-1 pr-10"
  />
  <button
    type="button"
    className="absolute right-3 top-9 text-gray-500"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
  </button>
  {/* Show Error Message if Passwords Don't Match */}
  {passwordMatchError && <Typography className="text-red-500 text-xs mt-1">{passwordMatchError}</Typography>}
</div>

          {/* Register Button */}
          <Button type="submit" className="mt-4 bg-[#03C13A] text-white hover:bg-gray-700 w-full">
            Register Now
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1 hover:underline">
              Sign in
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
