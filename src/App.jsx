import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import {AdminProvider} from './context/AdminContext';
import ProtectedRoute from './utilities/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'
import WithNavbar from './layouts/WithNavbar'
import ErrorBoundary from './components/ErrorBoundary';
import AdminRoute from './utilities/AdminRoute';


const Landing = lazy(() => import('./pages/Landing'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const BrowseErrandsPage = lazy(() => import('./pages/BrowseErrandPage'));
const Logout = lazy(() => import('./utilities/Logout'));
const PageNotFound = lazy(() => import('./utilities/PageNotFound'));
const TransactionHistory = lazy(() => import('./pages/TransactionHistory'));
const AboutUs = lazy(() => import('./pages/About'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Notifications = lazy(()=> import('./pages/Notifications'));
const SuccessPreview = lazy (()=> import('./components/successPreview'));
const AdminPanel = lazy( ()=> import('./pages/AdminPanel'));
const ChatWindow = lazy( ()=> import ('./pages/ChatWindow'));
const Errand = lazy( ()=> import('./pages/admin/Errand'));
const User  = lazy ( ()=> import('./pages/admin/User'));
const Messages = lazy( ()=> import('./pages/admin/Messages'));
const AdminWallet = lazy( ()=> import('./pages/admin/Wallet'));



function App() {
  return (
    <BrowserRouter>

      <DashboardProvider> 
        <Suspense fallback={
          <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md space-y-4 animate-pulse">
              <div className="h-4 bg-orange-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-orange-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-orange-200 rounded w-1/3 mx-auto"></div>
              <div className="h-48 bg-orange-100 rounded-md"></div>
            </div>
            <p className="mt-6 text-sm text-gray-400 tracking-wide">Warming things up for you...</p>
          </div>
        }>
         <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
          <Routes>
            <Route element={ <WithNavbar /> }>
              <Route path='/' element={<Landing />} />
              <Route path='/dashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
              <Route path="/profile/:username" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
              <Route path='/errands' element={<ProtectedRoute> <BrowseErrandsPage /> </ProtectedRoute>} />
              <Route path='/transactions' element={<ProtectedRoute> <TransactionHistory /> </ProtectedRoute>} />
              <Route path='/notification' element={<ProtectedRoute> <Notifications /> </ProtectedRoute>} />
              <Route path='/chat/:chat_id/:receiver' element={<ProtectedRoute> <ChatWindow /> </ProtectedRoute>} />
              <Route path="/success-preview" element={<SuccessPreview />} />
              <Route path='/about' element={<AboutUs />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/contact' element={<ContactUs />} />
            </Route>

            <Route path='/admin' element={<AdminProvider> <AdminRoute> <AdminPanel /></AdminRoute> </AdminProvider>}/>
            <Route path='/admin/errand' element={<AdminProvider><AdminRoute><Errand/></AdminRoute></AdminProvider>}/> 
            <Route path='/admin/user' element={<AdminProvider><AdminRoute><User/></AdminRoute></AdminProvider>}/> 
            <Route path='/admin/messages' element={<AdminProvider><AdminRoute><Messages/></AdminRoute></AdminProvider>}/> 
            <Route path='/admin/wallet' element={<AdminProvider><AdminRoute><AdminWallet/></AdminRoute></AdminProvider>}/>    
                 
                
                
              
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </DashboardProvider>
      
    </BrowserRouter>
  );
}

export default App;
