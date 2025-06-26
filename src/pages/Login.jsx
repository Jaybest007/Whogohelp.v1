import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useAdmin } from '../context/AdminContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

 function Login(){
    useEffect( ()=> {
        document.title = "Login - WhoGoHelp";
    }, []);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [inputType, setInputType] = useState("password");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const navigate = useNavigate()
    const {refreshDashboardData, refreshNotifications} = useDashboard();



    function handleInputChange(event){
        
         const {name, value} = event.target;

         setLoginData({...loginData, [name]: value});
         setError("");

         if(name === "email"){
            if(value !== ""){
                if(emailRegex.test(value)){
                    setLoginData((loginData) => ({...loginData, [name]:value}))
                    setError("");
                }else{
                    setError("Invalid email")
                }
            }
        }
   
    }   

    function showpassword(event){
        event.preventDefault();
        setInputType(prevType => prevType === "password" ? "text" : "password");
    }


    async function handleSubmit(event){
        event.preventDefault();
        setLoading(true);
        const {email, password} = loginData;

        // Validation
        if (email.trim() === "" || password.trim() === ""){
            setError("All input is required");
            setLoading(false);
            return;
        }

        // If there's an error, don't proceed
        if(error !== ""){
            setLoading(false);
            return;
        }

        try{ 
            const response = await fetch("http://localhost/api//login.php", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(loginData),
            });
            const data = await response.json();

            if (response.ok){
                setError("");
                setSuccess(data.success);
                await refreshDashboardData();
                await refreshNotifications();
                if (data.role === "user"){
                    navigate("/dashboard", { replace: true });
                }
                if (data.role === "admin"){
                    navigate("/admin", { replace: true }); 
                }
            } else{
                setError(data.error || "Login failed");
                console.log("login failed");
            }

        } catch(err){
            console.log(err);
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    
    return(
        <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-br from-orange-100 to-orange-300">
  <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
    <h1 className="text-4xl font-bold text-orange-600 mb-6 text-center"> Login</h1>

    {/* Error & Success Messages */}
    {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
    {success && <p className="text-green-500 text-sm mb-3 text-center">{success}</p>}

    {/* Login Form */}
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="text-gray-700 font-medium block mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter Email"
          value={loginData.email}
          onChange={handleInputChange}
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <label htmlFor="password" className="text-gray-700 font-medium block mb-1">Password</label>
        <input
          type={inputType}
          name="password"
          id="password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter Password"
          value={loginData.password}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="absolute top-10 right-4 text-gray-500 text-sm hover:text-orange-600 transition"
          onClick={showpassword}
        >
           {inputType === "password" ?  <FaEyeSlash size={18}/>  : <FaEye size={18}/> }
        </button>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="bg-orange-500 w-full text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-200 flex items-center justify-center"
      >
        {loading ? (
          <div className="w-5 h-5 border-4 border-white border-t-orange-600 rounded-full animate-spin"></div>
        ) : (
          "Login"
        )}
      </button>
    </form>
  </div>
</div>


    )
}


export default Login;