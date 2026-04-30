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
import AdminOverviewPage from '../features/dashboard-admin/pages/AdminOverviewPage' 
import AdminOrganizationsPage from '../features/dashboard-admin/pages/AdminOrganizationsPage'
import AdminCategoriesPage from '../features/dashboard-admin/pages/AdminCategoriesPage'
import { mockReports } from '../../src/mock/mockReports';
import AdminIssuesPage from '../features/dashboard-admin/pages/AdminIssuesPage'
import AdminAnalyticsPage from '../features/dashboard-admin/pages/AdminAnalyticsPage'
import AdminUsersPage from '../features/dashboard-admin/pages/AdminUsersPage'
import AdminAiMonitoringPage from '../features/dashboard-admin/pages/AdminAiMonitoringPage'
import AdminSettingsPage from '../features/dashboard-admin/pages/AdminSettingsPage'
<<<<<<< HEAD
import OrganizationAdminDashboardLayout from '../features/dashboard-organization-admin/OrganizationAdminDashboardLayout'
import OrganizationAdminDashboardPage from '../features/dashboard-organization-admin/pages/OrganizationAdminDashboardPage'
import OrganizationAdminIssuesPage from '../features/dashboard-organization-admin/pages/OrganizationAdminIssuesPage'
import OrganizationAdminAnalyticsPage from '../features/dashboard-organization-admin/pages/OrganizationAdminAnalyticsPage'
import OrganizationAdminNotificationsPage from '../features/dashboard-organization-admin/pages/OrganizationAdminNotificationsPage'
import OrganizationAdminSettingsPage from '../features/dashboard-organization-admin/pages/OrganizationAdminSettingsPage'
import OrganizationAdminAlertsPage from '../features/dashboard-organization-admin/pages/OrganizationAdminAlertsPage'
=======
import OfficerDashboardLayout from '../features/dashboard-officer/OfficerDashboardLayout'
import OfficerDashboardPage from '../features/dashboard-officer/pages/OfficerDashboardPage'
import OfficerIssuesPage from '../features/dashboard-officer/pages/OfficerIssuesPage'
import OfficerAnalyticsPage from '../features/dashboard-officer/pages/OfficerAnalyticsPage'
import OfficerNotificationsPage from '../features/dashboard-officer/pages/OfficerNotificationsPage'
import OfficerSettingsPage from '../features/dashboard-officer/pages/OfficerSettingsPage'
import OfficerAlertsPage from '../features/dashboard-officer/pages/OfficerAlertsPage'
>>>>>>> origin/master



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

  // --- ADMIN DASHBOARD ---
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={['system_admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { 
        path: 'admin-dashboard', 
        element: <AdminOverviewPage reports={mockReports} /> 
      },
      { 
        path: 'admin/issues', 
        element: <AdminIssuesPage /> 
      },
      { 
        path: 'admin/analytics', 
        element: <AdminAnalyticsPage /> 
      },
      { 
        path: 'admin/users', 
        element: <AdminUsersPage /> 
      },
      { 
        path: 'admin/AiMonitoring', 
        element: <AdminAiMonitoringPage /> 
      },
      { 
        path: 'admin/organizations', 
        element: <AdminOrganizationsPage /> 
      },
      { 
        path: 'admin/categories', 
        element: <AdminCategoriesPage /> 
      },
      { 
        path: 'admin/settings', 
        element: <AdminSettingsPage /> 
      },
    ]
  },

      // --- ORGANIZATION ADMIN DASHBOARD ---
  {
    path: '/organization-admin',
    element: (
      <ProtectedRoute allowedRoles={['organization_admin']}>
        <OrganizationAdminDashboardLayout />
  // --- OFFICER DASHBOARD ---
  {
    path: '/officer',
    element: (
      <ProtectedRoute allowedRoles={['officer']}>
        <OfficerDashboardLayout />
      
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
<<<<<<< HEAD
        element: <OrganizationAdminDashboardPage />,
      },
      {
        path: 'map',
        element: <OrganizationAdminIssuesPage />,
      },
      {
        path: 'resolved',
        element: <OrganizationAdminAnalyticsPage />,
      },
      {
        path: 'messages',
        element: <OrganizationAdminNotificationsPage />,
      },
      {
        path: 'settings',
        element: <OrganizationAdminSettingsPage />,
      },
      {
        path: 'notifications',
        element: <OrganizationAdminAlertsPage />,
=======
        element: <OfficerDashboardPage />,
      },
      {
        path: 'map',
        element: <OfficerIssuesPage />,
      },
      {
        path: 'resolved',
        element: <OfficerAnalyticsPage />,
      },
      {
        path: 'messages',
        element: <OfficerNotificationsPage />,
      },
      {
        path: 'settings',
        element: <OfficerSettingsPage />,
      },
      {
        path: 'notifications',
        element: <OfficerAlertsPage />,
>>>>>>> origin/master
      },
    ],
  }
]);

export default router;