import { Outlet } from 'react-router-dom';
import SidebarOfficer from '../../components/layout/SidebarOfficer';

const OfficerDashboardLayout = () => {
	return (
		<div className="flex min-h-screen overflow-hidden bg-[#F6F2EA]">
			<SidebarOfficer />
			<main className="flex-1 overflow-y-auto px-4 py-3">
				<Outlet />
			</main>
		</div>
	);
};

export default OfficerDashboardLayout;
