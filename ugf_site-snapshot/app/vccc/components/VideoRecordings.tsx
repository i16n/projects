'use client';

import { VCCCData } from "@/lib/services/airtable";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from "react";

interface VideoRecordingsProps {
  vcccData: VCCCData;
  city: string;
}

interface VideoEvent {
  name: string;
  date: string;
  videoUrl: string;
  timestamp: number;
}

export default function VideoRecordings({ vcccData }: VideoRecordingsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    try {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
      return match ? match[1] : null;
    } catch (error) {
      return null;
    }
  };

  // Define video events in natural order with their corresponding dates and titles
  const videoEvents: VideoEvent[] = [
    {
      name: 'Kick Off Meeting',
      date: vcccData.kickOffMeeting ? new Date(vcccData.kickOffMeeting).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) : '',
      videoUrl: vcccData.kickOffVideoLink,
      timestamp: vcccData.kickOffMeeting ? new Date(vcccData.kickOffMeeting).getTime() : 0
    },
    {
      name: 'Deal Sourcing Training',
      date: vcccData.sourcingTraining ? new Date(vcccData.sourcingTraining).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) : '',
      videoUrl: vcccData.sourcingTrainingVideoLink,
      timestamp: vcccData.sourcingTraining ? new Date(vcccData.sourcingTraining).getTime() : 0
    },
    {
      name: 'Due Diligence Training #1',
      date: vcccData.dd1Training ? new Date(vcccData.dd1Training).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) : '',
      videoUrl: vcccData.dd1TrainingVideoLink,
      timestamp: vcccData.dd1Training ? new Date(vcccData.dd1Training).getTime() : 0
    },
    {
      name: 'Due Diligence Training #2',
      date: vcccData.dd2Training ? new Date(vcccData.dd2Training).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) : '',
      videoUrl: vcccData.dd2TrainingVideoLink,
      timestamp: vcccData.dd2Training ? new Date(vcccData.dd2Training).getTime() : 0
    }
  ].filter(event => event.videoUrl); // Only include events that have video URLs

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (videoEvents.length === 0) {
    return (
      <div className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Workshop Recordings</h2>
          <p className="text-gray-400 text-center">No workshop recordings available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Workshop Recordings</h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Stacked cards effect */}
            
            {/* Navigation buttons - Always visible since we're looping */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10 px-4">
              <button
                onClick={scrollPrev}
                className="p-2 bg-gray-800/80 text-white backdrop-blur-sm transform transition-all pointer-events-auto hover:bg-gray-700"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={scrollNext}
                className="p-2 bg-gray-800/80 text-white backdrop-blur-sm transform transition-all pointer-events-auto hover:bg-gray-700"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-hidden relative" ref={emblaRef}>
              <div className="flex">
                {videoEvents.map((event, index) => {
                  const videoId = getYouTubeId(event.videoUrl);
                  
                  return (
                    <div key={index} className="flex-[0_0_100%] min-w-0">
                      <div className="pr-4">
                        <div className="bg-gray-800 overflow-hidden p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                            <div className="flex items-center text-gray-400">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{event.date}</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {videoId && (
                              <div className="relative pt-[56.25%] bg-black overflow-hidden">
                                <iframe
                                  className="absolute top-0 left-0 w-full h-full"
                                  src={`https://www.youtube.com/embed/${videoId}`}
                                  title={event.name}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            )}
                            <p className="text-gray-300 text-sm break-all">{event.videoUrl}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-4">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 transition-colors duration-200 ${
                  index === selectedIndex ? 'bg-[#17A2FF]' : 'bg-gray-500'
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 