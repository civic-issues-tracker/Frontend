import { createBrowserRouter } from 'react-router-dom'
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
  }
]);

export default router;