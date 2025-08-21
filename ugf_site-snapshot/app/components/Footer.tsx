import { Linkedin, Youtube, ListMusic, Instagram, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { forwardRef } from "react";

const Footer = forwardRef<HTMLElement>((props, ref) => {
  return (
    <footer ref={ref}>
      {/* Horizontal white bar */}
      <div className="mb-12">
        <div className="h-px bg-white"></div>
      </div>

      <div className="container py-16">
        <div className="grid items-center grid-cols-1 md:grid-cols-3 gap-12">
          {/* Site Navigation */}
          <div className="md:border-r flex justify-center">
            <div>
              <h3 className="text-white font-semibold mb-6 text-3xl">
                Navigation
              </h3>
              <ul className="space-y-4 text-white">
                <li>
                  <Link
                    href="/"
                    className="hover:text-bg-[#17A2FF] text-xl hover:translate-x-1 hover:text-[#17A2FF] transform transition-all duration-200 block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/program"
                    className="hover:text-bg-[#17A2FF] text-xl hover:translate-x-1 hover:text-[#17A2FF] transform transition-all duration-200 block"
                  >
                    Program
                  </Link>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="hover:text-bg-[#17A2FF] text-xl hover:translate-x-1 hover:text-[#17A2FF] transform transition-all duration-200 block"
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portfolio"
                    className="hover:text-bg-[#17A2FF] text-xl hover:translate-x-1 hover:text-[#17A2FF] transform transition-all duration-200 block"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vccc"
                    className="hover:text-bg-[#17A2FF] text-xl hover:translate-x-1 hover:text-[#17A2FF] transform transition-all duration-200 block"
                  >
                    VC Case Comp
                  </Link>
                </li>
                <li className="h-6"></li>
              </ul>
            </div>
          </div>

          {/* Logo and Copyright */}
          <div className="flex justify-center">
            <div>
              <div className="flex flex-col items-center">
                <a
                  href="/"
                  className="transform transition-all duration-200 block"
                >
                  <Image
                    src="/logo.svg"
                    alt="UGF Logo"
                    width={160}
                    height={160}
                    unoptimized
                  />
                </a>
              </div>
              <p className="text-base text-gray-400 mt-10">
                © {new Date().getFullYear()} UGF. All rights reserved.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex justify-center md:border-l">
            <div>
              <h3 className="text-white font-semibold mb-6 text-3xl">
                Contact
              </h3>
              <div className="space-y-6 text-base text-white">
                <div className="flex flex-col space-y-4">
                  <a
                    href="https://www.linkedin.com/company/university-growth-fund/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 text-gray-400 hover:text-white hover:translate-x-1 transform transition-all duration-200"
                  >
                    <Linkedin className="h-6 w-6 text-[#0077B5]" />
                    <span className="text-xl text-white hover:text-blue-400">
                      Our LinkedIn
                    </span>
                  </a>
                  <a
                    href="https://www.instagram.com/ugrowthfund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 text-gray-400 hover:text-white hover:translate-x-1 transform transition-all duration-200"
                  >
                    <Instagram className="h-6 w-6 text-[#E1306C]" />
                    <span className="text-xl text-white hover:text-pink-400">
                      Our Instagram
                    </span>
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCAHrQUxcm_Oa1t3emwttpAQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 text-gray-400 hover:text-white hover:translate-x-1 transform transition-all duration-200"
                  >
                    <Youtube className="h-6 w-6 text-[#FF0000]" />
                    <span className="text-xl text-white hover:text-red-400">
                      VCPete
                    </span>
                  </a>
                  <a
                    href="https://open.spotify.com/show/7BQimY8NJ6cr617lqtRr7N"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 text-gray-400 hover:text-white hover:translate-x-1 transform transition-all duration-200"
                  >
                    <ListMusic className="h-6 w-6 text-[#1DB954]" />
                    <span className="text-xl text-white hover:text-green-400">
                      VC Podcast
                    </span>
                  </a>
                </div>
                <div className="space-y-2">
                  <p className="text-lg">801-410-5410</p>
                  <a
                    href="mailto:info@ugrowthfund.com"
                    className="hover:text-white hover:translate-x-1 hover:text-[#17A2FF] transform transition-all duration-200 block text-sm"
                  >
                    info@ugrowthfund.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div></div> {/* Empty first column */}
          <div className="flex items-center justify-center">
            <a
              href="https://donorbox.org/ugf-institute-ongoing-2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 border border-black px-8 py-4 text-black bg-white hover:bg-black hover:border-white hover:text-white transition-colors font-semibold text-xl"
            >
              <Heart className="h-6 w-6 text-red-500" />
              <span>Donate!</span>
            </a>
          </div>
          <div></div> {/* Empty third column */}
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
