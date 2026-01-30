import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

// Use environment variable for production, fallback to localhost for development
// Use environment variable for production, fallback to localhost for development
// Sanitize the URL to remove trailing /api or / to avoid double paths
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/api\/?$/, '').replace(/\/$/, '');

// T-shirt color options
const SHIRT_COLORS = [
  { name: 'White', hex: '#ffffff', textColor: 'text-gray-800' },
  { name: 'Black', hex: '#1a1a1a', textColor: 'text-white' },
  { name: 'Navy', hex: '#1e3a5f', textColor: 'text-white' },
  { name: 'Red', hex: '#dc2626', textColor: 'text-white' },
  { name: 'Forest', hex: '#166534', textColor: 'text-white' },
  { name: 'Purple', hex: '#7c3aed', textColor: 'text-white' },
];

// Style presets for quick design generation
const STYLE_PRESETS = [
  { name: 'Minimalist', icon: '◯', prompt: 'minimalist, simple lines, clean design, geometric' },
  { name: 'Vintage', icon: '🏛️', prompt: 'vintage retro style, distressed texture, classic' },
  { name: 'Neon', icon: '✨', prompt: 'neon glow, cyberpunk, vibrant colors, futuristic' },
  { name: 'Watercolor', icon: '🎨', prompt: 'watercolor painting style, soft colors, artistic' },
  { name: 'Cartoon', icon: '🎭', prompt: 'cartoon style, bold outlines, playful, fun' },
  { name: 'Abstract', icon: '🔷', prompt: 'abstract art, modern, contemporary, artistic' },
];

