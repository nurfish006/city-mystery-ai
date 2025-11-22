export default function PlayPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Game Arena</h1>
        <p className="text-gray-600 mb-8">
          The adventure begins here! This is where the magic will happen.
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map Preview Will Appear Here</span>
            </div>
            
            <div className="h-32 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <span className="text-gray-500">Clue Cards Will Display Here</span>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button className="bg-gray-300 px-6 py-2 rounded-lg" disabled>
                Get Hint
              </button>
              <button className="bg-gray-300 px-6 py-2 rounded-lg" disabled>
                Submit Guess
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}