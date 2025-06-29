import React from 'react';
import Navbar from '../components/Navbar';

import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div >
      <Navbar />
      <Header />
      <main >
        <Outlet />
      </main>
      
    </div>
  );
};

export default MainLayout;
