import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';



function Signup() {
    useEffect( ()=> {
            document.title = "Sign up - WhoGoHelp";
        }, []);    
    const navigate = useNavigate();
    const {refreshDashboardData} = useDashboard();
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        location: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [inputType, setInputType] = useState("password");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function handleInputChange(event) {
        const { name, value } = event.target;

        setFormData(prev => ({ ...prev, [name]: value }));
        setError(prev => ({ ...prev, [name]: "" }));

        if (name === "email" && value && !emailRegex.test(value)) {
            setError(prev => ({ ...prev, email: "Invalid email address" }));
        }

        if (name === "password" && value && !passwordRegex.test(value)) {
            setError(prev => ({
                ...prev,
                password: "Password must include uppercase, lowercase, number, special character, and be at least 8 characters"
            }));
        }

        if (name === "confirmPassword" && value !== formData.password) {
            setError(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
        }
    }
    function showpassword(event){
        event.preventDefault();
        setInputType(prevType => prevType === "password" ? "text" : "password");
        
    }




    async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setSuccess("");

    const { name, username, email, phone, location, password, confirmPassword } = formData;

    // Validate Input
    const newError = {
        name: name.trim() ? "" : "Name can't be empty",
        username: username.trim() ? "" : "Username can't be empty",
        email: email.trim() ? "" : "Email can't be empty",
        phone: phone.trim() ? "" : "Phone can't be empty",
        location: location.trim() ? "" : "Location/Address can't be empty",
        password: password.trim() ? "" : "Password can't be empty",
        confirmPassword: confirmPassword.trim() ? "" : "Confirm Password can't be empty"
    };

    setError(newError);

    const hasError = Object.values(newError).some(err => err !== "");
    if (hasError) {
        setLoading(false);
        return;
    }

    try {
        const response = await fetch("https://api-hvzs.onrender.com/api/signup.php", { //  Fix API endpoint
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            setSuccess(data.message);
            
            // Properly reset form fields (includes phone)
            setFormData({
                name: "",
                username: "",
                email: "",
                phone: "",
                location: "",
                password: "",
                confirmPassword: ""
            });

            setError({});
            refreshDashboardData();
            // Navigate after a short delay
            setTimeout(() => {
                navigate("/dashboard"); 
            }, 200);
        } else {
            setError(prev => ({ ...prev, ...data.errors })); // Match PHP error handling
        }
    } catch (err) {
        console.error(err);
        setError(prev => ({ ...prev, server: "Something went wrong. Please try again." }));
    } finally {
        setLoading(false);
    }
}


    return (
        <div className="flex justify-center mt-15 items-center min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 p-6">
  <div className="bg-white p-8 mt-2 rounded-2xl shadow-2xl w-full max-w-md">
    <h1 className="text-4xl font-bold text-orange-600 mb-6 text-center">Create an Account</h1>
    <p className="text-gray-600 text-center mb-6">Join WhoGoHelp and start making an impact in your community.</p>

    {/* Error & Success Messages */}
    {success && <p className="text-green-500 text-sm mb-3 text-center">{success}</p>}
    {error.server && <p className="text-red-500 text-sm mb-3 text-center">{error.server}</p>}

    {/* Signup Form */}
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="name" className="text-gray-700 font-medium block mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Your Full Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="text-gray-700 font-medium block mb-1">Username</label>
        <input
          type="text"
          name="username"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Choose a Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="text-gray-700 font-medium block mb-1">Email</label>
        <input
          type="email"
          name="email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter Your Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="text-gray-700 font-medium block mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter Your Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
        />
        {error.phone && <p className="text-red-500 text-sm">{error.phone}</p>}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="text-gray-700 font-medium block mb-1">Location</label>
        <input
          type="text"
          name="location"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="e.g Ajah, Lagos or Moniya, Ibadan"
          value={formData.location}
          onChange={handleInputChange}
        />
        {error.location && <p className="text-red-500 text-sm">{error.location}</p>}
      </div>

      {/* Password */}
      <div className="relative">
        <label htmlFor="password" className="text-gray-700 font-medium block mb-1">Password</label>
        <input
          type={inputType}
          name="password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="absolute top-10 right-4 text-gray-500 text-sm hover:text-orange-600 transition"
          onClick={showpassword}
        >
            
            
          {inputType === "password" ?  <FaEye size={18}/>  : <FaEyeSlash size={18}/> }
        
        </button>
        {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="text-gray-700 font-medium block mb-1">Confirm Password</label>
        <input
          type={inputType}
          name="confirmPassword"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Confirm Your Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
      </div>

      {/* Signup Button */}
      <button
        type="submit"
        className="bg-orange-500 w-full text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-200 flex items-center justify-center"
      >
        {loading ? (
          <div className="w-5 h-5 border-4 border-white border-t-orange-600 rounded-full animate-spin"></div>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  </div>
</div>

    );
}

export default Signup;