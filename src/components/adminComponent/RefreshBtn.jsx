import react from 'react';
import { useAdmin } from '../../context/AdminContext';
import { MdOutlineRefresh } from "react-icons/md";


const RefreshBtn = ({styling}) => {
    const { fetchAdminData } = useAdmin();

    // Function to handle the refresh action
    // This function will be called when the refresh button is clicked
    function handleRefresh() {
        fetchAdminData();
    }


        return (
            <div className={` ${styling}  p-1 rounded-lg`} onClick={handleRefresh}>
                <MdOutlineRefresh  size={30}/>
            </div>
        )
}

export default RefreshBtn;