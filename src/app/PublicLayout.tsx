import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TopBar from '../components/layout/TopBar';

const PublicLayout = () => {
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