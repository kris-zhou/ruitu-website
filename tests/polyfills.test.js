/**
 * Tests for the browser polyfills section of main.js (lines 1-205).
 *
 * @jest-environment jsdom
 */

// Stub bootstrap.Carousel
beforeAll(() => {
  window.bootstrap = { Carousel: jest.fn() };
});

function loadMainJs() {
  jest.resetModules();
  require('../js/main');
  document.dispatchEvent(new Event('DOMContentLoaded'));
}

// ---------------------------------------------------------------------------
// Object.assign polyfill
// ---------------------------------------------------------------------------
describe('Object.assign polyfill', () => {
  test('is available after loading main.js', () => {
    // Temporarily remove native Object.assign to test the polyfill
    const orig = Object.assign;
    delete Object.assign;

    loadMainJs();

    expect(typeof Object.assign).toBe('function');

    // Verify basic functionality
    const result = Object.assign({}, { a: 1 }, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });

    // Restore
    Object.assign = orig;
  });

  test('polyfill throws on null/undefined target', () => {
    const orig = Object.assign;
    delete Object.assign;

    loadMainJs();

    expect(() => Object.assign(null)).toThrow(TypeError);
    expect(() => Object.assign(undefined)).toThrow(TypeError);

    Object.assign = orig;
  });

  test('polyfill copies own enumerable properties', () => {
    const orig = Object.assign;
    delete Object.assign;

    loadMainJs();

    const target = { x: 0 };
    const source = Object.create({ inherited: true });
    source.own = 42;

    const result = Object.assign(target, source);
    expect(result.own).toBe(42);
    expect(result.inherited).toBeUndefined();

    Object.assign = orig;
  });

  test('polyfill skips null/undefined sources', () => {
    const orig = Object.assign;
    delete Object.assign;

    loadMainJs();

    const result = Object.assign({}, null, { a: 1 }, undefined, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });

    Object.assign = orig;
  });
});

// ---------------------------------------------------------------------------
// Element.closest polyfill
// ---------------------------------------------------------------------------
describe('Element.closest polyfill', () => {
  test('traverses up the DOM to find a matching ancestor', () => {
    document.body.innerHTML = `
      <div class="outer">
        <div class="inner">
          <span id="target">hello</span>
        </div>
      </div>
    `;

    const target = document.getElementById('target');
    const result = target.closest('.outer');
    expect(result).not.toBeNull();
    expect(result.classList.contains('outer')).toBe(true);
  });

  test('returns null when no ancestor matches', () => {
    document.body.innerHTML = `<div id="alone">solo</div>`;
    const el = document.getElementById('alone');
    expect(el.closest('.nonexistent')).toBeNull();
  });

  test('returns the element itself if it matches', () => {
    document.body.innerHTML = `<div class="self" id="self">self</div>`;
    const el = document.getElementById('self');
    expect(el.closest('.self')).toBe(el);
  });
});

// ---------------------------------------------------------------------------
// Viewport height CSS variable
// ---------------------------------------------------------------------------
describe('Viewport height --vh CSS variable', () => {
  test('sets --vh on DOMContentLoaded', () => {
    document.body.innerHTML = `
      <nav class="navbar"><button class="navbar-toggler"></button>
      <div class="navbar-collapse"><ul class="navbar-nav"></ul></div></nav>
      <div id="mainCarousel"></div>
      <div class="timeline-container"></div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
    `;

    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    });

    loadMainJs();

    const vh = document.documentElement.style.getPropertyValue('--vh');
    expect(vh).toBe('8px');
  });
});

// ---------------------------------------------------------------------------
// Browser detection CSS classes
// ---------------------------------------------------------------------------
describe('Browser detection CSS classes', () => {
  test('does not add browser classes in jsdom (no specific UA)', () => {
    document.body.innerHTML = `
      <nav class="navbar"><button class="navbar-toggler"></button>
      <div class="navbar-collapse"><ul class="navbar-nav"></ul></div></nav>
      <div id="mainCarousel"></div>
      <div class="timeline-container"></div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
    `;

    loadMainJs();

    const html = document.documentElement;
    // jsdom is not IE, Edge, or Safari
    expect(html.classList.contains('is-ie')).toBe(false);
    expect(html.classList.contains('is-edge')).toBe(false);
    expect(html.classList.contains('is-safari')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Mobile touch event handlers
// ---------------------------------------------------------------------------
describe('Mobile touch handlers', () => {
  test('adds touch-hover class on hover-effect elements (when isMobile)', () => {
    // Simulate mobile UA
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      writable: true,
      configurable: true,
    });

    document.body.innerHTML = `
      <nav class="navbar"><button class="navbar-toggler"></button>
      <div class="navbar-collapse"><ul class="navbar-nav"></ul></div></nav>
      <div id="mainCarousel"></div>
      <div class="hover-effect" id="hoverEl">hover me</div>
      <div class="timeline-container"></div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
    `;

    loadMainJs();

    const hoverEl = document.getElementById('hoverEl');
    hoverEl.dispatchEvent(new Event('touchstart'));
    expect(hoverEl.classList.contains('touch-hover')).toBe(true);
  });
});
