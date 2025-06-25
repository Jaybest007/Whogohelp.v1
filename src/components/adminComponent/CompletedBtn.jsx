import React from "react";
import { useAdmin } from "../../context/AdminContext";

const CompletedBtn = ({errand_id}) => {

    const {errand_action} =useAdmin();
    
    return(
        <button onClick={() => errand_action(errand_id, "completed")} 
            className="bg-lime-500 text-gray-100 px-4 py-2 mr-3 rounded hover:bg-lime-600 cursor-pointer shadow">
            Complete errand</button>
    )
}   

export default CompletedBtn;