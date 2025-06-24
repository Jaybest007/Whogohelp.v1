// src/components/ActionCards.jsx

import React from 'react';

const ActionCards = ({post, setPost}) => {
  return (
    
    <div className="grid grid-cols-1 gap-4 ">
      <button 
      className="bg-orange-500 text-white p-3 rounded-xl font-semibold text-lg shadow-lg"
      onClick={()=> setPost(!post)}
      >
        {post ? 'Cancel' : 'Post Errand'}
      </button>
      {/* <button className="bg-orange-300 text-black py-4 rounded-xl font-semibold text-sm shadow-lg">
        Accept Errand
      </button> */}
    </div>
  );
};

export default ActionCards;