import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { IoLocationSharp } from "react-icons/io5";
import IssueMapPicker from '../../report/components/IssueMapPicker';
import { mockReports } from '../../../mock/mockReports';
import { useGeoLocation } from '../../../hooks/useGeolocation'; 

const HeroSection: React.FC = () => {
  const { location, requestLocation, isLoading } = useGeoLocation(); // Get location data

  return (
    <div className="w-full flex flex-col">      
      <div className='max-w-full px-6 lg:px-20  my-8 md:my-14 flex flex-col lg:flex-row gap-12 lg:gap-8 items-center'>
        
        <div className='w-full lg:max-w-2xl text-center lg:text-left flex flex-col items-center lg:items-start'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl text-secondary font-header font-bold leading-tight'>
            Report & View Local <span className='text-secondary/85'>Problems</span>
          </h1>
          
          <p className='font-body text-base md:text-lg opacity-80 mt-6 max-w-lg'>
            Like fire hazards, water-related issues, electricity-related problems, and road damage.
          </p>
          
          <div className='flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 mt-8 w-full sm:w-auto'>
            <Button variant='primary' className="w-full sm:w-auto px-8">
              <Link to="/report">Report Issue</Link>
            </Button>
            {/* Added onClick and loading text */}
            <Button 
              variant='secondary' 
              onClick={requestLocation}
              className='flex items-center justify-center gap-2 w-full sm:w-auto px-6'
            >
              <IoLocationSharp className='text-secondary size-5' />
              {isLoading ? "Locating..." : "Use current location"}
            </Button>
          </div>
        </div>

        {/* Right Side: Map Component */}
        <div className='w-full lg:w-full min-h-100 h-125 lg:h-137.5 bg-slate-100 rounded-3xl overflow-hidden relative border-2 border-primary/20'>
            <IssueMapPicker 
              reports={mockReports} 
              selectedLocation={location ? { lat: location.lat, lng: location.lng } : null} 
            />        
        </div>
        
      </div>
    </div>
  )
}

export default HeroSection