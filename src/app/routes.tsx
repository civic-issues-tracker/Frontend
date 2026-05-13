import { createBrowserRouter, isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'
import HomePage from '../features/home/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage' 
import ReportFormPage from '../features/report/ReportPage'
import LocalReports from '../features/report/components/LocalReports'
import ProfilePage from '../features/dashboard-citizen/pages/ProfilePage'
import MyReportsPage from '../features/dashboard-citizen/pages/MyReportsPage'
import IssueDetailPage from '../features/issue-detail/IssueDetailPage'
import AllReportsPage from '../features/home/pages/AllReportsPage'
import PublicLayout from './PublicLayout'

import ProtectedRoute from '../features/auth/ProtectedAuth'     
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage'

const RouteErrorPage = () => {
  const error = useRouteError();

  let title = 'Unexpected Error'
  let message = 'Sorry, something went wrong.'

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Page Not Found' : `Error ${error.status}`
    message = error.statusText || 'An unexpected error occurred.'
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary px-6 py-12 text-center">
      <h1 className="text-4xl font-black text-secondary mb-4">{title}</h1>
      <p className="max-w-xl text-secondary/80 mb-8">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="px-6 py-3 rounded-full bg-secondary text-primary font-semibold uppercase tracking-widest">
          Go Home
        </Link>
        <Link to="/login" className="px-6 py-3 rounded-full border border-secondary text-secondary font-semibold uppercase tracking-widest">
          Sign In
        </Link>
      </div>
    </div>
  )
}


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
        path: 'all-reports',
        element: <AllReportsPage />
      },
      {
        path: 'local-reports',
        element: <LocalReports />
      },
      {
        path: 'reports/:id',
        element: <IssueDetailPage />
      },
    ],
    errorElement: <RouteErrorPage />
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <MyReportsPage />
      </ProtectedRoute>
    )
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