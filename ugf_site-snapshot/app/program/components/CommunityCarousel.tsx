"use client";

import React, { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Interface defining the structure of each photo object
interface Photo {
  src: string; // URL path to the image
  alt: string; // Alt text for accessibility
  backgroundPosition?: string; // Optional CSS background-position (e.g., "center", "right center")
}

export default function CommunityCarousel({ photos }: { photos: Photo[] }) {
  // Reference to the carousel container element
  const carouselRef = useRef<HTMLDivElement>(null);
  // State to track if component has mounted (for SSR compatibility)
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts (handles SSR)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Slick Carousel when component is ready
  useEffect(() => {
    if (isClient && carouselRef.current) {
      const initSlick = async () => {
        // Dynamically import jQuery and Slick Carousel dependencies
        const $ = (await import("jquery")).default;
        require("slick-carousel");

        // Initialize Slick Carousel with custom configuration
        $(carouselRef.current!).slick({
          dots: true, // Show navigation dots
          infinite: true, // Enable infinite loop
          speed: 300, // Animation speed in milliseconds
          slidesToShow: 1, // Show one slide at a time
          centerMode: true, // Center the active slide
          variableWidth: true, // Allow slides to have different widths
          centerPadding: "0px", // No padding around center slide
          focusOnSelect: true, // Focus on selected slide
          responsive: [
            // Responsive breakpoints
            {
              breakpoint: 9999, // Apply to all screen sizes
              settings: {
                slidesToShow: 1,
                centerMode: true,
                variableWidth: true,
                centerPadding: "0px",
              },
            },
          ],
        });

        // Add keyboard navigation
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === "ArrowLeft") {
            $(carouselRef.current!).slick("slickPrev");
          } else if (event.key === "ArrowRight") {
            $(carouselRef.current!).slick("slickNext");
          }
        };

        // Add keyboard event listener
        document.addEventListener("keydown", handleKeyDown);

        // Store the handler for cleanup
        (carouselRef.current as any)._keyboardHandler = handleKeyDown;
      };

      initSlick();

      // Cleanup function to destroy Slick Carousel when component unmounts
      return () => {
        if (carouselRef.current) {
          const $ = require("jquery");
          if ($(carouselRef.current).hasClass("slick-initialized")) {
            $(carouselRef.current).slick("unslick");
          }
          // Remove keyboard event listener
          if ((carouselRef.current as any)._keyboardHandler) {
            document.removeEventListener(
              "keydown",
              (carouselRef.current as any)._keyboardHandler
            );
          }
        }
      };
    }
  }, [isClient, photos]); // Re-run effect when client state or photos change

  // Show static version during SSR (before client-side hydration)
  if (!isClient) {
    return (
      <div className="community-carousel-container">
        <div ref={carouselRef} className="variable-width">
          {photos.map((photo, index) => (
            <div key={index} className="carousel-slide">
              <div
                className="slide-image"
                style={{
                  backgroundImage: `url(${photo.src})`,
                  backgroundPosition: photo.backgroundPosition || "center",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main component render with Slick Carousel functionality
  return (
    <div className="community-carousel-container">
      {/* Carousel container that will be initialized by Slick */}
      <div ref={carouselRef} className="variable-width">
        {photos.map((photo, index) => (
          <div key={index} className="carousel-slide">
            <div
              className="slide-image"
              style={{
                backgroundImage: `url(${photo.src})`,
                backgroundPosition: photo.backgroundPosition || "center",
              }}
            />
          </div>
        ))}
      </div>

      {/* CSS-in-JS styles for carousel appearance and Slick overrides */}
      <style jsx>{`
        /* Main carousel container styling */
        .community-carousel-container {
          position: relative;
          width: 100vw;
          margin: 0;
          padding-bottom: 15px;
        }

        /* Image styling for each slide */
        .slide-image {
          max-height: 350px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Custom styling for Slick Carousel navigation arrows */
        :global(.slick-prev),
        :global(.slick-next) {
          height: 15px;
          bottom: -25px;
          top: auto;
          transform: none;
          transition: all 0.2s ease-in-out;
          width: 15px;
          z-index: 2;
        }

        /* Custom arrow icons using SVG data URLs */
        :global(.slick-prev:before),
        :global(.slick-next:before) {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2317A2FF' stroke-width='2'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-size: contain;
          content: "";
          filter: brightness(1);
          height: 15px;
          left: calc(50% - 1px);
          opacity: 1;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.2s ease-in-out;
          width: 15px;
        }

        /* Hover effects for navigation arrows */
        :global(.slick-prev:hover),
        :global(.slick-next:hover) {
          filter: brightness(0.75);
        }

        /* Hover state arrow icons (lighter blue color) */
        :global(.slick-prev:hover:before),
        :global(.slick-next:hover:before) {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23B2E0FF' stroke-width='2'%3E%3Cpath d='M15 18l-6-6 6-6'/%3E%3C/svg%3E");
        }

        /* Position left arrow */
        :global(.slick-prev) {
          left: auto;
          right: 50px;
        }

        /* Position right arrow */
        :global(.slick-next) {
          right: 32px;
        }

        /* Flip right arrow horizontally */
        :global(.slick-next:before) {
          left: calc(50% + 1px);
          transform: translate(-50%, -50%) scaleX(-1);
        }

        /* Navigation dots container */
        :global(.slick-dots) {
          bottom: -30px;
        }

        /* Individual dot container */
        :global(.slick-dots li) {
          margin: 0;
          width: 18px;
        }

        /* Dot button styling */
        :global(.slick-dots li button) {
          width: 18px;
        }

        /* Dot appearance (using UGF blue color) */
        :global(.slick-dots li button:before) {
          color: #17a2ff;
          font-size: 12px;
          opacity: 1;
          transition: all 0.2s ease-in-out;
        }

        /* Active and hover state dots (lighter blue) */
        :global(.slick-dots li.slick-active button:before),
        :global(.slick-dots li:hover button:before) {
          color: #b2e0ff;
        }

        /* Responsive design for larger screens (tablet and desktop) */
        @media (min-width: 768px) {
          /* Increase container padding for larger screens */
          .community-carousel-container {
            padding-bottom: 0px;
          }

          /* Larger slide images on bigger screens */
          .slide-image {
            height: 500px;
            width: 600px;
          }

          /* Adjust arrow positioning for larger screens */
          :global(.slick-prev) {
            right: 62px;
          }

          /* Larger navigation arrows on bigger screens */
          :global(.slick-prev),
          :global(.slick-next) {
            bottom: -35px;
            height: 25px;
            width: 25px;
          }

          /* Larger arrow icons */
          :global(.slick-prev:before),
          :global(.slick-next:before) {
            height: 25px;
            width: 25px;
          }

          /* Adjust dots positioning */
          :global(.slick-dots) {
            bottom: -35px;
          }

          /* Larger dot containers */
          :global(.slick-dots li) {
            height: 20px;
            width: 20px;
          }

          /* Larger dot buttons */
          :global(.slick-dots li button) {
            height: 20px;
            width: 20px;
          }

          /* Larger dot text */
          :global(.slick-dots li button:before) {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
