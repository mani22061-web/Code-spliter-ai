import React, { useState } from 'react';
import { Split, Sparkles, AlertCircle } from 'lucide-react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import CodeEditor from './components/CodeEditor';
import { splitCodeLocally } from './services/localSplitter';
import { splitCodeWithAI } from './services/geminiService';
import { SplitCodeResult, ProcessingState } from './types';

const INITIAL_CODE_PLACEHOLDER = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Card</title>
    <style>
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .title { color: #333; }
    </style>
</head>
<body>
    <div class="card">
        <h1 class="title">Hello World</h1>
        <button id="clickMe">Click Me</button>
    </div>
    <script>
        document.getElementById('clickMe').addEventListener('click', () => {
            alert('Button Clicked!');
        });
    </script>
</body>
</html>`;

function App() {
  const [inputCode, setInputCode] = useState<string>(INITIAL_CODE_PLACEHOLDER);
  const [result, setResult] = useState<SplitCodeResult>({ html: '', css: '', js: '' });
  const [status, setStatus] = useState<ProcessingState>({
    isProcessing: false,
    error: null,
    mode: 'local'
  });

  const handleLocalSplit = () => {
    try {
      setStatus({ isProcessing: true, error: null, mode: 'local' });
      // Simulate a small delay for better UX feeling
      setTimeout(() => {
        const splitResult = splitCodeLocally(inputCode);
        setResult(splitResult);
        setStatus({ isProcessing: false, error: null, mode: 'local' });
      }, 400);
    } catch (err) {
      setStatus({ isProcessing: false, error: "Failed to parse HTML locally.", mode: 'local' });
    }
  };

  const handleAISplit = async () => {
    if (!inputCode.trim()) return;
    
    setStatus({ isProcessing: true, error: null, mode: 'ai' });
    try {
      const splitResult = await splitCodeWithAI(inputCode);
      setResult(splitResult);
    } catch (err: any) {
      // Fallback to local if AI fails or no key
      console.warn("AI Failed, checking for key...", err);
      let errorMessage = "AI processing failed. Check console.";
      if (err.message.includes("API Key")) {
        errorMessage = "API Key missing in environment.";
      }
      setStatus({ isProcessing: false, error: errorMessage, mode: 'ai' });
    } finally {
        // If successful, stop processing. If error, we already set state above but this ensures cleanup
        if (!status.error) {
             setStatus((prev) => ({ ...prev, isProcessing: false }));
        }
    }
  };

  const hasApiKey = !!process.env.API_KEY;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Header />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input (Span 5 on large screens) */}
          <div className="lg:col-span-5 flex flex-col gap-4 h-full sticky top-8">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
               <InputSection value={inputCode} onChange={setInputCode} />
            </div>
            
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleLocalSplit}
                disabled={status.isProcessing}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 px-6 rounded-xl font-medium transition-all shadow-md shadow-slate-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Split className="w-5 h-5" />
                {status.isProcessing && status.mode === 'local' ? 'Splitting...' : 'Instant Split'}
              </button>

              <button
                onClick={handleAISplit}
                disabled={status.isProcessing || !hasApiKey}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                  hasApiKey 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-200' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                title={!hasApiKey ? "API Key required for AI features" : "Uses Gemini AI to clean and structure code"}
              >
                <Sparkles className="w-5 h-5" />
                {status.isProcessing && status.mode === 'ai' ? 'Enhancing...' : 'AI Split & Clean'}
              </button>
            </div>

            {status.error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{status.error}</p>
              </div>
            )}
            
            {!hasApiKey && (
              <p className="text-xs text-center text-slate-400">
                Note: Configure <code>API_KEY</code> in environment to enable AI features.
              </p>
            )}
          </div>

          {/* Right Column: Output Grid (Span 7 on large screens) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
               {/* HTML Output */}
               <div className="h-[300px] lg:h-[280px]">
                 <CodeEditor 
                   title="HTML Structure" 
                   code={result.html} 
                   language="html" 
                   filename="index.html" 
                 />
               </div>

               {/* CSS Output */}
               <div className="h-[300px] lg:h-[280px]">
                 <CodeEditor 
                   title="CSS Styles" 
                   code={result.css} 
                   language="css" 
                   filename="style.css" 
                 />
               </div>

               {/* JS Output */}
               <div className="h-[300px] lg:h-[280px]">
                 <CodeEditor 
                   title="JavaScript Logic" 
                   code={result.js} 
                   language="js" 
                   filename="script.js" 
                 />
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;