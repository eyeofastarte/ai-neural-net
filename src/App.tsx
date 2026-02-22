import { useState } from 'react'
import TensorFlowChecker from './TensorFlowChecker'
import DigitRecognizer from './DigitRecognizer'

function App() {
  const [activeTab, setActiveTab] = useState<'checker' | 'recognizer'>('recognizer')

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 pt-6 pb-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('recognizer')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'recognizer'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          Digit Recognizer
        </button>
        <button
          onClick={() => setActiveTab('checker')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'checker'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          System Availability
        </button>
      </div>

      {/* Content */}
      {activeTab === 'checker' && (
        <div className="max-w-6xl mx-auto p-8 text-center">
          <TensorFlowChecker />
        </div>
      )}
      {activeTab === 'recognizer' && <DigitRecognizer />}
    </div>
  )
}

export default App