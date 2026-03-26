import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../features/home/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage' 

const router = createBrowserRouter(
  [
  {
    path: '/',
    element: <HomePage />,   
  },
  { 
    path: '/login', 
    element: <LoginPage /> 
  },
  { 
    path: '/signup', 
    element: <SignupPage /> 
  },
])

export default router