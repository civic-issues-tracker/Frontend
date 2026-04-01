import { RouterProvider } from 'react-router-dom'
import router from './app/routes'
// import { useEffect } from 'react'
import './App.css'

function App() {
  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const coords = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
          
  //         localStorage.setItem("userLocation", JSON.stringify(coords));
  //         console.log("Saved!", coords);
  //       }, 
  //       (error) => {
  //         console.error("User denied location", error);
  //       }
  //     );
  //   }
  // }, []);

  return <RouterProvider router={router} />;
}

export default App