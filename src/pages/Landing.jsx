import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaShieldAlt, FaUsers, FaComments, FaLightbulb, FaStar } from 'react-icons/fa';
import { MdOutlineTaskAlt } from 'react-icons/md';
import background from '../assets/bg-3.png';

function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 text-gray-800">

      {/* Hero Section */}
      <section
        className="mt-[3.25rem] flex flex-col md:flex-row items-center justify-between px-4 pt-4 pb-8 md:py-12 gap-4 md:gap-10"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #ffff, #ffff, #ffedd4)',
        }}
      >
        {/* Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto">
          <img
            src={background}
            alt="Errand helping visual"
            className="w-full h-full object-cover rounded-xl  border-orange-100"
          />
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2 text-center md:text-left max-w-xl -mt-9 md:mt-0">
          <h1 className="text-5xl md:text-5xl font-extrabold text-orange-500 mb-3 drop-shadow-sm">WhoGoHelp?</h1>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Need help with errands around your area? We connect you to trusted helpers in your community.
          </p>
          <Link to="/signup">
            <button className="mt-5 bg-orange-500 hover:bg-orange-700 text-white px-6 py-3 rounded-lg text-base md:text-lg shadow-sm transition-all duration-300">
              🚀 Get Started
            </button>
          </Link>
          <p className="mt-5 text-sm italic text-gray-500">
            Still learning, still building... ignore the landing page if e dey somehow 😅
          </p>
          <p className="text-sm text-gray-500">Version 4.1 — Updated on 23/06/2025</p>
        </div>
      </section>

      {/* What It Does */}
      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-bold text-orange-600 mb-10">A Smarter Way to Get Things Done</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div>
            <FaMapMarkerAlt size={40} className="text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Post Errands</h3>
            <p className="mt-2">Need help buying something or picking up an item? Just post it.</p>
          </div>
          <div>
            <FaShieldAlt size={40} className="text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Safe & Secure</h3>
            <p className="mt-2">We verify users and track activity to keep things transparent.</p>
          </div>
          <div>
            <FaComments size={40} className="text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Chat & Track</h3>
            <p className="mt-2">Stay connected with your helper while tracking progress in real-time.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-orange-50">
        <h2 className="text-3xl font-bold text-orange-600 text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
          <div>
            <MdOutlineTaskAlt size={35} className="text-orange-500 mx-auto mb-2" />
            <p><strong>1. Post an Errand</strong><br />Describe your task & reward.</p>
          </div>
          <div>
            <FaUsers size={35} className="text-orange-500 mx-auto mb-2" />
            <p><strong>2. Get Offers</strong><br />Helpers nearby offer to assist.</p>
          </div>
          <div>
            <FaComments size={35} className="text-orange-500 mx-auto mb-2" />
            <p><strong>3. Track & Chat</strong><br />Talk to your helper, monitor progress.</p>
          </div>
          <div>
            <FaStar size={35} className="text-orange-500 mx-auto mb-2" />
            <p><strong>4. Approve & Tip</strong><br />Confirm completion and tip your helper.</p>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-16 px-6 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-8 text-orange-400">Why Trust WhoGoHelp?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div>
            <FaMapMarkerAlt size={30} className="text-orange-300 mx-auto mb-2" />
            <p>Local People, Local Help</p>
          </div>
          <div>
            <FaShieldAlt size={30} className="text-orange-300 mx-auto mb-2" />
            <p>Built with Security in Mind</p>
          </div>
          <div>
            <FaUsers size={30} className="text-orange-300 mx-auto mb-2" />
            <p>Transparent Ratings & Reviews</p>
          </div>
          <div>
            <FaLightbulb size={30} className="text-orange-300 mx-auto mb-2" />
            <p>Still Growing, But We're Serious</p>
          </div>
        </div>
        <p className="mt-8 italic text-orange-200 text-sm">I’m still an intermediate dev 😅, but I’m building something real. Na small small.</p>
      </section>


      {/* Call to Action */}
      <section className="py-16 px-6 text-center bg-orange-100">
        <h2 className="text-3xl font-bold text-orange-600">Join the Movement</h2>
        <p className="mt-2 text-lg">Be a helper, post your errands, or collaborate with us!</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md">Become a Helper</button>
          </Link>
          <Link to="/login">
            <button className="bg-white text-orange-600 border border-orange-500 px-6 py-3 rounded-md hover:bg-orange-200">Start Posting</button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p className="text-orange-400 font-semibold text-lg">WhoGoHelp? – Community-Powered Help</p>
        <div className="mt-2 space-x-4 text-sm">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="#" className="hover:underline">Privacy</Link>
        </div>
        <p className="mt-2 text-xs text-gray-500">Built in 🇳🇬 with passion and pure hustle © 2025</p>
        <p className="mt-2 text-xs text-gray-500">Email: Ogunmolaibrahim26@gmail.com</p>
        <p className="mt-2 text-xs text-gray-500">07050755568</p>


      </footer>

    </div>
  );
}

export default LandingPage;