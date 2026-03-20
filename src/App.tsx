import { RouterProvider } from "react-router-dom"
import router from './app/routes'
import './App.css'

function App() {

  return (
    // <AuthProvider>
    // <QueryClientProvider>
      <RouterProvider router={router} />
    // </QueryClientProvider>
    // </AuthProvider>
  )
}

export default App
