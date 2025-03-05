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

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Email Validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validate Email
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // ✅ Validate Password
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // ✅ Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // ✅ Check if email is confirmed
      if (!data.user.email_confirmed_at) {
        setError("Please verify your email before logging in.");
        return;
      }

      // ✅ Success Message & Navigate to Dashboard
      Swal.fire({
        title: "Login Successful!",
        text: "Welcome back!",
        icon: "success",
        confirmButtonColor: "#03C13A",
        confirmButtonText: "Go to Dashboard",
      }).then(() => {
        navigate("/dashboard/home"); // Redirect to Dashboard
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
          <Typography variant="h2" className="font-bold mb-4 text-xl md:text-2xl">
            Sign In
          </Typography>
          <Typography variant="paragraph" className="text-sm md:text-lg font-normal">
            Enter your email and password to Sign In.
          </Typography>
        </div>

        {error && <Typography className="text-red-500 text-sm mt-2">{error}</Typography>}

        <form className="mt-6" onSubmit={handleSignIn}>
          {/* Email Input */}
          <div className="mb-4">
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

          {/* Password Input with Show/Hide Feature */}
          <div className="mb-4 relative">
            <Typography variant="small" color="blue-gray" className="font-medium">
              Password
            </Typography>
            <Input
              type={showPassword ? "text" : "password"}
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

          {/* Sign In Button */}
          <Button type="submit" className="mt-4 bg-[#03C13A] text-white hover:bg-gray-700 w-full">
            Sign In
          </Button>

          <div className="flex justify-between items-center mt-4">
            <Typography variant="small" className="text-gray-900 font-medium">
              <a href="#" className="hover:underline">Forgot Password?</a>
            </Typography>
          </div>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1 hover:underline">
              Create account
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
