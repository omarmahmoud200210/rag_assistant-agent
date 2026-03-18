export function Footer() {
  return (
    <footer className="border-t border-slate-900 mt-20 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-slate-500 text-sm italic">
          "The best way to predict the future is to invent it."
        </p>
        <div className="flex gap-8 text-xs text-slate-600 font-medium">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">
            PRIVACY
          </span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">
            TERMS
          </span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">
            COOKIES
          </span>
        </div>
      </div>
    </footer>
  );
}
