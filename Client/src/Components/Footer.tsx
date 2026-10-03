import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => (
  <footer className="mt-auto bg-tertiary-container text-white">
    <div className="grid gap-8 px-page-desktop py-8 md:grid-cols-[1fr_auto] md:items-center md:py-10">
      <div className="flex items-center gap-4">
        <Link to="/" aria-label="ALDI Startseite" className="shrink-0">
          <Logo />
        </Link>
        <div>
          <p className="text-lg font-bold">Gutes für deinen Einkauf.</p>
          <p className="mt-1 text-sm text-white/70">Angebote entdecken und den Einkauf planen.</p>
        </div>
      </div>

      <nav aria-label="Footer Navigation">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <li><Link className="text-white/80 transition-colors hover:text-white" to="/offers">Wochenangebote</Link></li>
          <li><Link className="text-white/80 transition-colors hover:text-white" to="/products">Produkte</Link></li>
          <li><Link className="text-white/80 transition-colors hover:text-white" to="/categories">Kategorien</Link></li>
          <li><Link className="text-white/80 transition-colors hover:text-white" to="/einkaufsliste">Einkaufsliste</Link></li>
        </ul>
      </nav>
    </div>

    <div className="border-t border-white/15 px-page-desktop py-4 text-xs text-white/60">
      © {new Date().getFullYear()} ALDI · Alle Preise in Euro · Erstellt von Selim und Zakaria, ITS Stuttgart
    </div>
  </footer>
);

export default Footer;