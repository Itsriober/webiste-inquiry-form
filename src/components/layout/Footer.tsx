export default function Footer() {
  return (
    <footer className="border-t border-surface-border py-6 mt-auto">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-xs text-text-muted text-center">
          © {new Date().getFullYear()} Illustriober Creatives. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
