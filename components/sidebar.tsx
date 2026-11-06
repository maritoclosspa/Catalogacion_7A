"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio", icon: "⌂" },
  { href: "/series", label: "Series", icon: "▤" },
  { href: "/plataformas", label: "Plataformas", icon: "◇" },
  { href: "/valoraciones", label: "Valoraciones", icon: "★" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">S7</div><span>Series 7A</span></div>
      <nav aria-label="Navegación principal">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? "active" : ""}`}>
            <span>{link.icon}</span>{link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
