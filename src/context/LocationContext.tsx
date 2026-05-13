import React, { createContext, useState, useEffect } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface LocationContextType {
  location: LocationData | null;
  isLoading: boolean;
  requestLocation: () => void;
  searchLocations: (query: string) => Promise<any[]>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'YegnaFix_App_v1' 
          }
        }
      );
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      
      // Returns the human-readable address if available
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error("Global Geocoding failed:", error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const requestLocation = () => {
  if (!("geolocation" in navigator)) return;
  
  setIsLoading(true);
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const address = await fetchAddress(latitude, longitude);
      
      setLocation({ lat: latitude, lng: longitude, address });
      
      setIsLoading(false);
    },
    (error) => {
      console.warn(error.message);
      setIsLoading(false);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};

  useEffect(() => {
    if (!location) {
      requestLocation();
    }
  }, []);

  const searchLocations = async (query: string) => {
  if (query.length < 3) return []; // Don't search for tiny strings
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&addressdetails=1&limit=10&viewbox=38.6,8.8,38.9,9.1&bounded=1&countrycodes=et`,
      {
        headers: {
          'User-Agent': 'YegnaFix_App_v1_contact_hebronenyeww@gmail.com' 
        }
      }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

  return (
    <LocationContext.Provider value={{ location, isLoading, requestLocation, searchLocations }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
