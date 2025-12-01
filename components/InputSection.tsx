import React from 'react';
import { Code2 } from 'lucide-react';

interface InputSectionProps {
  value: string;
  onChange: (val: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full h-64 md:h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
      <div className="absolute top-3 right-3 pointer-events-none">
        <Code2 className="w-5 h-5 text-slate-300" />
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your code here... (e.g., <html>...<style>...</style><script>...</script></html>)"
        className="w-full h-full p-6 bg-transparent border-none resize-none focus:outline-none font-mono text-sm text-slate-700 placeholder:text-slate-400"
        spellCheck={false}
      />
    </div>
  );
};

export default InputSection;