// Design history interface
interface DesignHistoryItem {
  id: string;
  image: string;
  prompt: string;
  timestamp: number;
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(SHIRT_COLORS[0]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [designHistory, setDesignHistory] = useState<DesignHistoryItem[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const mockupRef = useRef<HTMLDivElement>(null);

  // Load design history from localStorage on mount
  // Load design history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('merch-ai-history');
    if (saved) {
      try {
        setDesignHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }

    // Wake up the backend server on initial load
    // This helps mitigate the cold start delay on free tier hosting (e.g., Render)
    fetch(`${API_URL}/api/health`).catch(err => console.log('Wake-up ping sent:', err.message));
  }, []);

  // Save design to history
  const saveToHistory = (image: string, promptText: string) => {
    const newItem: DesignHistoryItem = {
      id: Date.now().toString(),
      image,
      prompt: promptText,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...designHistory].slice(0, 8); // Keep last 8
    setDesignHistory(updated);
    localStorage.setItem('merch-ai-history', JSON.stringify(updated));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a design prompt');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Combine prompt with selected preset if any
      let finalPrompt = prompt;
      if (selectedPreset) {
        const preset = STYLE_PRESETS.find(p => p.name === selectedPreset);
        if (preset) {
          finalPrompt = `${prompt}, ${preset.prompt}`;
        }
      }

      const response = await axios.post(`${API_URL}/api/generate`, { prompt: finalPrompt });
      setGeneratedImage(response.data.image);
      saveToHistory(response.data.image, prompt);
    } catch (err) {
      console.error('Generation error:', err);
      // Log detailed backend error if available
      if (axios.isAxiosError(err) && err.response) {
        console.error('Backend error details:', err.response.data);
      }
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

  const handleDownload = async () => {
    if (!mockupRef.current || !generatedImage) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(mockupRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `merch-ai-design-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const applyFromHistory = (item: DesignHistoryItem) => {
    setGeneratedImage(item.image);
    setPrompt(item.prompt);
  };

  const clearHistory = () => {
    setDesignHistory([]);
    localStorage.removeItem('merch-ai-history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans antialiased">
      {/* Header */}
      <header className="w-full py-3 sm:py-4 px-4 sm:px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Merch AI
              </h1>
              <p className="text-xs text-white/40 hidden xs:block">AI-Powered Design Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30 hidden sm:block">Powered by Flux AI</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              {/* Hero Text */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                    Create Your Design
                  </span>
                </h2>
                <p className="text-white/50 text-sm sm:text-base">
                  Describe your vision and watch AI bring it to life
                </p>
              </div>

              {/* Prompt Input */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4">
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Design Prompt</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="A majestic lion with a crown, cosmic background..."
                    disabled={isLoading}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 disabled:opacity-50 text-sm"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="hidden sm:inline">Generating High-Quality Design...</span>
                        <span className="sm:hidden">Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Style Presets */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4">
                <label className="text-xs text-white/50 uppercase tracking-wider mb-3 block">Style Presets</label>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-6 gap-2">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSelectedPreset(selectedPreset === preset.name ? null : preset.name)}
                      className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-center cursor-pointer min-h-[60px] sm:min-h-0 ${selectedPreset === preset.name
                        ? 'bg-violet-500/20 border-violet-500/50 shadow-lg shadow-violet-500/20'
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                        }`}
                    >
                      <div className="text-base sm:text-lg mb-1">{preset.icon}</div>
                      <div className="text-xs text-white/70">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* T-Shirt Color Picker */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4">
                <label className="text-xs text-white/50 uppercase tracking-wider mb-3 block">T-Shirt Color</label>
                <div className="flex gap-2 flex-wrap items-center">
                  {SHIRT_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-11 h-11 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 cursor-pointer ${selectedColor.name === color.name
                        ? 'border-violet-500 scale-110 shadow-lg'
                        : 'border-white/20 hover:scale-105'
                        }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  <span className="flex items-center text-sm text-white/50 ml-2">{selectedColor.name}</span>
                </div>
              </div>

              {/* Design History */}
              {designHistory.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Recent Designs</label>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                    {designHistory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => applyFromHistory(item)}
                        className="flex-shrink-0 w-16 h-16 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-white/10 hover:border-violet-500/50 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <img src={item.image} alt="History" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Mockup */}
            <div className="flex flex-col items-center">
              {/* Mockup Container */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-md">
                <div ref={mockupRef} className="relative w-full aspect-[4/5]">
                  {/* T-Shirt Base SVG */}
                  <svg
                    viewBox="0 0 420 520"
                    className="w-full h-full drop-shadow-xl"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="fabricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={selectedColor.hex} />
                        <stop offset="50%" stopColor={selectedColor.hex} stopOpacity="0.95" />
                        <stop offset="100%" stopColor={selectedColor.hex} stopOpacity="0.9" />
                      </linearGradient>
                      <radialGradient id="collarShadow" cx="50%" cy="0%" r="100%">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                      </radialGradient>
                      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.2" />
                      </filter>
                    </defs>

                    <g filter="url(#dropShadow)">
                      <path d="M30 95 L95 65 L110 155 L45 175 Z" fill="url(#fabricGradient)" stroke={selectedColor.hex === '#ffffff' ? '#e0e0e0' : 'transparent'} strokeWidth="1" />
                      <path d="M390 95 L325 65 L310 155 L375 175 Z" fill="url(#fabricGradient)" stroke={selectedColor.hex === '#ffffff' ? '#e0e0e0' : 'transparent'} strokeWidth="1" />
                      <path d="M95 65 L145 50 C145 50 175 95 210 95 C245 95 275 50 275 50 L325 65 L310 155 L310 480 L110 480 L110 155 Z" fill="url(#fabricGradient)" stroke={selectedColor.hex === '#ffffff' ? '#e0e0e0' : 'transparent'} strokeWidth="1" />
                    </g>

                    <ellipse cx="210" cy="72" rx="50" ry="25" fill="url(#collarShadow)" />
                    <ellipse cx="210" cy="72" rx="35" ry="18" fill="#1a1a2e" stroke={selectedColor.hex === '#ffffff' ? '#d0d0d0' : 'transparent'} strokeWidth="1" />

                    <path d="M150 180 Q160 300 155 400" stroke={selectedColor.hex === '#ffffff' ? '#e8e8e8' : 'rgba(255,255,255,0.1)'} strokeWidth="1" fill="none" opacity="0.5" />
                    <path d="M270 180 Q260 300 265 400" stroke={selectedColor.hex === '#ffffff' ? '#e8e8e8' : 'rgba(255,255,255,0.1)'} strokeWidth="1" fill="none" opacity="0.5" />
                  </svg>

                  {/* Design Print Area */}
                  <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[45%] aspect-square pointer-events-none">
                    {generatedImage && (
                      <div className="w-full h-full relative">
                        <img
                          src={generatedImage}
                          alt="Generated design"
                          className={`w-full h-full object-contain ${selectedColor.hex === '#ffffff' ? 'mix-blend-multiply' : 'mix-blend-screen'} opacity-95`}
                          style={{ filter: 'contrast(1.05) saturate(0.95)' }}
                        />
                      </div>
                    )}

                    {isLoading && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-full h-full bg-gradient-to-br from-violet-500/10 via-violet-500/20 to-violet-500/10 animate-pulse rounded-md flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
                        </div>
                      </div>
                    )}

                    {!generatedImage && !isLoading && (
                      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-400/30 rounded-md">
                        <div className="text-center">
                          <svg className="w-8 h-8 mx-auto mb-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs opacity-40">Your design</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Button */}
                {generatedImage && (
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="mt-4 w-full py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="hidden xs:inline">Download Mockup</span>
                        <span className="xs:hidden">Download</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-4 sm:mt-6">
                {['AI-Powered', 'Instant Export', 'Multiple Colors', 'Style Presets'].map((feature) => (
                  <span key={feature} className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 sm:py-4 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-0 text-xs text-white/30">
          <p>Powered by Pollinations Flux AI</p>
          <p>Built with React + TailwindCSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
