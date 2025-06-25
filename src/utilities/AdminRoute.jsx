import React, { Children, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const AdminRoute = ({children}) => {
    const navigate = useNavigate();
    const {adminData, loading} = useAdmin();

    if (loading) return null;

    if (!adminData || adminData.role !== "admin") {
        navigate("/", { replace: true });
        return null;
    }

    return children;

};

export default AdminRoute