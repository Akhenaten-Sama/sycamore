import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export function MobileOnboardingTour({ 
  steps, 
  storageKey, 
  onComplete,
  showOnMount = true 
}) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (showOnMount) {
      const hasSeenTour = localStorage.getItem(storageKey)
      if (!hasSeenTour) {
        setTimeout(() => setIsActive(true), 500)
      }
    }
  }, [storageKey, showOnMount])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true')
    setIsActive(false)
    onComplete?.()
  }

  if (!isActive || !steps[currentStep]) return null

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4 animate-slideUp">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-medium text-blue-600">
            Step {currentStep + 1} of {steps.length}
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {step.title}
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {step.content}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

MobileOnboardingTour.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    target: PropTypes.string,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
  })).isRequired,
  storageKey: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  showOnMount: PropTypes.bool
}

export function restartMobileTour(storageKey) {
  localStorage.removeItem(storageKey)
  window.location.reload()
}
