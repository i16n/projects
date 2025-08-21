"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/button";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuItems = [
    { href: "/", label: "UNIVERSITY GROWTH FUND" },
    { href: "/program", label: "THE PROGRAM" },
    { href: "/team", label: "TEAM" },
    { href: "/portfolio", label: "PORTFOLIO" },
    {
      href: "/vccc",
      label: "VC CASE COMP",
      dropdown: [
        { href: "/vccc/slc", label: "Salt Lake City" }, // vccc/utah didn't work!
        { href: "/vccc/sandiego", label: "San Diego" },
        { href: "/vccc/atlanta", label: "Atlanta" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-20 items-center justify-between md:justify-between">
        {/* Left side - University Growth Fund (desktop) and UGF (mobile) */}
        <div className="ml-4">
          {/* Mobile UGF text */}
          <Link href="/" className="md:hidden text-2xl font-raleway">
            UGF
          </Link>
          {/* Tablet UGF text */}
          <Link
            href="/"
            className="hidden md:block lg:hidden text-xl font-raleway"
          >
            UGF
          </Link>
          {/* Desktop University Growth Fund text */}
          <Link
            href="/"
            className="hidden lg:block text-lg lg:text-xl xl:text-2xl font-raleway relative whitespace-nowrap"
          >
            UNIVERSITY GROWTH FUND
          </Link>
        </div>

        {/* Right side - Navigation items and Apply button */}
        <div className="flex items-center gap-4 lg:gap-6 xl:gap-10 pr-4 md:ml-0">
          <nav className="hidden md:flex gap-4 lg:gap-6 xl:gap-10">
            {menuItems.slice(1).map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => {
                  if (item.dropdown) {
                    if (dropdownTimeout.current)
                      clearTimeout(dropdownTimeout.current);
                    setIsDropdownOpen(true);
                  }
                }}
                onMouseLeave={() => {
                  if (item.dropdown) {
                    dropdownTimeout.current = setTimeout(() => {
                      setIsDropdownOpen(false);
                    }, 180);
                  }
                }}
              >
                <Link
                  href={item.href}
                  className="text-lg lg:text-xl xl:text-2xl font-montserrat font-semibold text-gray-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#17A2FF] after:transition-all after:duration-300 hover:after:w-full flex items-center gap-1 whitespace-nowrap"
                >
                  {item.label}
                  {item.dropdown && <ChevronDown className="h-4 w-4" />}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div
                    className={`absolute top-full left-0 mt-2 bg-black shadow-lg text-white transition-all duration-300 ${
                      isDropdownOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                    onMouseEnter={() => {
                      if (dropdownTimeout.current)
                        clearTimeout(dropdownTimeout.current);
                      setIsDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      dropdownTimeout.current = setTimeout(() => {
                        setIsDropdownOpen(false);
                      }, 180);
                    }}
                  >
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        href={dropdownItem.href}
                        className="block px-4 py-2 text-lg text-gray-200 hover:bg-white hover:text-black transition-colors duration-150 whitespace-nowrap"
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <Link
            href="https://ugrowthfund.hire.trakstar.com/"
            className="hidden md:block group relative cursor-pointer px-4 lg:px-6 xl:px-8 py-4 overflow-hidden"
          >
            <span className="font-montserrat relative z-10 flex items-center gap-4 text-base lg:text-lg whitespace-nowrap">
              Apply Now
            </span>
            <div className="absolute inset-0 bg-[#17A2FF] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <div className="absolute inset-0 bg-[#17A2FF]/10"></div>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-6 h-6 flex items-center justify-center group"
          >
            <div className="relative w-6 h-6 flex flex-col justify-center gap-1.5">
              <span
                className={`h-0.5 w-6 bg-gray-200 transition-all duration-300 ease-in-out ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-gray-200 transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-gray-200 transition-all duration-300 ease-in-out ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Horizontal line at bottom of navbar */}
      <div className="hidden md:block border-b border-white"></div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-4 px-2 space-y-4">
          {menuItems.map((item, index) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`block text-lg font-medium text-gray-200 hover:text-[#17A2FF] transition-all duration-300 ${
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
                onClick={() => !item.dropdown && setIsOpen(false)}
              >
                {item.label}
              </Link>
              {item.dropdown && (
                <div className="hidden md:block pl-4 mt-2 space-y-2">
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.href}
                      href={dropdownItem.href}
                      className={`block text-sm font-medium text-gray-300 hover:text-[#17A2FF] transition-all duration-300 ${
                        isOpen
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                      style={{
                        transitionDelay: `${(index + 1) * 100}ms`,
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div
            className={`transition-all duration-300 ${
              isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
            style={{
              transitionDelay: `${menuItems.length * 100}ms`,
            }}
          >
            <Button
              className="w-full hover:bg-[#17A2FF] transition-all duration-100 hover:scale-105"
              asChild
            >
              <Link
                href="https://ugrowthfund.hire.trakstar.com/"
                target="_blank"
                onClick={() => setIsOpen(false)}
              >
                Apply Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
