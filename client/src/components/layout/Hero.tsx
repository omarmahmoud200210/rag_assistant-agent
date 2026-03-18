import { PDFUpload } from "../PDFUpload";
import { ChatInterface } from "../ChatInterface";

export function Hero() {

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider">
          Powered by Groq & LangChain
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Chat with your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">
            PDF Documents
          </span>
        </h1>
        <p className="text-slate-400 text-lg">
          Upload any research paper, legal document, or technical report and get
          instant answers powered by state-of-the-art LLMs.
        </p>
      </section>

      {/* Upload Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PDFUpload />
      </section>

      {/* Chat Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-800" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4">
            Interrogation Interface
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-800" />
        </div>
        <ChatInterface />
      </section>
    </main>
  );
}
