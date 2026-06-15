/**
 * Tests for gallery interactions, authenticity items, and timeline navigation.
 *
 * @jest-environment jsdom
 */

beforeAll(() => {
  window.bootstrap = { Carousel: jest.fn() };
});

function loadMainJs() {
  jest.resetModules();
  require('../js/main');
  document.dispatchEvent(new Event('DOMContentLoaded'));
}

// ---------------------------------------------------------------------------
// Authenticity gallery
// ---------------------------------------------------------------------------
describe('Authenticity gallery', () => {
  function buildGalleryFixture() {
    document.body.innerHTML = `
      <nav class="navbar">
        <button class="navbar-toggler"></button>
        <div class="navbar-collapse"><ul class="navbar-nav"></ul></div>
      </nav>
      <div id="mainCarousel"></div>
      <div class="authenticity-gallery">
        <div class="authenticity-item">
          <div class="authenticity-item-inner">
            <img src="test1.jpg" />
          </div>
        </div>
        <div class="authenticity-item">
          <div class="authenticity-item-inner">
            <img src="test2.jpg" />
          </div>
        </div>
      </div>
      <div class="timeline-container"></div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
    `;
  }

  beforeEach(() => {
    buildGalleryFixture();
    loadMainJs();
  });

  test('sets random CSS custom property on each gallery item', () => {
    const items = document.querySelectorAll('.authenticity-item');
    items.forEach((item) => {
      const randomVal = item.style.getPropertyValue('--random');
      expect(randomVal).toBeTruthy();
      const num = parseFloat(randomVal);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(1);
    });
  });

  test('sets random rotation transform on each gallery item', () => {
    const items = document.querySelectorAll('.authenticity-item');
    items.forEach((item) => {
      expect(item.style.transform).toMatch(/rotate\([-\d.]+deg\)/);
    });
  });

  test('sets box-shadow on each gallery item', () => {
    const items = document.querySelectorAll('.authenticity-item');
    items.forEach((item) => {
      expect(item.style.boxShadow).toBeTruthy();
    });
  });

  test('creates imageModal when gallery items exist', () => {
    const modal = document.getElementById('imageModal');
    expect(modal).not.toBeNull();
  });

  test('clicking a gallery item opens the image modal', () => {
    const item = document.querySelector('.authenticity-item');
    item.click();

    const modal = document.getElementById('imageModal');
    expect(modal.style.display).toBe('flex');
  });

  test('mouseenter on item reduces opacity of others', () => {
    const items = document.querySelectorAll('.authenticity-item');
    const first = items[0];
    const second = items[1];

    first.dispatchEvent(new Event('mouseenter'));

    expect(second.style.opacity).toBe('0.7');
    expect(second.style.filter).toBe('blur(2px)');
  });

  test('mouseleave restores opacity of all items', () => {
    const items = document.querySelectorAll('.authenticity-item');
    const first = items[0];

    first.dispatchEvent(new Event('mouseenter'));
    first.dispatchEvent(new Event('mouseleave'));

    items.forEach((item) => {
      expect(item.style.opacity).toBe('1');
      expect(item.style.filter).toBe('none');
    });
  });
});

// ---------------------------------------------------------------------------
// Authenticity document view buttons
// ---------------------------------------------------------------------------
describe('Authenticity document view', () => {
  function buildAuthenticityFixture() {
    document.body.innerHTML = `
      <nav class="navbar">
        <button class="navbar-toggler"></button>
        <div class="navbar-collapse"><ul class="navbar-nav"></ul></div>
      </nav>
      <div id="mainCarousel"></div>
      <div class="authenticity-item">
        <div class="authenticity-img-container"><img src="doc.jpg" /></div>
        <span class="authenticity-title">Certificate</span>
        <span class="authenticity-id">ID-001</span>
        <span class="authenticity-date">2025-01-01</span>
        <span class="authenticity-status">Valid</span>
        <button class="authenticity-view">View</button>
      </div>
      <div class="timeline-container"></div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
    `;
  }

  beforeEach(() => {
    buildAuthenticityFixture();
    loadMainJs();
  });

  test('clicking view button opens modal with document details', () => {
    const viewBtn = document.querySelector('.authenticity-view');
    viewBtn.click();

    const modal = document.getElementById('imageModal');
    expect(modal.style.display).toBe('flex');

    const modalImg = modal.querySelector('.image-modal-img');
    expect(modalImg.src).toContain('doc.jpg');
  });

  test('clicking authenticity image triggers view button click', () => {
    const img = document.querySelector('.authenticity-img-container img');
    img.click();

    const modal = document.getElementById('imageModal');
    expect(modal.style.display).toBe('flex');
  });

  test('authenticity items have hover scale effect', () => {
    const item = document.querySelector('.authenticity-item');
    const status = item.querySelector('.authenticity-status');

    item.dispatchEvent(new Event('mouseenter'));
    expect(status.style.transform).toBe('scale(1.05)');

    item.dispatchEvent(new Event('mouseleave'));
    expect(status.style.transform).toBe('scale(1)');
  });
});

