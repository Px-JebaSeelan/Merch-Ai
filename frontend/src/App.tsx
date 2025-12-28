import { useState } from 'react';
import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a design prompt');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/generate`, { prompt });
      setGeneratedImage(response.data.image);
    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans antialiased">
      {/* Header */}
      <header className="w-full py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Merch AI
            </h1>
          </div>
          <span className="text-sm text-white/50 font-medium">AI-Powered Design Studio</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-12 flex flex-col items-center">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          {/* Hero Section */}
          <div className="text-center mb-12 mt-8">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                Create Stunning T-Shirt Designs
              </span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Describe your vision and watch AI bring it to life. Professional-quality designs in seconds.
            </p>
          </div>

          {/* Input Section */}
          <div className="max-w-2xl w-full mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-lg shadow-violet-500/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="A retro synthwave astronaut, neon colors, cosmic vibes..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 disabled:opacity-50"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
                {error}
              </div>
            )}
          </div>

          {/* T-Shirt Mockup Section */}
          <div className="flex justify-center">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
              <div className="relative w-[340px] h-[420px] md:w-[420px] md:h-[520px]">
                {/* T-Shirt Base SVG - More Realistic Design */}
                <svg
                  viewBox="0 0 420 520"
                  className="w-full h-full drop-shadow-xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Definitions for gradients and shadows */}
                  <defs>
                    {/* Fabric gradient for realistic look */}
                    <linearGradient id="fabricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="30%" stopColor="#fafafa" />
                      <stop offset="70%" stopColor="#f5f5f5" />
                      <stop offset="100%" stopColor="#f0f0f0" />
                    </linearGradient>

                    {/* Shadow gradient for depth */}
                    <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#e8e8e8" />
                      <stop offset="100%" stopColor="#d4d4d4" />
                    </linearGradient>

                    {/* Inner shadow for collar */}
                    <radialGradient id="collarShadow" cx="50%" cy="0%" r="100%">
                      <stop offset="0%" stopColor="#d0d0d0" />
                      <stop offset="100%" stopColor="#f0f0f0" />
                    </radialGradient>

                    {/* Drop shadow filter */}
                    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.15" />
                    </filter>

                    {/* Subtle inner shadow for sleeves */}
                    <filter id="innerShadow">
                      <feOffset dx="0" dy="2" />
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Main T-Shirt Body with shadow */}
                  <g filter="url(#dropShadow)">
                    {/* Left Sleeve */}
                    <path
                      d="M30 95 L95 65 L110 155 L45 175 Z"
                      fill="url(#fabricGradient)"
                      stroke="#e0e0e0"
                      strokeWidth="1.5"
                    />

                    {/* Right Sleeve */}
                    <path
                      d="M390 95 L325 65 L310 155 L375 175 Z"
                      fill="url(#fabricGradient)"
                      stroke="#e0e0e0"
                      strokeWidth="1.5"
                    />

                    {/* Main Body */}
                    <path
                      d="M95 65 L145 50 C145 50 175 95 210 95 C245 95 275 50 275 50 L325 65 L310 155 L310 480 L110 480 L110 155 Z"
                      fill="url(#fabricGradient)"
                      stroke="#e0e0e0"
                      strokeWidth="1.5"
                    />
                  </g>

                  {/* Collar */}
                  <ellipse
                    cx="210"
                    cy="72"
                    rx="50"
                    ry="25"
                    fill="url(#collarShadow)"
                    stroke="#d0d0d0"
                    strokeWidth="1.5"
                  />

                  {/* Inner collar opening */}
                  <ellipse
                    cx="210"
                    cy="72"
                    rx="35"
                    ry="18"
                    fill="#1a1a2e"
                    stroke="#c8c8c8"
                    strokeWidth="1"
                  />

                  {/* Subtle fold lines for realism */}
                  <path d="M150 180 Q160 300 155 400" stroke="#e8e8e8" strokeWidth="1" fill="none" opacity="0.6" />
                  <path d="M270 180 Q260 300 265 400" stroke="#e8e8e8" strokeWidth="1" fill="none" opacity="0.6" />
                  <path d="M200 150 Q205 280 203 380" stroke="#ececec" strokeWidth="0.8" fill="none" opacity="0.4" />

                  {/* Sleeve seam lines */}
                  <path d="M110 155 L95 65" stroke="#dedede" strokeWidth="1" fill="none" opacity="0.7" />
                  <path d="M310 155 L325 65" stroke="#dedede" strokeWidth="1" fill="none" opacity="0.7" />
                </svg>

                {/* Design Print Area - Positioned on chest area */}
                <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[45%] aspect-square pointer-events-none">
                  {/* Generated Design Overlay */}
                  {generatedImage && (
                    <div className="w-full h-full relative">
                      {/* Design with realistic print effect */}
                      <img
                        src={generatedImage}
                        alt="Generated design"
                        className="w-full h-full object-contain mix-blend-multiply opacity-95"
                        style={{
                          filter: 'contrast(1.05) saturate(0.95) brightness(0.98)',
                        }}
                      />
                      {/* Subtle overlay for fabric texture effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-br from-violet-500/10 via-violet-500/20 to-violet-500/10 animate-pulse rounded-md flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
                      </div>
                    </div>
                  )}

                  {/* Placeholder when no design */}
                  {!generatedImage && !isLoading && (
                    <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-400/30 rounded-md">
                      <div className="text-center text-gray-500">
                        <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs opacity-60">Design Area</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mockup Label */}
              <p className="text-center text-white/40 text-sm mt-4 font-medium">
                Preview Mockup
              </p>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {['AI-Powered', 'Instant Generation', 'High Quality', 'Print-Ready'].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center text-white/40 text-sm">
          <p>Powered by AI • Built with React & Node.js</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
