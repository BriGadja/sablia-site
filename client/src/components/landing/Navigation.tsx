import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuItems = [
    { label: "Problématique", href: "#problem", type: "anchor" as const },
    { label: "Solution", href: "#solution", type: "anchor" as const },
    { label: "Processus", href: "#process", type: "anchor" as const },
    { label: "Tarifs", href: "#pricing", type: "anchor" as const },
    { label: "FAQ", href: "#faq", type: "anchor" as const },
    { label: "GAP", href: "/gap", type: "route" as const },
    { label: "À propos", href: "/about", type: "route" as const },
  ];

  const handleNavClick = (href: string, type: "anchor" | "route") => {
    setIsMobileMenuOpen(false);
    if (type === "route") {
      setLocation(href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          "hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 py-4 transition-all duration-300",
          scrolled
            ? "bg-sablia-bg/95 backdrop-blur-sm border-b border-sablia-border shadow-warm-sm"
            : "bg-transparent",
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/logo.svg" alt="Sablia" className="h-8 w-auto" />
          <span className="text-lg font-semibold tracking-tight text-sablia-text">Sablia</span>
        </Link>

        <div className="flex items-center gap-1">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href, item.type);
              }}
              className="px-3.5 py-2 text-sm font-medium text-sablia-text-secondary hover:text-sablia-text transition-colors"
              aria-label={`Aller à la section ${item.label}`}
            >
              {item.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#contact", "anchor");
            }}
            className="ml-3 px-5 py-2 rounded text-sm font-medium bg-sablia-accent text-sablia-bg hover:bg-sablia-accent-hover transition-colors duration-200"
            aria-label="Réserver un diagnostic gratuit"
          >
            Diagnostic Gratuit
          </a>
        </div>
      </nav>

      {/* Mobile: Logo + Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-sablia-bg/95 backdrop-blur-sm border-b border-sablia-border">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Sablia" className="h-7 w-auto" />
          <span className="text-lg font-semibold tracking-tight text-sablia-text">Sablia</span>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded text-sablia-text hover:bg-sablia-surface transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-sablia-accent/10 z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[61px] left-0 right-0 bg-sablia-bg border-b border-sablia-border z-40 md:hidden shadow-warm"
            >
              <div className="flex flex-col p-4 space-y-1">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href, item.type);
                    }}
                    className="px-4 py-3 text-base text-sablia-text hover:bg-sablia-surface rounded transition-colors font-medium"
                    aria-label={`Aller à la section ${item.label}`}
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contact", "anchor");
                  }}
                  className="mx-4 mt-2 px-4 py-3 text-center rounded font-medium bg-sablia-accent text-sablia-bg hover:bg-sablia-accent-hover transition-colors"
                  aria-label="Réserver un diagnostic gratuit"
                >
                  Diagnostic Gratuit
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
