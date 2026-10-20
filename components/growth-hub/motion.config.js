// Single place to tune the growth-hub motion. Durations are seconds.
export const MOTION = {
  vhPerItem: 100,            // scroll distance per item while pinned (vh)
  headerOffset: 80,          // fixed header height the stage sticks below (px)
  snap: { delay: 0.12, duration: { min: 0.25, max: 0.7 }, ease: 'power2.inOut' },
  smooth: { duration: 0.7, ease: 'power3.out' },   // lag between scroll and donut rotation
  graphic: { out: 0.3, in: 0.7, stagger: 0.08 },    // swap between graphics
  mobileSpeed: 1.35,         // timeScale for graphics on small screens (shorter sequences)
  ease: { out: 'power3.out', inOut: 'power2.inOut', soft: 'sine.inOut', pop: 'back.out(1.6)' },
  donut: {
    focalDeg: 270,           // active segment settles at 9 o'clock, facing the panel
    gapDeg: 3.2,
    popPx: 10,
  },
};
