import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-6 px-4 bg-dark border-t border-gray-800 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left text-sm text-gray-400">
          Powered by OpenAI GPT
        </div>
        
        <div className="flex gap-4 text-sm">
          <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Learn more about this project">
            About
          </a>
          <span className="text-gray-700">|</span>
          <a href="#" className="text-gray-400 hover:text-white transition" aria-label="View sources for the Doomsday Clock data">
            Sources
          </a>
          <span className="text-gray-700">|</span>
          <a href="#" className="text-gray-400 hover:text-white transition" aria-label="View disclaimer information">
            Disclaimer
          </a>
        </div>
        
        <div className="text-sm text-gray-500">
          &copy; {currentYear} Doomsday Clock GPT
        </div>
      </div>
    </footer>
  )
}

export default Footer
