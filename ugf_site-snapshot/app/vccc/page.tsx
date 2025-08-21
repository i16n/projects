"use client";

import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function VCCCOverviewPage() {
  return (
    <div className="text-white">
      <style jsx>{`
        @keyframes fadeInFromBlack {
          from {
            opacity: 0;
            background-color: black;
          }
          to {
            opacity: 1;
            background-color: transparent;
          }
        }

        .fade-in-hero {
          animation: fadeInFromBlack 1.5s ease-out;
        }

        .fade-in-text {
          animation: fadeInFromBlack 1.5s ease-out 0.3s both;
        }

        .fade-in-cards {
          animation: fadeInFromBlack 1.5s ease-out 0.6s both;
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] fade-in-hero">
        <Image
          src="/airplane.webp"
          alt="Takeoff Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center">
            Venture Capital Case Competition
          </h1>
        </div>
      </div>

      {/* Description Section */}
      <div className="py-12 bg-[#004A7C] fade-in-text">
        <div className="container mx-auto px-4">
          <p className="lg:text-2xl sm:text-lg text-xl text-white mx-auto leading-relaxed">
            The University Growth Fund Venture Capital Case Competitions, held
            annually in Utah, San Diego, and Atlanta, gives students the
            opportunity to think and act like venture capitalists. Over 6 weeks,
            students will learn from experienced venture capitalists through 4
            educational workshops and compete in teams of 2-4 people to find,
            analyze, and pitch investment opportunities. While only the top 5
            teams will have the unique opportunity to pitch to our panel of
            esteemed VC judges, all participants are welcome to attend every
            educational workshop and network with students and venture
            capitalists along the way.
          </p>
        </div>
      </div>

      {/* Competition Cards Section */}
      <div className="container mx-auto px-4 py-16 fade-in-cards">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Learn More
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              href: "/vccc/sandiego",
              img: "/officeImages/sd.webp",
              title: "San Diego",
            },
            {
              href: "/vccc/slc",
              img: "/officeImages/slc.webp",
              title: "Salt Lake City",
            },
            {
              href: "/vccc/atlanta",
              img: "/officeImages/atl.webp",
              title: "Atlanta",
            },
          ].map((location) => (
            <div key={location.title}>
              <Link href={location.href} className="group">
                <div className="relative h-[400px] overflow-hidden">
                  <Image
                    src={location.img}
                    alt={location.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl font-bold text-white mb-3">
                      {location.title}
                    </h3>
                    <Image
                      src="/favicons/apple-touch-icon.png"
                      alt="UGF Logo"
                      width={50}
                      height={50}
                      className="absolute bottom-4 right-4"
                      unoptimized
                    />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Questions Section */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-4">Questions?</h3>
          <p className="text-xl text-gray-300">
            <a
              href="mailto:info@ugrowthfund.com"
              className="text-[#17A2FF] hover:text-[#004A7C] transition-colors duration-300"
            >
              vccc@ugrowthfund.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
