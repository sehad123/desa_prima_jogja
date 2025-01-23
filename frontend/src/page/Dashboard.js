import React from "react";
import DashboardPage from '../components/Dashboard/DashboardPage';
import Beranda from '../layouts/BerandaLayout';

const Dashboard = () => {
  return (
    <Beranda>
      <DashboardPage />
    </Beranda>
  );
};

export default Dashboard;