import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

const Logout = () => {
  const navigate = useNavigate();
  const { clearDashboardData } = useDashboard();

  useEffect(() => {
    axios
      .post(
        "https://api-hvzs.onrender.com/api/logout.php",
        {}, 
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        clearDashboardData();
        navigate("/");
      })
      .catch((err) => {
        console.error("logout failed", err);
      });
  }, [navigate, clearDashboardData]);

  return (
      <div className="flex justify-center items-center min-h-screen p-6 bg-gray-50 ">
          <div className=" text-center  bg-orange-50 rounded-2xl drop-shadow-lg p-15 ">
              <h1 className="font-bold text-4xl m-5 text-orange-500">Loging you out</h1>
              <p className="text-lg">Bye, See you soon</p>
          </div>
      </div>
  )
};

export default Logout;
