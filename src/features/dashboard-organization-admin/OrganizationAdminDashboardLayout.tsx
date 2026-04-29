import { Outlet } from 'react-router-dom';
import SidebarOrganizationAdmin from '../../components/layout/SidebarOrganizationAdmin';

const OrganizationAdminDashboardLayout = () => {
  return (
    <div className="flex min-h-screen overflow-hidden bg-[#F6F2EA]">
      <SidebarOrganizationAdmin />
      <main className="flex-1 overflow-y-auto px-4 py-3">
        <Outlet />
      </main>
    </div>
  );
};

export default OrganizationAdminDashboardLayout;
