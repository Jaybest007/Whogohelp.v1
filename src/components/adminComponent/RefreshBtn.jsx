import react from 'react';
import { useAdmin } from '../../context/AdminContext';
import { MdOutlineRefresh } from "react-icons/md";


const RefreshBtn = ({styling}) => {
    const { fetchAdminData, loading } = useAdmin();

    // Function to handle the refresh action

    function handleRefresh() {
        fetchAdminData();
    }


        return (
            <div className={` ${styling} p-1 rounded-lg cursor-pointer`} onClick={handleRefresh}>
                <MdOutlineRefresh
                    size={30}
                    className={loading ? "animate-spin" : ""}
                />
            </div>
        )
}

export default RefreshBtn;