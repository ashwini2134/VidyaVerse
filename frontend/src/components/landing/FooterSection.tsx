import { Link } from "react-router-dom";
import { Mail, MessageSquare } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-primary)] pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          
          {/* Logo & Tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="VIDYAVERSE" className="w-8 h-8 object-contain" />
              <span className="font-bold text-[var(--text-primary)] text-lg tracking-wide">VIDYAVERSE</span>
            </div>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed">
              Bridge Your Learning. Build Your Future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--text-primary)] font-bold text-sm mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li><Link to="/" className="hover:text-[var(--accent-indigo)] transition-colors">Home</Link></li>
              <li><Link to="/register" className="hover:text-[var(--accent-indigo)] transition-colors">Courses</Link></li>
              <li><Link to="/" className="hover:text-[var(--accent-indigo)] transition-colors">Dashboard</Link></li>
              <li><Link to="/about" className="hover:text-[var(--accent-indigo)] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-[var(--text-primary)] font-bold text-sm mb-4">Curriculum</h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li><Link to="/register" className="hover:text-[var(--accent-indigo)] transition-colors">Python</Link></li>
              <li><Link to="/register" className="hover:text-[var(--accent-indigo)] transition-colors">Artificial Intelligence</Link></li>
              <li><Link to="/register" className="hover:text-[var(--accent-indigo)] transition-colors">Data Structures (Coming Soon)</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[var(--text-primary)] font-bold text-sm mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li><Link to="/privacy" className="hover:text-[var(--accent-indigo)] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[var(--accent-indigo)] transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-[var(--accent-indigo)] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-primary)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-xs">
            © 2026 VIDYAVERSE. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><MessageSquare className="w-4 h-4" /></a>
            <a href="#" className="opacity-70 hover:opacity-100 transition-opacity"><img src="/logo.svg" alt="VIDYAVERSE" className="w-4 h-4 object-contain" /></a>
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
