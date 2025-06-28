import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  useEffect(() => {
    document.title = "About - WhoGoHelp";
  }, []);

  return (
        <div className="text-gray-800 mt-16 bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-tr from-orange-600 via-red-600 to-yellow-500 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4 z-10 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold">WhoGoHelp — Get Help, Give Help</h1>
          <blockquote className="italic text-orange-100 mt-2">“Abeg, who go help me run small errand?”</blockquote>
          <p className="text-md md:text-lg max-w-3xl mx-auto font-light">
            From food deliveries to quick favors, WhoGoHelp is your neighborhood’s helping hand — connecting people who need help with those ready to assist.
          </p>
        </div>
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white text-gray-800">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <ul className="list-disc pl-5 space-y-2 text-lg leading-relaxed">
            <li><strong>You need help?</strong> Post your errand: food, delivery, pickup, buying something, anything.</li>
            <li><strong>Someone nearby accepts it</strong> — trusted, verified, and ready.</li>
            <li><strong>They complete it, you confirm</strong>, and reward them for their time and energy.</li>
          </ul>
        </div>
      </section>

      {/* Why Join as a Helper */}
      <section className="py-16 px-6 bg-gradient-to-r from-gray-50 to-white border-t">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Why Join as a Helper?</h2>
          <ul className="grid sm:grid-cols-2 gap-4 text-gray-700 text-md">
            <li className="bg-white p-4 rounded-md shadow-sm">🛵 Make money daily from small errands</li>
            <li className="bg-white p-4 rounded-md shadow-sm">🌟 Build trust and earn ratings</li>
            <li className="bg-white p-4 rounded-md shadow-sm">💸 Get paid fast once a task is done</li>
            <li className="bg-white p-4 rounded-md shadow-sm">🔧 Use your time, bike, or skills to earn</li>
          </ul>
        </div>
      </section>

      {/* Earnings + Trust */}
      <section className="py-20 bg-gray-100 px-6 border-t">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Earning System & Incentives</h2>
            <ul className="space-y-3 text-gray-700">
              <li>✔ Fair Rewards — every errand comes with a set price. You accept only what you can do.</li>
              <li>💰 Tips & Bonuses — Posters can give extra tips if you impress.</li>
              <li>📈 Ratings = More Jobs — The better your rating, the more errands you’ll see first.</li>
              <li>🎖 Loyalty Tiers — Coming soon: badges, bonuses, and exclusive jobs.</li>
              <li>👥 Referral Bonuses — Invite a friend and earn together.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Trust, Safety & Transparency</h2>
            <ul className="space-y-3 text-gray-700">
              <li>🛡 Verified users and secure errand tracking</li>
              <li>📞 Admins can step in if there’s any issue</li>
              <li>🔐 Secure chat, cancellations, and helper ratings</li>
              <li>🧾 Coming soon: Wallets, live tracking, and ID verification</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bigger Than App */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">It’s Bigger Than an App — It’s a Movement</h2>
          <p className="text-lg leading-relaxed">
            We’re giving real people in local communities the chance to earn, solve problems, and build trust — one errand at a time.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-200 text-left text-sm bg-gray-900 rounded-lg p-6">
            <ul className="space-y-2">
              <li>🎓 Students hustling for lunch money</li>
              <li>🧑‍🦱 Youths without formal work</li>
            </ul>
            <ul className="space-y-2">
              <li>👩‍👧 Families needing extra hands</li>
              <li>🏃 Busy people who just need things done</li>
            </ul>
          </div>
          <p className="text-sm mt-6 text-gray-400 italic">Built by us. For us. 🇳🇬</p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
