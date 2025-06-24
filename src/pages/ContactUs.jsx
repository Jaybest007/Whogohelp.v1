import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ContactPage() {
  useEffect(() => {
    document.title = "Contact - WhoGoHelp";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    message: "",
    server: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(prev => ({ ...prev, [name]: "" }));

    if (name === "email" && value && !emailRegex.test(value)) {
      setError(prev => ({ ...prev, email: "Invalid email address" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { name, email, message } = formData;

    const newError = {
      name: name.trim() ? "" : "Name can't be empty",
      email: email.trim() ? "" : "Email can't be empty",
      message: message.trim() ? "" : "Message can't be empty",
    };

    setError(newError);

    const hasError = Object.values(newError).some(e => e !== "");
    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://api-hvzs.onrender.com/api/contact_us.php",
        formData,
        { withCredentials: true }
      );

      if (response.data) {
        toast.success(response.data.message);
        setFormData({ name: "", email: "", message: "" });
        setError({ name: "", email: "", message: "", server: "" });
        // navigate("/contact"); // optional, already on the page
      } else {
        toast.error(response.data.message);
        setError(prev => ({
          ...prev,
          server: response.error?.server || "Something went wrong",
        }));
      }
    } catch (err) {
      console.error("API Error:", err);
      setMessage("Failed to send message. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center px-4 py-16 pt-25">
      <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
        Got questions, feedback, or want to collaborate on the <span className="font-semibold text-orange-500">WhoGoHelp?</span> project?
        I’d love to hear from you. Fill the form or use any of the contact details below.
      </p>

      {message && <p className='bg-green-200 text-sm text-center p-5 mb-2 rounded-2xl'>{message}</p>}
      {error.server && <p className='bg-red-400 text-sm text-center p-5 mb-2 rounded-2xl'>{error.server}</p>}

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 md:p-10 grid md:grid-cols-2 gap-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="John Doe"
              required
              minLength={3}
            />
            <span className="text-red-600 text-sm">{error.name}</span>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="you@example.com"
              required
              minLength={3}
              autoComplete="off"
            />
            <span className="text-red-600 text-sm">{error.email}</span>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInput}
              rows="4"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Your message here..."
              required
              minLength={2}
            />
            <span className="text-red-600 text-sm">{error.message}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-4 border-white border-t-orange-600 rounded-full animate-spin" />
              </div>
            ) : (
              "Send message"
            )}
          </button>
        </form>

        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-xl font-bold text-orange-600 mb-2">Reach Me</h2>
            <p className="text-gray-700">
              Ibraheem Ogunmola  
              <br />Project Developer, WhoGoHelp?
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Email:</h3>
            <p className="text-orange-500 break-all">ogunmolaibrahim26@gmail.com</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Phone/WhatsApp:</h3>
            <p className="text-orange-500">+234 705 075 5568</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">GitHub:</h3>
            <p className="text-orange-500">@Jaybest007</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Twitter:</h3>
            <p className="text-orange-500">@Ogunmolaibrahe1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
