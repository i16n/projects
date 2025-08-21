"use client";

interface VideoHeroProps {
  tagline: string;
  description: string;
}

export default function VideoHero({ tagline, description }: VideoHeroProps) {
  return (
    <section className="relative">
      {/* Video title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-12 mt-20">
          WHY YOU SHOULD JOIN UGF
        </h1>
      </div>

      {/* Responsive YouTube embed */}
      <div className="relative w-full max-w-6xl mx-auto shadow-lg overflow-hidden bg-black">
        <div className="relative pt-[56.25%]">{/* 16:9 aspect ratio */}
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/BMCBW0UnV0E?si=nuQXACA60OzaA70r"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Tagline and description section */}
      <div className="text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold tracking-wider mb-8">{tagline}</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-10">{description}</p>
        </div>
      </div>
    </section>
  );
}
