import React from 'react';
import Cards from '../Cards';
import Projects from '../Project/Projects';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      <h4 className='title px-3'>Dashboard</h4>
      <Cards />
      <Projects role={user?.role} userName={user.username} />
    </div>
  );
};
export default Dashboard;
