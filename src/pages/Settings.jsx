import React from 'react';

const UserSettings = () => {
    return (
        <div className="min-h-screen pt-18 bg-gray-100">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 bg-gradient-to-tr from-white via-gray-100 to-white rounded-2xl shadow-xl mt-6 border border-gray-200 overflow-x-auto">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-6 border-b pb-2 border-gray-300">
                    <button className='hover:animate-spin'>⚙️</button> User Settings
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Account Management */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Management</h2>
                        <p className="text-gray-600 mb-2">View account details, manage subscriptions, and delete your account.</p>
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Manage Account</button>
                    </div>
                    {/* 2. General Settings */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
                        <p className="text-gray-600 mb-2">Manage your account settings, preferences, and more.</p>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Edit Settings</button>
                    </div>
                    {/* 3. Security Settings */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Security Settings</h2>
                        <p className="text-gray-600 mb-2">Update your password, enable two-factor authentication, and manage security options.</p>
                        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Update Security</button>
                    </div>
                    {/* 4. Privacy Settings */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Privacy Settings</h2>
                        <p className="text-gray-600 mb-2">Control your privacy settings, data sharing, and visibility options.</p>
                        <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">Adjust Privacy</button>
                    </div>
                    {/* 5. Notification Settings */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h2>
                        <p className="text-gray-600 mb-2">Customize your notification preferences for emails, alerts, and more.</p>
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Manage Notifications</button>
                    </div>
                    {/* 6. Help & Support */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Help & Support</h2>
                        <p className="text-gray-600 mb-2">Access FAQs, contact support, and find resources.</p>
                        <button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition">Get Help</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserSettings;