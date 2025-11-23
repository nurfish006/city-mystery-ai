import Link from 'next/link'


export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          City Mystery AI Explorer
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Uncover hidden cities through cryptic clues, ancient maps, and AI-powered mysteries. 
          Start your geographical adventure today!
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/play" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Playing
          </Link>
          <button className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🧩</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Cryptic Clues</h3>
          <p className="text-gray-600">Solve AI-generated riddles and uncover hidden cities</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🗺️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
          <p className="text-gray-600">Watch maps reveal themselves as you progress</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏆</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Compete & Collect</h3>
          <p className="text-gray-600">Earn points, climb leaderboards, and collect city cards</p>
        </div>
      </section>
    </main>
  )
}