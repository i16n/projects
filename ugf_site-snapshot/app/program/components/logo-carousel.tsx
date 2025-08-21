"use client";

interface Logo {
  src: string;
  alt: string;
}

interface LogoCarouselProps {
  logos: Logo[];
}

export default function LogoCarousel({ logos }: LogoCarouselProps) {
  // Get unique logos
  const uniqueLogos = logos.filter(
    (logo, index, self) => index === self.findIndex((l) => l.src === logo.src)
  );

  // Split logos for quote insertion
  const firstBatch = uniqueLogos.slice(0, 12);
  const secondBatch = uniqueLogos.slice(12);

  return (
    <div className="py-12 w-[99%] px-2.5">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-x-6 gap-y-8 items-center justify-items-center">
        {/* First 12 logos */}
        {firstBatch.map((logo, index) => {
          const scaleUp = [
            "Lockheed Martin",
            "Bain & Company",
            "JP Morgan Chase",
            "Bank of America",
            "Evercore",
            "Kirkland & Ellis",
            "McKinsey",
            "Amazon",
          ].some((name) => logo.alt.toLowerCase().includes(name.toLowerCase()));
          const scaleDown = [
            "Boston Consulting Group",
            "Apple",
            "X",
            "IBM",
          ].some(
            (name) =>
              logo.alt.toLowerCase() === name.toLowerCase() ||
              logo.alt.toLowerCase().includes(name.toLowerCase())
          );
          return (
            <div
              key={`logo-${index}`}
              className={`flex items-center justify-center p-2 h-40 w-full ${
                scaleUp ? " scale-[150%]" : ""
              }${scaleDown ? " scale-75" : ""}`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain filter invert-48 sepia-100 saturate-500 hue-rotate-180 brightness-95 contrast-110"
                style={{
                  filter:
                    "invert(48%) sepia(100%) saturate(500%) hue-rotate(180deg) brightness(95%) contrast(110%)",
                }}
              />
            </div>
          );
        })}

        {/* Remaining logos */}
        {secondBatch.map((logo, index) => {
          const scaleUp = [
            "Lockheed Martin",
            "Bain & Company",
            "JP Morgan Chase",
            "Bank of America",
            "Evercore",
            "Kirkland & Ellis",
            "McKinsey",
          ].some((name) => logo.alt.toLowerCase().includes(name.toLowerCase()));
          const scaleDown = [
            "Boston Consulting Group",
            "Apple",
            "X",
            "IBM",
          ].some(
            (name) =>
              logo.alt.toLowerCase() === name.toLowerCase() ||
              logo.alt.toLowerCase().includes(name.toLowerCase())
          );
          return (
            <div
              key={`logo-after-quote-${index}`}
              className={`flex items-center justify-center p-2 h-40 w-full ${
                scaleUp ? " scale-[150%]" : ""
              }${scaleDown ? " scale-75" : ""}`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain filter invert-48 sepia-100 saturate-500 hue-rotate-180 brightness-95 contrast-110"
                style={{
                  filter:
                    "invert(48%) sepia(100%) saturate(500%) hue-rotate(180deg) brightness(95%) contrast(110%)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
