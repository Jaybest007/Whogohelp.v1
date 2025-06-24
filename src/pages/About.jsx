
import React, { useEffect } from "react";
import { Link } from "react-router-dom";


const AboutUs = () => {
   useEffect( ()=> {
        document.title = "About - WhoGoHelp";
    }, []);
  return (
    <div className="bg-orange-50 p-5 text-gray-900 min-h-screen pt-25 py-12 md:px-20 lg:px-32">
      <h1 className="text-4xl font-bold text-center text-orange-600">WhoGoHelp</h1>
      <p className="text-lg text-center mt-4">Bridging Communities, One Errand at a Time</p>

      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-orange-500">What We Do</h2>
        <p className="mt-4">
          WhoGoHelp connects people within the same locality who need help with errands—buying items, delivery, queueing—with others willing to assist for a small fee or community credit.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-3xl font-semibold text-orange-500">How It Works</h2>
        <ul className="list-disc ml-6 mt-4 space-y-2">
          <li>Post a Request – Need an errand done? Create a task and set the reward.</li>
          <li>Get Connected – Our system matches you with people in your area ready to help.</li>
          <li>Earn & Assist – Complete the task, receive payment, and build community connections.</li>
        </ul>
      </section>

      <div className="text-center mt-12">
        <Link to="/signup">
            <button className="bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition">
          Join the Movement
        </button>
        </Link>
        
      </div>
    </div>
  );
};
export default AboutUs;
