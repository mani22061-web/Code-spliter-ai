import React from 'react';
import { Layers, Wand2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between py-6 px-4 md:px-0 mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Code Splitter AI</h1>
          <p className="text-sm text-slate-500">Intelligent Frontend Code Separator</p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 flex gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
           <Wand2 className="w-4 h-4 text-indigo-500" />
           <span>Powered by Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};

export default Header;