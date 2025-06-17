import React, { useEffect, useRef } from 'react'

const ClockModal = ({ onClose }) => {
  const modalRef = useRef(null);
  
  // Handle keyboard events (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Add focus trap and keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    
    // Focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }
    
    // Prevent scrolling on the body while modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-dark border border-gray-700 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto focus:outline-none"
        tabIndex="-1"
      >
        <h2 id="modal-title" className="text-2xl font-bold mb-4 neon-text">About the Doomsday Clock</h2>
        
        <div className="space-y-4 text-gray-200">
          <p>
            The Doomsday Clock is a symbol that represents the likelihood of a human-made global catastrophe. 
            Maintained since 1947 by the Bulletin of the Atomic Scientists, it was originally conceived to represent 
            the threat of global nuclear war, but now also reflects climate change and disruptive technologies.
          </p>
          
          <p>
            The clock's setting is decided annually by the Bulletin's Science and Security Board in consultation 
            with its Board of Sponsors, which includes several Nobel laureates. The closer the clock is set to midnight, 
            the closer the world is estimated to be to global disaster. As of 2023, the clock was set at 90 seconds 
            to midnight, the closest it has ever been.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition focus:outline-none focus:ring-2 focus:ring-neon-yellow"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClockModal
