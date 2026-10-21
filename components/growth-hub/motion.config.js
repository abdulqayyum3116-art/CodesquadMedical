// Single place to tune the growth-hub motion. Durations are seconds.
export const MOTION = {
  autoPlayInterval: 4000,    // 4 seconds auto-advance per service
  rotationDuration: 0.8,     // smooth rotation between services
  graphic: { out: 0.3, in: 0.7, stagger: 0.08 },    // swap between graphics
  mobileSpeed: 1.35,         // timeScale for graphics on small screens (shorter sequences)
  ease: { out: 'power3.out', inOut: 'power2.inOut', soft: 'sine.inOut', pop: 'back.out(1.6)' },
  donut: {
    focalDeg: 270,           // active segment settles at 9 o'clock, facing the panel
    gapDeg: 3.2,
    popPx: 10,
  },
};
