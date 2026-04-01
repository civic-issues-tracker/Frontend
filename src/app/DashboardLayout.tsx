import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SidebarAdmin from '../components/layout/SidebarAdmin';
import SidebarCitizen from '../components/layout/SidebarCitizen';
import SidebarOfficer from '../components/layout/SidebarOfficer';
import TopBar from '../components/layout/TopBar';
import Footer from '../components/layout/Footer';

const DashboardLayout = () => {
  const { user } = useAuth();
  const renderSidebar = () => {
    switch (user?.role_name) {
      case 'system_admin':
        return <SidebarAdmin />;
      case 'organization':
        return <SidebarOfficer />;
      default:
        return <SidebarCitizen />;
    }
  };

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      {renderSidebar()}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />

        {/* 3. Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet /> 
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;