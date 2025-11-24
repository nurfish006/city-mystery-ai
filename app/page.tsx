'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌍</span>
              </div>
              <span className="text-xl font-bold text-gray-800">City Mystery Explorer</span>
            </div>
            <Link 
              href="/play"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Start Playing
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Discover Hidden Cities
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Uncover mysterious cities through cryptic clues, interactive maps, and AI-powered hints. 
            Test your geography skills and explore the world one clue at a time!
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Link 
              href="/play"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              🎮 Start Adventure
            </Link>
            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              📚 How to Play
            </button>
          </div>

          {/* Feature Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧩</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Clues</h3>
                <p className="text-gray-600">AI-powered hints that adapt to your progress</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
                <p className="text-gray-600">Watch maps reveal themselves with each clue</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Compete & Learn</h3>
                <p className="text-gray-600">Earn points and discover new cities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Start Game</h3>
              <p className="text-gray-600 text-sm">Choose your difficulty and game mode</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Clues</h3>
              <p className="text-gray-600 text-sm">Receive hints about the hidden city</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Study Map</h3>
              <p className="text-gray-600 text-sm">Watch the map clear with each clue</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Make Guess</h3>
              <p className="text-gray-600 text-sm">Identify the city and earn points</p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Game Modes</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌎</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">World Explorer</h3>
              <p className="text-gray-600 mb-6">
                Discover cities from around the globe with general geographical and cultural clues.
              </p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li>• Cities from all continents</li>
                <li>• Geographical and landmark hints</li>
                <li>• Perfect for global knowledge</li>
              </ul>
              <Link 
                href="/play?mode=world"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Play World Mode
              </Link>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🇪🇹</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Ethiopia Explorer</h3>
              <p className="text-gray-600 mb-6">
                Dive into Ethiopian culture with historical and mythological clues about ancient cities.
              </p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li>• Ethiopian cities only</li>
                <li>• Cultural and historical hints</li>
                <li>• Learn about Ethiopian heritage</li>
              </ul>
              <Link 
                href="/play?mode=ethiopia"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Play Ethiopia Mode
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of players discovering the world through mystery and adventure
          </p>
          <Link 
            href="/play"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg inline-block"
          >
            🚀 Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 City Mystery Explorer. Built with curiosity and code.</p>
        </div>
      </footer>
    </main>
  )
}