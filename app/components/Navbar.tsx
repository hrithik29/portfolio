"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/skills", label: "Skills" },
  { href: "/ask-me", label: "Ask Me" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-neutral-800 border-b border-neutral-600">
      <div className="max-w-4xl mx-auto px-5 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-semibold text-lg">
          Hrithik Jain
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-white text-sm font-medium"
                  : "text-neutral-400 text-sm font-medium hover:text-white"
              }
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/Hrithik_Jain_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 text-sm font-medium hover:text-white"
          >
            Resume
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden p-2 text-white"
          aria-label="Menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="block md:hidden bg-neutral-800 border-b border-neutral-600 px-5 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={
                pathname === link.href
                  ? "block py-3 text-white text-base font-medium"
                  : "block py-3 text-neutral-300 text-base font-medium hover:text-white"
              }
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/Hrithik_Jain_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block py-3 text-neutral-300 text-base font-medium hover:text-white"
          >
            Resume
          </a>
        </div>
      )}
    </header>
  );
}
