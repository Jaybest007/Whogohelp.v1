import { FaCheckCircle, FaPen, FaTimes, FaUpload } from 'react-icons/fa';
import ProfilePic from '../assets/profile_pic.jpg';
import BottomNav from '../components/BottomNav';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { MdDone } from 'react-icons/md';
import { toast } from 'react-toastify';
import ProfileSkeleton from '../components/ProfileSkeleton';

function Profile() {
  const [userData, setUserData] = useState({ user: null, errands: [] });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [newAbout, setNewAbout] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const {username} = useParams();
  const {dashboardData, refreshDashboardData} = useDashboard();
  const totalPosted = userData.errands.filter(errand => errand.posted_by === username ).length; 
  const totalAccepted = userData.errands.filter(errand => errand.accepted_by === username).length;
  const acceptedAndComplete = userData.errands.filter(errand => errand.accepted_by === username && errand.status === "completed").length;
  const postedAndComplete = userData.errands.filter(errand => errand.posted_by === username && errand.status === "completed").length;
  const postedAndCancel = userData.errands.filter(errand => errand.posted_by === username && errand.status === "canceled").length;
  const completedRate = totalPosted > 0 ? Math.round((postedAndComplete/totalPosted) * 100) : 0;
  const acceptanceSuccessRate = totalAccepted > 0  ? Math.round((acceptedAndComplete / totalAccepted) * 100) : 0;

  const handleInput = (e) => setNewAbout(e.target.value);
 

  useEffect(() => {
    setLoading(true);

    axios.post("https://whogohelp.free.nf/api/profile.php", { action: "fetchUserData", username: username }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        if (response.data) setUserData(response.data);
        
      })
      .catch(error => {
        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError(error.message || "An error occurred");
        }
      })
      .finally(() => {
      setLoading(false);
      });
      
  }, []);

  const updateProfile = async () => {
    if (!newAbout.trim() || !newLocation.trim() || !newPhone.trim() ) return;
    setLoading(true);
    try {
      const response = await axios.post("https://whogohelp.free.nf/api/profile.php", {
        action: "edit_profile",
        about: newAbout,
        phone: newPhone,
        location: newLocation,
      }, { withCredentials: true });

      if (response.data) {
        // setMessage(response.data.message);
        toast.success(response.data.message)
        setEdit(false);
        setNewAbout("");
        setNewLocation("");
        setNewPhone("");
        refreshDashboardData();
        
        
        
      }
    } catch (err) {
      //setError(err.response?.data?.error || "An error occurred");
      toast.error(err.response?.data?.error || "An error occurred")
    } finally {
      setLoading(false);
    }
  };

  

  
  return (
      <>
      {loading && !userData.user ? (<ProfileSkeleton />) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-500 py-10 px-4 mt-15 mb-12">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-10 relative">
          {(message || error) && (
            <div className={`text-white text-center px-4 py-2 rounded-md mb-4 ${
              message ? "bg-green-500" : "bg-red-500"
            }`}>
              {message || error}
            </div>
          )}

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <img
            src={ProfilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-orange-500 object-cover shadow-md"
          />
          <div className="flex flex-col items-center sm:items-start w-full">
            <h1 className="text-2xl font-bold text-orange-600 mb-1 flex items-center gap-2">
              {userData?.user?.full_name}
              
              <FaCheckCircle className="text-green-500 text-lg" title="Verified" />
            </h1>
            <div className="text-sm text-gray-700 text-center sm:text-left w-full">
              {!edit ? (
                <span>
                  {userData.user?.about || "No about info provided"}
                </span>
              ) : (
                <div className="flex flex-col sm:flex-row items-center mt-2 gap-2 w-full">
                  <textarea
                    // type="text"
                    value={newAbout}
                    onChange={handleInput}
                    placeholder="Update your about..."
                    className="flex-1 w-full border border-gray-300 px-3 py-2 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  
                </div>
              )}
            </div>
          </div>
        </div>

        <ul className="text-gray-700 space-y-3 mb-6">
          <li><span className="font-semibold text-orange-600 mr-2">Email:</span> 
          {userData.user?.email}</li>
          
          <li><span className="font-semibold text-orange-600 mr-2">Phone:</span> 
          {!edit ? userData.user?.phone : 
          (<input type='text' maxLength={11} placeholder="Update your phone number..."  onChange= {(event) => setNewPhone(event.target.value.replace(/\D/g, ""))} className='border rounded-lg  pl-2 p-1 ml-1 focus:outline-0 ' value={newPhone}/>)}
          
          </li>
          <li><span className="font-semibold text-orange-600 mr-2">Location:</span> 
          {!edit ? userData.user?.location : 
          (<input type='text' placeholder="Update your location..." onChange= {(event) => setNewLocation(event.target.value)} className='border rounded-lg pl-2 p-1 ml-1 focus:outline-0' value={newLocation}/>) }
          </li>

            
        </ul>

        {dashboardData?.username === username && (
            <div className="flex flex-wrap gap-3 mb-4  sm:mt-0">
              {/* edit part */}
              {!edit && (
                <button
                  className="bg-amber-500 text-white font-medium px-4 py-2 rounded-md shadow hover:bg-amber-600 transition-colors duration-200"
                  onClick={() => {
                    setEdit(true);
                    setNewAbout(userData.user?.about || "");
                    setNewPhone(userData.user?.phone || "");
                    setNewLocation(userData.user?.location || "");
                  }}
                >
                  Edit Profile
                </button>
              )}

                {edit && (
                  <>
                    <button
                      onClick={() => setEdit(false)}
                      className="bg-red-100 text-red-600 font-medium px-4 py-2 rounded-md shadow hover:bg-red-200 transition-all duration-200"
                    >
                      Cancel <FaTimes className="inline ml-1" />
                    </button>

                    <button
                      onClick={updateProfile}
                      className="bg-green-100 text-green-700 font-medium px-4 py-2 rounded-md shadow hover:bg-green-200 transition-all duration-200"
                    >
                     {loading ? (
                      <div className="w-5 h-5 border-4 border-white border-t-orange-600 rounded-full animate-spin"></div>
                    ) : (
                      <>
                       Done <MdDone className="inline ml-1" size={18} />
                       </>
                    )}
                    </button>

                    
                  </>
                )}
              </div>
            )}


{/* errand history analyzis part */}
          <div className="mt-6 mb-6 overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-800">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <th className="py-2 pr-4 font-medium">Total Errands Posted:</th>
                  <td className="py-2 font-semibold">{totalPosted}</td>
                </tr>
                <tr>
                  <th className="py-2 pr-4 font-medium text-green-700">Posted & Successfully Completed:</th>
                  <td className="py-2 font-bold text-green-700">{postedAndComplete}</td>
                </tr>
                <tr>
                  <th className="py-2 pr-4 font-medium text-green-700">Posting Success Rate:</th>
                  <td className="py-2 font-bold text-green-700">{completedRate}%</td>
                </tr>
                <tr>
                  <th className="py-2 pr-4 font-medium text-red-700">Posted but Later Canceled:</th>
                  <td className="py-2 font-bold text-red-700">{postedAndCancel}</td>
                </tr>
                <tr>
                  <th className="py-2 pr-4 font-medium">Errands Accepted:</th>
                  <td className="py-2 font-semibold">{totalAccepted}</td>
                </tr>
                <tr>
                  <th className="py-2 pr-4 font-medium text-green-700">Accepted & Completed by:</th>
                  <td className="py-2 font-bold text-green-700">{acceptedAndComplete}</td>
                </tr>
                <tr>
                  <th className="py-2 pr-4 font-medium text-green-700"> Acceptance Success Rate:</th>
                  <td className="py-2 font-bold text-green-700">{acceptanceSuccessRate}%</td>
                </tr>
              </tbody>
            </table>
          </div>


{/* errand history part */}
        <div>
          <h2 className="text-lg font-semibold inline text-orange-600 mb-2">Errand History</h2> <span className='text-sm'> (Last 5 Transactions)</span>
          <ul className="space-y-2">
            {userData.errands?.length > 0 ? (
              userData.errands.slice(0, 5).map((errand, index) => (
                <li key={index} className="flex justify-between items-center px-4 py-2 bg-orange-100 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-orange-600">{errand.date} • {errand.time}</span>
                  <span className="text-sm text-gray-800">{errand.title}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">No errands found.</li>
            )}
          </ul>
        </div>
      </div>
        </div>
      ) }
      

      <BottomNav />
      </>
  );
}

export default Profile;
