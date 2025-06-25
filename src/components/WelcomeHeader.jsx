import React from 'react';
import { useDashboard } from '../context/DashboardContext';

const WelcomeHeader = ({ username }) => {
  const { dashboardData } = useDashboard();

  const displayName = username || dashboardData?.username;

  return (
    <div className="text-left pt-15">
      <h2 className="text-2xl text-orange-400 font-bold">
        {displayName ? `Hey, ${displayName}` : 'Loading username...'}
      </h2>
    </div>
  );
};

export default WelcomeHeader;
