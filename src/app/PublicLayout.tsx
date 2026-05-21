import { Outlet, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TopBar from '../components/layout/TopBar';

const PublicLayout = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <TopBar />
      <Navbar /> 
      
      <main className="grow">
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;