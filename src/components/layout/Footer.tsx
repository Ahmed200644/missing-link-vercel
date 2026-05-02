import Link from 'next/link';
import { Zap, Globe, Heart } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Explore: [
      { href: '/browse',            label: 'Browse All' },
      { href: '/browse?opportunity_type=job',         label: 'Jobs' },
      { href: '/browse?opportunity_type=internship',  label: 'Internships' },
      { href: '/browse?opportunity_type=training',    label: 'Trainings' },
      { href: '/browse?opportunity_type=competition', label: 'Competitions' },
      { href: '/browse?opportunity_type=youth_event', label: 'Youth Events' },
    ],
    Platform: [
      { href: '/signup',  label: 'Create Account' },
      { href: '/login',   label: 'Sign In' },
      { href: '/saved',   label: 'Saved Opportunities' },
    ],
  };

  return (
    <footer className="border-t border-navy-700 bg-navy-950 mt-20">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/30">
                <Zap className="w-4 h-4 text-green-400" />
              </div>
              <span className="font-display font-bold text-lg text-slate-50">
                Missing<span className="text-green-400">Link</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Bridging the gap between youth potential and real opportunity. 
              Discover jobs, internships, trainings, and events aligned with 
              sustainable development goals.
            </p>
            <div className="flex items-center gap-2 mt-5 text-xs text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              <span>Focused on Egypt & the Arab World</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="font-display font-semibold text-sm text-slate-200 mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-slate-400 hover:text-green-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {year} Missing Link. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> for youth empowerment
          </p>
        </div>
      </div>
    </footer>
  );
}
