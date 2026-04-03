import HeroSection from './components/HeroSection'
import RecentReports from './components/RecentReports'
import HowToReport from './components/HowToReport'
import QuickStats from './components/QuickStats'
import CallToAction from './components/CallToAction'
import { mockReports } from '../../mock/mockReports'


const HomePage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col relative'>
      {/* <header className="sticky top-0 z-100 w-full">
        
        <Navbar />
      </header> */}

      {/*MAIN CONTENT SECTIONS*/}
      <main className='w-full flex flex-col'>
        
        <div className='w-full'>
          <HeroSection />
        </div>

        <div className='w-full'>
          <HowToReport />
        </div>

        <div className='w-full'>
          <RecentReports reports={mockReports} />
        </div>

        <div className='w-full'>
          <QuickStats />
        </div>

        <div className='w-full'>
          <CallToAction />
        </div>

        
      </main>
    </div>
  )
}

export default HomePage