export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-surface-border">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-display text-lg font-bold text-text-primary tracking-wide">
          Website Inquiry Form
        </span>
        <span className="text-brand/80 text-sm font-sans tracking-wide hidden sm:inline">
          Illustriober Creatives
        </span>
      </div>
    </nav>
  );
}
