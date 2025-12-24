/**
 * Smooth Scroll Provider
 * 
 * Uses Lenis for smooth scrolling and integrates with GSAP ScrollTrigger.
 * Lenis is the successor to Locomotive Scroll - more performant and actively maintained.
 */
import React, { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScrollContext } from './useSmoothScroll';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false, // Disable on touch devices for better UX
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's RAF to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Don't let GSAP ticker lag
    gsap.ticker.lagSmoothing(0);

    setIsReady(true);

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, isReady }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export default SmoothScrollProvider;
