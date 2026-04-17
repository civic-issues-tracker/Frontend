import { NavLink } from 'react-router-dom';
import {
  Bell,
  CheckSquare,
  ClipboardList,
  Map,
  MessageSquare,
  Settings,
} from 'lucide-react';

const SidebarOfficer = () => {
  const navItems = [
    { label: 'My Queue', to: '/officer/dashboard', icon: ClipboardList, badge: 2 },
    { label: 'District Map', to: '/officer/map', icon: Map },
    { label: 'Resolved Tickets', to: '/officer/resolved', icon: CheckSquare },
    { label: 'Messages', to: '/officer/messages', icon: MessageSquare },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col overflow-hidden rounded-r-[4rem] bg-[#6E4B33] py-8 text-[#F6EEE3] shadow-md">
      <div className="mb-12 px-8 border-b border-white/10 pb-4">
        <h1 className="text-[32px] font-extrabold leading-none tracking-tight">CivicWorks</h1>
        <p className="text-xs text-[#E9D6C0]">Officer Dashboard</p>
      </div>

      <div className="mb-6 mx-4 rounded-2xl bg-[#5D3F2C] p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7D5A42] text-xs font-bold">
            JD
          </span>
          <div>
            <p className="text-sm font-semibold">Officer J. Doe</p>
            <p className="flex items-center gap-1 text-[11px] text-[#7DE2A7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2BD96B]" />
              On Duty
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-r-4xl rounded-l-none px-6 py-4 text-sm transition ${
                  isActive ? 'bg-white/10 border-l-4 border-white text-white font-bold' : 'opacity-70 hover:opacity-100 hover:bg-white/5 border-l-4 border-transparent'
                }`
              }
            >
              <span className="flex items-center gap-2">
                <Icon size={14} />
                {item.label}
              </span>
              {item.badge ? (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EE3E4A] px-1 text-[10px] font-bold">
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      <div className="mx-4 mt-auto mb-4 rounded-2xl border border-white/10 bg-[#5D3F2C] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E7D6C2]">Shift Snapshot</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#F3E5D7]">
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <p className="text-[#D7BFA8]">Active</p>
            <p className="mt-1 font-bold">4 tickets</p>
          </div>
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <p className="text-[#D7BFA8]">Area</p>
            <p className="mt-1 font-bold">Bole</p>
          </div>
        </div>
      </div>

      <div className="space-y-1 px-4 pb-3">
        <NavLink
          to="/officer/settings"
          className={({ isActive }) =>
            `flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm transition ${
              isActive ? 'bg-white/10 text-white font-semibold' : 'text-[#EFDCC6] hover:bg-[#5D3F2C]/70'
            }`
          }
        >
          <Settings size={14} />
          Settings
        </NavLink>
        <NavLink
          to="/officer/notifications"
          className={({ isActive }) =>
            `flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm transition ${
              isActive ? 'bg-white/10 text-white font-semibold' : 'text-[#EFDCC6] hover:bg-[#5D3F2C]/70'
            }`
          }
        >
          <Bell size={14} />
          Notifications
        </NavLink>
      </div>
    </aside>
  );
};

export default SidebarOfficer;