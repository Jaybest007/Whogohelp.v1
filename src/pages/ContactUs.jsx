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
        "http://localhost/api/contact_us.php",
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
      toast.error("Failed to send message. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white relative flex items-center justify-center px-4 py-20 overflow-hidden">
  {/* Decorative Glow Blobs */}
  <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-orange-200 rounded-full filter blur-3xl opacity-40 animate-pulse" />
  <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-yellow-300 rounded-full filter blur-2xl opacity-30 animate-ping" />

  {/* Main Content */}
  <div className="max-w-5xl w-full z-10">
    <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 text-center mb-3">Contact Us</h1>
    <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-10">
      Got questions, feedback, or want to collaborate on <span className="text-orange-500 font-semibold">WhoGoHelp</span>? Drop us a message — we're here for it.
    </p>

    {message && (
      <p className="bg-green-100 text-green-800 font-medium p-4 rounded-xl mb-4 text-center shadow">{message}</p>
    )}
    {error.server && (
      <p className="bg-red-100 text-red-800 font-medium p-4 rounded-xl mb-4 text-center shadow">{error.server}</p>
    )}

    <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-tr from-neutral-100 via-white to-white rounded-2xl shadow-xl mt-6 border border-gray-200 p-8 md:p-12 transition-all duration-500">
      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInput}
            placeholder="Jane Doe"
            required
            minLength={3}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-red-500 text-sm mt-1">{error.name}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInput}
            placeholder="you@example.com"
            required
            autoComplete="off"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-red-500 text-sm mt-1">{error.email}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInput}
            placeholder="Tell us how we can help you..."
            rows="5"
            required
            minLength={2}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-orange-600 rounded-full animate-spin" />
              Sending...
            </div>
          ) : (
            "Send Message"
          )}
        </button>
      </form>

      {/* Contact Info */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-orange-600 mb-2">Reach Me</h2>
          <p className="text-gray-700">
            <span className="font-medium">Ibraheem Ogunmola</span><br />
            Project Developer, WhoGoHelp
          </p>
        </div>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">📧 Email:</span> <span className="text-orange-500 break-all">ogunmolaibrahim26@gmail.com</span></p>
          <p><span className="font-semibold">📱 Phone/WhatsApp:</span> <span className="text-orange-500">+234 705 075 5568</span></p>
          <p><span className="font-semibold">💻 GitHub:</span> <span className="text-orange-500">@Jaybest007</span></p>
          <p><span className="font-semibold">🐦 Twitter:</span> <span className="text-orange-500">@Ogunmolaibrahe1</span></p>
        </div>
      </div>
    </div>
  </div>
</div>


  );
}

export default ContactPage;
