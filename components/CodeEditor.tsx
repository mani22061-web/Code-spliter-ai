import React, { useState } from 'react';
import { Copy, Download, Check, FileCode, FileType, FileJson } from 'lucide-react';

interface CodeEditorProps {
  title: string;
  code: string;
  language: 'html' | 'css' | 'js';
  filename: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ title, code, language, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getIcon = () => {
    switch (language) {
      case 'html': return <FileCode className="w-4 h-4 text-orange-500" />;
      case 'css': return <FileType className="w-4 h-4 text-blue-500" />;
      case 'js': return <FileJson className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getBorderColor = () => {
     switch (language) {
      case 'html': return 'border-orange-200';
      case 'css': return 'border-blue-200';
      case 'js': return 'border-yellow-200';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-xl shadow-sm border ${getBorderColor()} overflow-hidden transition-all hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-semibold text-sm text-slate-700">{title}</span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">({filename})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative flex-1 overflow-hidden group">
        <textarea
          readOnly
          value={code}
          className="w-full h-full p-4 font-mono text-sm text-slate-700 bg-white resize-none focus:outline-none custom-scrollbar leading-relaxed"
          spellCheck={false}
        />
        {code.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none">
            <span className="text-sm italic">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;