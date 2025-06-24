import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-7xl font-extrabold text-orange-500 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-6">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
            >
                Go Home
            </Link>
        </div>
    )
}

export default PageNotFound;