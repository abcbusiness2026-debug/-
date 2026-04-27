import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Feather, Copy, RefreshCcw, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateBengaliSonnet } from './services/geminiService';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  const [topic, setTopic] = useState('');
  const [poem, setPoem] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setPoem('');
    setSummary('');
    try {
      const result = await generateBengaliSonnet(topic);
      setPoem(result.poem);
      setSummary(result.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = `${poem}\n\nমুলভাব:\n${summary}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="atmosphere-glow w-[600px] h-[600px] -top-[100px] -right-[100px]" />
      <div className="atmosphere-glow w-[400px] h-[400px] -bottom-[100px] -left-[100px]" />

      <div id="main-container" className="flex flex-col items-center w-full relative z-10">
        {/* Header */}
        <motion.div 
          id="header-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div id="icon-bg" className="p-3 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20">
              <Feather className="w-10 h-10 text-[#D4AF37]" />
            </div>
          </div>
          <h1 id="app-title" className="text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-4 font-serif tracking-wider uppercase">
            কাব্যলহরী
          </h1>
          <p id="app-subtitle" className="text-slate-400 text-sm font-semibold tracking-[0.2em] uppercase max-w-2xl mx-auto opacity-70">
            চতুর্দশপদী সনেট জেনারেটর
          </p>
        </motion.div>

        {/* Main Content Area */}
        <div id="content-area" className="w-full max-w-3xl space-y-8">
          {/* Input Card */}
          <motion.div 
            id="input-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-3xl"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input 
                  id="topic-input"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="কবিতার বিষয়টি এখানে লিখুন..."
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-5 pr-12 text-lg focus:outline-none focus:border-[#D4AF37]/50 transition-all placeholder:text-slate-600"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <Sparkles id="sparkle-icon" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]/30" />
              </div>
              <button
                id="generate-button"
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="bg-[#D4AF37] hover:bg-[#e5be48] disabled:opacity-50 disabled:cursor-not-allowed text-[#2D0F0F] font-bold py-4 px-10 rounded-2xl flex items-center justify-center gap-2 transition-all group overflow-hidden relative shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
              >
                {loading ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>সৃষ্টি করুন</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Poem Display Area */}
          <AnimatePresence mode="wait">
            {(poem || loading || error) && (
              <motion.div 
                id="result-card"
                key={loading ? 'loading' : poem ? 'poem' : 'error'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-card rounded-3xl overflow-hidden min-h-[440px] flex flex-col relative"
              >
                <div id="decoration-quill" className="absolute bottom-6 right-8 opacity-[0.08] pointer-events-none text-8xl">✒️</div>

                <div id="result-toolbar" className="p-4 border-b border-white/5 flex justify-between items-center bg-black/10">
                  <span id="result-badge" className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]/70 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
                    নতুন সনেট
                  </span>
                  {poem && (
                    <button 
                      id="copy-button"
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-[#D4AF37] flex items-center gap-2 text-sm border border-transparent hover:border-[#D4AF37]/20"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? 'কপি হয়েছে' : 'কপি করুন'}
                    </button>
                  )}
                </div>

                <div id="poem-content" className="flex-1 p-8 sm:p-12 flex flex-col justify-center items-center text-center">
                  {loading ? (
                    <div className="space-y-4 w-full max-w-sm">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div 
                          key={i}
                          animate={{ opacity: [0.2, 0.4, 0.2] }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                          className="h-2 bg-[#D4AF37]/10 rounded-full w-full mx-auto"
                          style={{ width: `${Math.random() * 30 + 70}%` }}
                        />
                      ))}
                      <p id="loading-text" className="text-[#D4AF37]/40 text-sm italic pt-6 tracking-widest uppercase">পাণ্ডুলিপি রচিত হচ্ছে...</p>
                    </div>
                  ) : error ? (
                    <div id="error-message" className="text-red-400/80 flex flex-col items-center gap-2">
                       <p>{error}</p>
                       <button id="retry-link" onClick={handleGenerate} className="text-sm underline hover:text-red-300">আবার চেষ্টা করুন</button>
                    </div>
                  ) : (
                    <div id="result-display" className="space-y-12">
                      <div id="poem-text" className="poem-container text-xl sm:text-2xl whitespace-pre-line text-[#e0d8d0] leading-[1.8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                        {poem}
                      </div>
                      
                      {summary && (
                        <motion.div 
                          id="summary-section"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="max-w-xl mx-auto p-6 bg-white/5 rounded-2xl border border-white/5 text-left"
                        >
                          <h4 className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            কবিতার মুলভাব
                          </h4>
                          <p id="summary-text" className="text-slate-400 text-sm leading-relaxed font-light italic">
                            {summary}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                <div id="result-footer" className="p-6 bg-black/20 border-t border-white/5 text-center text-[10px] text-slate-600 uppercase tracking-[0.2em]">
                  * মাইকেল মধুসূদন দত্তের ঐতিহ্যে রচিত
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer 
          id="site-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-auto pt-16 pb-8 text-slate-700 text-xs text-center font-semibold tracking-widest uppercase"
        >
          <p>© ২০২৪ কাব্যলহরী - একটি অমর সৃষ্টি</p>
        </motion.footer>
      </div>
    </div>
  );
}

