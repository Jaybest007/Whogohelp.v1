import React, { useState } from "react";
import { FaStar } from 'react-icons/fa';

function StarRating({ value, onChange }) {
  const [comment, setComment] = useState('');


  return (
    <div className="w-full max-w-md bg-gray-900 shadow-xl border border-gray-800 rounded-2xl p-6 sm:p-8 transition-all">
      {/* Star Select */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={32}
            onClick={() => onChange(star)}
            className={`cursor-pointer transition-all duration-200 ${
              value >= star ? 'text-yellow-400 drop-shadow-sm scale-105' : 'text-gray-700'
            } hover:scale-110`}
          />
        ))}
      </div>

      {/* Textarea */}
      <textarea
        placeholder="How was your experience?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="w-full border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-800 text-gray-100 placeholder-gray-400"
      />

      {/* Submit Button */}
      <div className="mt-4 text-right">
        <button
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all duration-200"
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
}

export default StarRating;

