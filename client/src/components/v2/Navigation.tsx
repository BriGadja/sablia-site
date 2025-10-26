import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-v2-white/95 backdrop-blur-sm shadow-md"
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/">
            <a className={cn(
              "text-2xl font-bold transition-colors",
              isScrolled ? "text-v2-navy" : "text-v2-white"
            )}>
              Sablia
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#solutions"
              className={cn(
                "text-sm font-medium transition-colors hover:text-v2-electric",
                isScrolled ? "text-v2-charcoal" : "text-v2-white"
              )}
            >
              Solutions
            </a>
            <a
              href="#tarifs"
              className={cn(
                "text-sm font-medium transition-colors hover:text-v2-electric",
                isScrolled ? "text-v2-charcoal" : "text-v2-white"
              )}
            >
              Tarifs
            </a>
            <a
              href="#cas-clients"
              className={cn(
                "text-sm font-medium transition-colors hover:text-v2-electric",
                isScrolled ? "text-v2-charcoal" : "text-v2-white"
              )}
            >
              Cas Clients
            </a>
            <Link href="/about">
              <a className={cn(
                "text-sm font-medium transition-colors hover:text-v2-electric",
                isScrolled ? "text-v2-charcoal" : "text-v2-white"
              )}>
                À propos
              </a>
            </Link>

            <Button
              size="sm"
              variant="primary"
              onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
            >
              Audit Gratuit
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            aria-label="Menu"
          >
            <svg className={cn("w-6 h-6", isScrolled ? "text-v2-navy" : "text-v2-white")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