// ---------------------------------------------------------------------------
// Timeline navigation
// ---------------------------------------------------------------------------
describe('Timeline navigation', () => {
  function buildTimelineFixture() {
    document.body.innerHTML = `
      <nav class="navbar">
        <button class="navbar-toggler"></button>
        <div class="navbar-collapse"><ul class="navbar-nav"></ul></div>
      </nav>
      <div id="mainCarousel"></div>
      <div class="timeline-container" style="width:400px;overflow-x:auto;">
        <div class="exhibition-card upcoming" data-date="2099-12-31">
          <span class="badge bg-secondary"></span>
        </div>
        <div class="exhibition-card past" data-date="2020-01-01"></div>
      </div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
      <div class="timeline-controls">
        <button data-filter="all" class="active">All</button>
        <button data-filter="upcoming">Upcoming</button>
      </div>
    `;
  }

  beforeEach(() => {
    buildTimelineFixture();
    loadMainJs();
  });

  test('prev button is initially disabled', () => {
    const prevBtn = document.querySelector('.prev-btn');
    expect(prevBtn.disabled).toBe(true);
  });

  test('clicking next button calls scrollTo on container', () => {
    const nextBtn = document.querySelector('.next-btn');
    const container = document.querySelector('.timeline-container');
    const scrollSpy = jest.spyOn(container, 'scrollTo');

    // jsdom reports scrollWidth === clientWidth === 0, so nextBtn is disabled.
    // Enable it manually to test the click handler.
    nextBtn.disabled = false;
    nextBtn.click();

    expect(scrollSpy).toHaveBeenCalled();
  });

  test('clicking prev button calls scrollTo on container', () => {
    const prevBtn = document.querySelector('.prev-btn');
    const container = document.querySelector('.timeline-container');
    const scrollSpy = jest.spyOn(container, 'scrollTo');

    // Enable prev button
    prevBtn.disabled = false;
    prevBtn.click();

    expect(scrollSpy).toHaveBeenCalled();
  });

  test('scroll event on container updates scroll position tracking', () => {
    const container = document.querySelector('.timeline-container');

    // Simulate a scroll
    Object.defineProperty(container, 'scrollLeft', { value: 100, configurable: true });
    container.dispatchEvent(new Event('scroll'));

    // The internal scrollPosition should be updated (verified via button state)
    const prevBtn = document.querySelector('.prev-btn');
    // After scrolling forward, prev should be enabled
    // (depends on scrollLeft > 0, which we set to 100)
    expect(prevBtn.disabled).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Business process hexagon animation
// ---------------------------------------------------------------------------
describe('Business process hexagons', () => {
  function buildHexagonFixture() {
    document.body.innerHTML = `
      <nav class="navbar">
        <button class="navbar-toggler"></button>
        <div class="navbar-collapse"><ul class="navbar-nav"></ul></div>
      </nav>
      <div id="mainCarousel"></div>
      <div class="business-process">
        <div class="hexagon-wrapper" data-step="1">Step 1</div>
        <div class="hexagon-wrapper" data-step="2">Step 2</div>
        <div class="hexagon-wrapper" data-step="3">Step 3</div>
      </div>
      <div class="timeline-container"></div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
    `;
  }

  beforeEach(() => {
    buildHexagonFixture();
    loadMainJs();
  });

  test('hexagons start with opacity 0', () => {
    const hexagons = document.querySelectorAll('.hexagon-wrapper');
    hexagons.forEach((hex) => {
      expect(hex.style.opacity).toBe('0');
    });
  });

  test('hexagons have transition set', () => {
    const hexagons = document.querySelectorAll('.hexagon-wrapper');
    hexagons.forEach((hex) => {
      expect(hex.style.transition).toContain('opacity');
    });
  });

  test('injects .hexagon-wrapper.animate CSS rule', () => {
    const styles = document.querySelectorAll('style');
    const hasAnimateRule = Array.from(styles).some((s) =>
      s.innerHTML.includes('.hexagon-wrapper.animate')
    );
    expect(hasAnimateRule).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Responsive table/video wrapping
// ---------------------------------------------------------------------------
describe('Responsive wrapping', () => {
  function buildResponsiveFixture() {
    document.body.innerHTML = `
      <nav class="navbar">
        <button class="navbar-toggler"></button>
        <div class="navbar-collapse"><ul class="navbar-nav"></ul></div>
      </nav>
      <div id="mainCarousel"></div>
      <table id="testTable"><tr><td>data</td></tr></table>
      <iframe id="testVideo" src="https://youtube.com/embed/test"></iframe>
      <div class="timeline-container"></div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
    `;
  }

  beforeEach(() => {
    buildResponsiveFixture();
    loadMainJs();
  });

  test('wraps bare tables in .table-responsive div', () => {
    const table = document.getElementById('testTable');
    expect(table.parentNode.classList.contains('table-responsive')).toBe(true);
  });

  test('wraps youtube iframes in .responsive-video div', () => {
    const iframe = document.getElementById('testVideo');
    expect(iframe.parentNode.classList.contains('responsive-video')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Image error fallback
// ---------------------------------------------------------------------------
describe('Image error fallback', () => {
  function buildImageFixture() {
    document.body.innerHTML = `
      <nav class="navbar">
        <button class="navbar-toggler"></button>
        <div class="navbar-collapse"><ul class="navbar-nav"></ul></div>
      </nav>
      <div id="mainCarousel"></div>
      <img id="testImg" src="nonexistent.jpg" />
      <div class="timeline-container"></div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
    `;
  }

  beforeEach(() => {
    buildImageFixture();
    loadMainJs();
  });

  test('sets placeholder src and adds img-error class on error', () => {
    const img = document.getElementById('testImg');
    img.dispatchEvent(new Event('error'));

    expect(img.src).toContain('images/placeholder.png');
    expect(img.classList.contains('img-error')).toBe(true);
  });
});
