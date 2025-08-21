"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

export default function Counter({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) {
  const [count, setCount] = useState(0)
  const [showFlash, setShowFlash] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const countingDone = useRef(false)

  useEffect(() => {
    if (!inView || countingDone.current) return

    let startTime: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp

      const progress = Math.min((timestamp - startTime) / duration, 1)
      const currentCount = Math.floor(progress * end)

      setCount(currentCount)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setCount(end) // Ensure we end at the exact target number
        countingDone.current = true
        
        // Trigger the flash effect when counter reaches max
        setShowFlash(true)
        setTimeout(() => setShowFlash(false), 600) // Flash duration
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrameId)
  }, [inView, end, duration])

  return (
    <div ref={ref} className="text-4xl font-bold relative">
      <div className={`transition-all duration-300 ${showFlash ? 'text-[#17A2FF] drop-shadow-[0_0_20px_rgba(23,162,255,0.6)]' : 'text-white'}`}>
        {prefix}
        {count}
        {suffix}
      </div>
      {showFlash && (
        <div 
          className="absolute inset-0 opacity-0 animate-pulse"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(23, 162, 255, 0.1) 50%, transparent 70%)',
            animation: 'flashGlint 0.6s ease-out'
          }}
        />
      )}
      <style jsx>{`
        @keyframes flashGlint {
          0% {
            opacity: 0;
            transform: translateX(-100%) skewX(-15deg);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateX(100%) skewX(-15deg);
          }
        }
      `}</style>
    </div>
  )
}

