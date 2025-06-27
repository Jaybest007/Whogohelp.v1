import React from "react";

const MaintainanceMode = () => {

        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-neutral-900 to-slate-950 px-4">
  <div className="text-center max-w-md space-y-6 p-8 bg-black/50 border border-yellow-700 rounded-2xl shadow-xl backdrop-blur-md">
    <div className="flex justify-center">
      <div className="w-16 h-16 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center shadow-md animate-bounce">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
        </svg>
      </div>
    </div>
    <h1 className="text-3xl font-bold text-yellow-300">Under Construction</h1>
    <p className="text-gray-300 text-sm leading-relaxed">
      WhoGoHelp is currently upgrading the experience. 🚧 We’re laying digital bricks and tightening a few bolts. Please check back soon.
    </p>
    <p className="text-xs text-gray-500">
      Questions? Reach us at <span className="underline">whogohelpdesk@gmail.com</span>
    </p>
  </div>
</div>

        )
}
export default MaintainanceMode;