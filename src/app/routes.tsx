import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../features/home/HomePage'  // adjust path

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,   
  },
  // add more routes later
])

export default router