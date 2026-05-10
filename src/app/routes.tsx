import { Navigate, createBrowserRouter } from 'react-router-dom'
import HomePage from '../features/home/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage' 
import ReportFormPage from '../features/report/ReportPage'
import LocalReports from '../features/report/components/LocalReports'
import PublicLayout from './PublicLayout'
import ProtectedRoute from '../features/auth/ProtectedAuth'     
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage'
import DashboardLayout from './DashboardLayout' 
import { mockReports } from '../../src/mock/mockReports';


const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />, 
    children: [
      { index: true, element: <HomePage /> }, 
      { path: 'login', element: <LoginPage /> },   
      { path: 'signup', element: <SignupPage /> }, 
      { path: 'reset-password', element: <ResetPasswordPage /> },
      
      { 
        path: 'report', 
        element: (
          <ProtectedRoute >
            <ReportFormPage /> 
          </ProtectedRoute>
        ) 
      },
      {
        path: 'local-reports', 
        element: (
          
            <LocalReports /> 
        
        )
      },
    ]
  },

  // // --- ADMIN DASHBOARD ---
  // {
  //   path: '/',
  //   element: (
  //     <ProtectedRoute allowedRoles={['system_admin']}>
  //       <DashboardLayout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     { 
  //       path: 'admin-dashboard', 
  //       element: <AdminOverviewPage reports={mockReports} /> 
  //     },
  //     { 
  //       path: 'admin/issues', 
  //       element: <AdminIssuesPage /> 
  //     },
  //     { 
  //       path: 'admin/analytics', 
  //       element: <AdminAnalyticsPage /> 
  //     },
  //     { 
  //       path: 'admin/users', 
  //       element: <AdminUsersPage /> 
  //     },
  //     { 
  //       path: 'admin/AiMonitoring', 
  //       element: <AdminAiMonitoringPage /> 
  //     },
  //     { 
  //       path: 'admin/organizations', 
  //       element: <AdminOrganizationsPage /> 
  //     },
  //     { 
  //       path: 'admin/categories', 
  //       element: <AdminCategoriesPage /> 
  //     },
  //     { 
  //       path: 'admin/settings', 
  //       element: <AdminSettingsPage /> 
  //     },
  //   ]
  // },

  // // --- ORGANIZATION ADMIN DASHBOARD ---
  // {
  //   path: '/organization-admin',
  //   element: (
  //     <ProtectedRoute allowedRoles={['organization_admin']}>
  //       <OrganizationAdminDashboardLayout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <Navigate to="dashboard" replace />,
  //     },
  //     {
  //       path: 'dashboard',
  //       element: <OrganizationAdminDashboardPage />,
  //     },
  //     {
  //       path: 'map',
  //       element: <OrganizationAdminIssuesPage />,
  //     },
  //     {
  //       path: 'resolved',
  //       element: <OrganizationAdminAnalyticsPage />,
  //     },
  //     {
  //       path: 'messages',
  //       element: <OrganizationAdminNotificationsPage />,
  //     },
  //     {
  //       path: 'settings',
  //       element: <OrganizationAdminSettingsPage />,
  //     },
  //     {
  //       path: 'notifications',
  //       element: <OrganizationAdminAlertsPage />,
  //     },
  //   ],
  // }
]);

export default router;