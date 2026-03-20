import React from 'react'
import HeroSection from './components/HeroSection'
import RecentReports from './components/RecentReports'
import HowToReport from './components/HowToReport'
import HowToReportTelegram from './components/HowToReportTelegram'
import QuickStats from './components/QuickStats'
import CallToAction from './components/CallToAction'

const HomePage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <HeroSection />
      <main className="grow container mx-auto px-4 py-12 space-y-16 md:space-y-24">
        <RecentReports />
        <HowToReport />
        <HowToReportTelegram />
        <QuickStats />
      </main>
      <CallToAction />
    </div>

  )
}

export default HomePage