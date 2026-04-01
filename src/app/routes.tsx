import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../features/home/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage' 
import ReportFormPage from '../features/report/ReportPage'
import LocalReports from '../features/report/components/LocalReports'
import PublicLayout from './PublicLayout'
import ProtectedRoute from '../features/auth/ProtectedAuth'     



const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />, 
    children: [
      { path: '/', element: <HomePage /> }, 
      { path: '/login', element: <LoginPage /> },   
      { path: '/signup', element: <SignupPage /> }, 
      // { 
      //   path: '/dashboard', 
      //   element: (
      //     <ProtectedRoute>
      //       <DashboardPage /> {/* PROTECTED */}
      //     </ProtectedRoute>
      //   ) 
      // },
      { 
        path: '/report', 
        element: (
          <ProtectedRoute>
            <ReportFormPage /> 
          </ProtectedRoute>
        ) 
      },
      {
        path: '/local-reports', 
        element: (
          <ProtectedRoute>
            <LocalReports /> 
          </ProtectedRoute>
        )
      }
    ]
  }
]);

export default router;