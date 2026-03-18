import { BrainCircuit, Github } from "lucide-react";

export function Header() {
  return (
    <nav className="border-b border-slate-800/60 bg-slate-950/20 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-blue-400 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Agentic RAG
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Github className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </nav>
  );
}
