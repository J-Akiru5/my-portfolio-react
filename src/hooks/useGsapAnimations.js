/**
 * GSAP Animation Hooks
 * 
 * Custom hooks for scroll-triggered animations using GSAP ScrollTrigger.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

/**
 * Fade in and slide up animation on scroll
 * @param {Object} options - Animation options
 */
export function useScrollReveal(options = {}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      y = 60,
      duration = 1,
      delay = 0,
      ease = 'power3.out',
      start = 'top 85%',
      toggleActions = 'play none none reverse',
    } = options;

    gsap.fromTo(
      element,
      {
        y,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [options]);

  return elementRef;
}

/**
 * Stagger animation for child elements
 * @param {Object} options - Animation options
 */
export function useStaggerReveal(options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const {
      childSelector = ':scope > *',
      y = 40,
      duration = 0.8,
      stagger = 0.15,
      ease = 'power3.out',
      start = 'top 85%',
    } = options;

    const children = container.querySelectorAll(childSelector);

    gsap.fromTo(
      children,
      {
        y,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        scrollTrigger: {
          trigger: container,
          start,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [options]);

  return containerRef;
}

/**
 * Parallax effect on scroll
 * @param {number} speed - Parallax speed (-1 to 1, negative = opposite direction)
 */
export function useParallax(speed = 0.5) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      y: () => speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [speed]);

  return elementRef;
}

/**
 * Text reveal animation (character by character)
 * @param {Object} options - Animation options
 */
export function useTextReveal(options = {}) {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const {
      duration = 0.05,
      stagger = 0.03,
      ease = 'power2.out',
      start = 'top 80%',
    } = options;

    // Split text into characters
    const text = element.textContent;
    element.innerHTML = text
      .split('')
      .map((char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');

    const chars = element.querySelectorAll('.char');

    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease,
        scrollTrigger: {
          trigger: element,
          start,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
      // Restore original text
      element.textContent = text;
    };
  }, [options]);

  return textRef;
}

/**
 * Scale in animation
 * @param {Object} options - Animation options
 */
export function useScaleReveal(options = {}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      scale = 0.8,
      duration = 1,
      ease = 'power3.out',
      start = 'top 85%',
    } = options;

    gsap.fromTo(
      element,
      {
        scale,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration,
        ease,
        scrollTrigger: {
          trigger: element,
          start,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [options]);

  return elementRef;
}

/**
 * Pin element while scrolling
 * @param {Object} options - Pin options
 */
export function useScrollPin(options = {}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      start = 'top top',
      end = '+=500',
      pinSpacing = true,
    } = options;

    ScrollTrigger.create({
      trigger: element,
      start,
      end,
      pin: true,
      pinSpacing,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [options]);

  return elementRef;
}

export default {
  useScrollReveal,
  useStaggerReveal,
  useParallax,
  useTextReveal,
  useScaleReveal,
  useScrollPin,
};
