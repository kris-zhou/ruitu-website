/**
 * Unit tests for js/utils.js — pure utility functions.
 */
const {
  throttle,
  debounce,
  easeInOutCubic,
  buildLanguageUrl,
  sanitizeHtml,
  daysRemaining,
  calcVh,
} = require('../js/utils');

// ---------------------------------------------------------------------------
// throttle
// ---------------------------------------------------------------------------
describe('throttle', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('executes immediately on first call', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('suppresses rapid calls within the limit window', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);
    throttled(); // immediate
    throttled(); // should be deferred
    throttled(); // should replace previous deferred
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('fires deferred call after limit elapses', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);
    throttled();
    throttled();
    jest.advanceTimersByTime(250);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('preserves context and arguments', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);
    const ctx = { key: 'value' };
    throttled.call(ctx, 'a', 'b');
    expect(fn).toHaveBeenCalledWith('a', 'b');
    expect(fn.mock.instances[0]).toBe(ctx);
  });
});

// ---------------------------------------------------------------------------
// debounce
// ---------------------------------------------------------------------------
describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('does not execute immediately', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    expect(fn).not.toHaveBeenCalled();
  });

  test('executes after the wait period', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    jest.advanceTimersByTime(150);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('resets the timer on subsequent calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    jest.advanceTimersByTime(80);
    debounced(); // restart the timer
    jest.advanceTimersByTime(80);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('preserves context and arguments', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 50);
    const ctx = { id: 42 };
    debounced.call(ctx, 'x');
    jest.advanceTimersByTime(60);
    expect(fn).toHaveBeenCalledWith('x');
    expect(fn.mock.instances[0]).toBe(ctx);
  });
});

// ---------------------------------------------------------------------------
// easeInOutCubic
// ---------------------------------------------------------------------------
describe('easeInOutCubic', () => {
  test('returns 0 at t=0', () => {
    expect(easeInOutCubic(0)).toBe(0);
  });

  test('returns 1 at t=1', () => {
    expect(easeInOutCubic(1)).toBe(1);
  });

  test('returns 0.5 at t=0.5', () => {
    expect(easeInOutCubic(0.5)).toBe(0.5);
  });

  test('is monotonically increasing on [0,1]', () => {
    let prev = 0;
    for (let t = 0; t <= 1; t += 0.01) {
      const v = easeInOutCubic(t);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  test('first half grows slowly (cubic ease-in)', () => {
    expect(easeInOutCubic(0.25)).toBeCloseTo(0.0625, 5);
  });

  test('second half approaches 1 quickly (cubic ease-out)', () => {
    expect(easeInOutCubic(0.75)).toBeCloseTo(0.9375, 5);
  });
});

// ---------------------------------------------------------------------------
// buildLanguageUrl
// ---------------------------------------------------------------------------
describe('buildLanguageUrl', () => {
  test('zh from root', () => {
    expect(buildLanguageUrl('zh', '/')).toBe('index.html');
  });

  test('en from root', () => {
    expect(buildLanguageUrl('en', '/')).toBe('en/english.html');
  });

  test('kr from root', () => {
    expect(buildLanguageUrl('kr', '/')).toBe('kr/korean.html');
  });

  test('zh from /en/english.html (goes up one level)', () => {
    expect(buildLanguageUrl('zh', '/en/english.html')).toBe('../index.html');
  });

  test('kr from /en/english.html', () => {
    expect(buildLanguageUrl('kr', '/en/english.html')).toBe('../kr/korean.html');
  });

  test('en from /kr/korean.html', () => {
    expect(buildLanguageUrl('en', '/kr/korean.html')).toBe('../en/english.html');
  });

  test('zh from /kr/korean.html', () => {
    expect(buildLanguageUrl('zh', '/kr/korean.html')).toBe('../index.html');
  });

  test('returns undefined for unknown language code', () => {
    expect(buildLanguageUrl('fr', '/')).toBeUndefined();
  });

  test('handles index.html path without language prefix', () => {
    expect(buildLanguageUrl('en', '/index.html')).toBe('en/english.html');
  });
});

// ---------------------------------------------------------------------------
// sanitizeHtml
// ---------------------------------------------------------------------------
describe('sanitizeHtml', () => {
  test('escapes < and >', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert("xss")&lt;/script&gt;'
    );
  });

  test('leaves normal text unchanged', () => {
    expect(sanitizeHtml('Hello World')).toBe('Hello World');
  });

  test('handles empty string', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  test('returns non-string values as-is', () => {
    expect(sanitizeHtml(42)).toBe(42);
    expect(sanitizeHtml(null)).toBe(null);
    expect(sanitizeHtml(undefined)).toBe(undefined);
  });

  test('escapes multiple angle brackets', () => {
    expect(sanitizeHtml('a < b > c < d')).toBe('a &lt; b &gt; c &lt; d');
  });

  test('handles strings with only angle brackets', () => {
    expect(sanitizeHtml('<<<>>>')).toBe('&lt;&lt;&lt;&gt;&gt;&gt;');
  });
});

// ---------------------------------------------------------------------------
// daysRemaining
// ---------------------------------------------------------------------------
describe('daysRemaining', () => {
  test('returns positive days for future event', () => {
    const today = new Date('2025-01-01');
    expect(daysRemaining('2025-01-11', today)).toBe(10);
  });

  test('returns negative days for past event', () => {
    const today = new Date('2025-01-11');
    expect(daysRemaining('2025-01-01', today)).toBe(-10);
  });

  test('returns 0 for same-day event', () => {
    const today = new Date('2025-06-15T00:00:00');
    expect(daysRemaining('2025-06-15', today)).toBe(0);
  });

  test('rounds up partial days (uses ceil)', () => {
    const today = new Date('2025-01-01T12:00:00');
    expect(daysRemaining('2025-01-03T00:00:00', today)).toBe(2);
  });

  test('handles year boundaries', () => {
    const today = new Date('2024-12-31');
    expect(daysRemaining('2025-01-01', today)).toBe(1);
  });

  test('defaults today to current date when omitted', () => {
    const farFuture = '2099-01-01';
    expect(daysRemaining(farFuture)).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// calcVh
// ---------------------------------------------------------------------------
describe('calcVh', () => {
  test('returns 1% of provided height', () => {
    expect(calcVh(1000)).toBe(10);
  });

  test('returns 0 for height 0', () => {
    expect(calcVh(0)).toBe(0);
  });

  test('handles typical mobile height', () => {
    expect(calcVh(667)).toBeCloseTo(6.67, 2);
  });

  test('handles typical desktop height', () => {
    expect(calcVh(1080)).toBeCloseTo(10.8, 2);
  });
});
