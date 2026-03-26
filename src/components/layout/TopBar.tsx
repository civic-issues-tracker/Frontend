import React from 'react'
import { FaFacebookF, FaTwitter, FaTelegramPlane, FaInstagram } from 'react-icons/fa'; 

const TopBar: React.FC = () => {
  return (
    <div className="w-full bg-primary py-2 px-6 lg:px-25">
      <div className="max-w-full mx-auto flex justify-between md:justify-end gap-6 items-center">
        <div className="hidden md:flex items-center gap-6 text-[12px] lg:text-[14px] font-header font-medium">
          <a href="tel:+251234567" className="text-secondary hover:opacity-70 transition-colors">
            +251 23 45 67
          </a>
          <a href="mailto:support@yegnafix.com" className="text-secondary hover:opacity-70 transition-colors">
            support@yegnafix.com
          </a>
        </div>

        <div className="flex items-center gap-5 ml-auto md:ml-0"> 
          <a href="#" className="text-secondary hover:opacity-70 transition-colors"><FaFacebookF size={13} /></a>
          <a href="#" className="text-secondary hover:opacity-70 transition-colors"><FaTwitter size={13} /></a>
          <a href="#" className="text-secondary hover:opacity-70 transition-colors"><FaTelegramPlane size={13} /></a>
          <a href="#" className="text-secondary hover:opacity-70 transition-colors"><FaInstagram size={13} /></a>
        </div>
      </div>
    </div>
  )
}

export default TopBar;