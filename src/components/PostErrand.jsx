import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useDashboard } from "../context/DashboardContext";

function PostErrand({ onSuccess }, ) {
  const [errandData, setErrandData] = useState({
    title: "",
    description: "",
    pickUpLocation: "",
    dropOffLocation: "",
    reward: "",
    notes: "",
  });

  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);
  const [posted, setPosted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {fetchDashboardData} = useDashboard();
  function handleInput(e) {
    const { name, value } = e.target;
    setErrandData({ ...errandData, [name]: value });
    setError({ ...error, [name]: "" });
  }


// function submit post

async function handleSubmit(event) {
  event.preventDefault();
  setLoading(true);

  const { title, description, pickUpLocation, dropOffLocation, reward } = errandData;

  const newError = {
    title: title.trim() ? "" : "Title can't be empty",
    description: description.trim() ? "" : "Description can't be empty",
    pickUpLocation: pickUpLocation.trim() ? "" : "Pick-up location is required",
    dropOffLocation: dropOffLocation.trim() ? "" : "Drop-off location is required",
    reward: reward.trim() && Number(reward) > 0 ? "" : "Reward must be greater than 0",
  };
  setError(newError);

  const hasError = Object.values(newError).some((e) => e !== "");
  if (hasError) {
    setLoading(false);
    return;
  }

  try {
    const response = await fetch("http://localhost/api/post_errand.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ...errandData, reward: Number(reward) }),
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      setError((prev) => ({ ...prev, server: "Server returned invalid JSON" }));
      console.log(data.error.server);
      setLoading(false);
      return;
    }

    if (response.ok && data.success) {
      setPosted(true);
      setSuccess(true);
      setError({});
      if (onSuccess) onSuccess();

      setErrandData({
        title: "",
        description: "",
        pickUpLocation: "",
        dropOffLocation: "",
        reward: "",
        notes: "",
      });
fetchDashboardData();
      // Auto clear the success message after 4 seconds
      setTimeout(() => {
        setPosted(false);
        setSuccess(false);
      }, 4000);

    } else {
      setError((prev) => ({ ...prev, server: data?.error?.server || "Something went wrong" }));
    }
  } catch (err) {
    console.error(err);
    setError((prev) => ({ ...prev, server: "Network error occurred" }));
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="max-w-3xl mx-auto bg-orange-500 text-gray-800 p-6 md:p-10 rounded-xl shadow-2xl">
  {posted ? (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FaCheckCircle className="text-6xl text-green-500 mb-4" />
      <h2 className="text-3xl font-semibold mb-2">Your Errand was Posted Successfully!</h2>
      <p className="text-gray-600">You'll be notified when someone accepts it.</p>
    </div>
  ) : (
    <>
      <h1 className="text-3xl font-bold mb-3 text-center text-white">Need an Errand Done?</h1>
      <p className="text-gray-100 text-center mb-8">Fill in the details below to get help fast.</p>

      {error.server && <p className="text-red-500 italic mb-4 text-center">{error.server}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Title", name: "title", placeholder: "e.g. Grocery Shopping" },
            { label: "Description", name: "description", placeholder: "Describe your errand" },
            { label: "Pickup Location", name: "pickUpLocation", placeholder: "e.g. Ikeja Mall" },
            { label: "Drop-off Location", name: "dropOffLocation", placeholder: "e.g. Victoria Island" },
            { label: "Reward (₦)", name: "reward", placeholder: "e.g. 2500", type: "number" },
          ].map(({ label, name, placeholder, type = "text" }) => (
            <div key={name}>
              <label htmlFor={name} className="block font-medium text-white mb-2">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={errandData[name]}
                onChange={handleInput}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {error[name] && <p className="text-sm text-red-500 italic mt-1">{error[name]}</p>}
            </div>
          ))}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block font-medium text-white mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={errandData.notes}
              onChange={handleInput}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Provide extra details about the errand"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md bg-gray-900 text-white font-semibold hover:bg-black transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-orange-500 rounded-full animate-spin"></div>
              Posting Errand...
            </div>
          ) : (
            "Post Errand"
          )}
        </button>
      </form>
    </>
  )}
</div>

  );
}

export default PostErrand;
