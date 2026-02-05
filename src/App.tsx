import { useState } from 'react'
import { cn } from '@/lib/utils'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Vite + React + Tailwind</h1>
        <div className={cn("p-4 rounded-md mb-6", count % 2 === 0 ? "bg-blue-100" : "bg-green-100")}>
          <p className="text-lg font-medium text-gray-700">
            Count is: <span className="font-bold">{count}</span>
          </p>
        </div>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Increment
        </button>
      </div>
    </div>
  )
}

export default App