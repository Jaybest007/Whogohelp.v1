import React from "react";
import { useAdmin } from "../../context/AdminContext";

const CancelBtn = ({errand_id}) => {

    const {errand_action} =useAdmin();
    
    return(
        <button onClick={() => errand_action(errand_id, "cancel")} 
            className="bg-red-500 text-white px-4 py-2 mr-3 rounded hover:bg-red-600 cursor-pointer shadow">
            Cancel errand</button>
    )
}   

export default CancelBtn;