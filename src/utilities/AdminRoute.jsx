import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const { adminData, loading } = useAdmin();
  const [checked, setChecked] = useState(false);

  useEffect(() => {

    if (!loading) {
  
      if (adminData === null || adminData === undefined) return;


      if (!adminData || adminData.role !== "admin") {
        navigate("/", { replace: true });
      } else {
        setChecked(true);
      }
    }
  }, [adminData, loading, navigate]);

  if (loading || !checked) {
    return null;
  }

  return children;
};

export default AdminRoute;
