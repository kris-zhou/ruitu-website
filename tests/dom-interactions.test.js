/**
 * DOM interaction tests for main.js functionality.
 *
 * These tests exercise the DOM-dependent parts of main.js by setting up
 * minimal HTML fixtures and simulating events in jsdom.
 *
 * @jest-environment jsdom
 */

// Stub bootstrap.Carousel so main.js doesn't throw when it tries to instantiate one.
beforeAll(() => {
  window.bootstrap = {
    Carousel: jest.fn(),
  };
});

// ---------------------------------------------------------------------------
// Helper: build a minimal HTML fixture that main.js expects
// ---------------------------------------------------------------------------
function buildBaseFixture() {
  document.body.innerHTML = `
    <nav class="navbar">
      <button class="navbar-toggler"></button>
      <div class="navbar-collapse">
        <ul class="navbar-nav">
          <li><a class="nav-link" href="#about">About</a></li>
          <li><a class="nav-link" href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
    <div id="mainCarousel"></div>
    <section id="about"></section>
    <section id="contact"></section>
    <div class="timeline-container" style="width:400px;overflow:auto;">
      <div class="exhibition-card upcoming" data-date="2099-12-31" data-filter="future">
        <span class="badge bg-secondary"></span>
      </div>
      <div class="exhibition-card past" data-date="2020-01-01" data-filter="past"></div>
    </div>
    <button class="prev-btn"></button>
    <button class="next-btn"></button>
    <div class="timeline-controls">
      <button data-filter="all" class="active">All</button>
      <button data-filter="upcoming">Upcoming</button>
      <button data-filter="past">Past</button>
    </div>
    <div class="company-environment">
      <h2 class="section-title">Environment</h2>
      <p class="lead">Description</p>
    </div>
    <div class="environment-item">Item 1</div>
    <a href="#about" class="smooth-link">Go to about</a>
    <a data-lang="zh">中文</a>
    <a data-lang="en">English</a>
    <a data-lang="kr">한국어</a>
  `;
}

// ---------------------------------------------------------------------------
// Load main.js once per test file (after fixture is ready)
// ---------------------------------------------------------------------------
function loadMainJs() {
  // main.js listens for DOMContentLoaded, so we need to fire it manually
  // after requiring the script.
  jest.resetModules();
  require('../js/main');
  document.dispatchEvent(new Event('DOMContentLoaded'));
}

// ---------------------------------------------------------------------------
// Navbar scroll behaviour
// ---------------------------------------------------------------------------
describe('Navbar scroll class toggling', () => {
  beforeEach(() => {
    buildBaseFixture();
    loadMainJs();
  });

  test('adds navbar-scrolled when scrollY > 50', () => {
    const navbar = document.querySelector('.navbar');

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    expect(navbar.classList.contains('navbar-scrolled')).toBe(true);
  });

  test('removes navbar-scrolled when scrollY <= 50', () => {
    const navbar = document.querySelector('.navbar');

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('navbar-scrolled')).toBe(true);

    Object.defineProperty(window, 'scrollY', { value: 20, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('navbar-scrolled')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Back-to-top button
// ---------------------------------------------------------------------------
describe('Back-to-top button', () => {
  beforeEach(() => {
    buildBaseFixture();
    loadMainJs();
  });

  test('is created and appended to body', () => {
    const btn = document.getElementById('backToTop');
    expect(btn).not.toBeNull();
    expect(btn.classList.contains('back-to-top')).toBe(true);
  });

  test('shows when scrolled past 300px', () => {
    const btn = document.getElementById('backToTop');

    Object.defineProperty(window, 'pageYOffset', { value: 400, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    expect(btn.classList.contains('show')).toBe(true);
  });

  test('hides when scrolled back to top', () => {
    const btn = document.getElementById('backToTop');

    Object.defineProperty(window, 'pageYOffset', { value: 400, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(btn.classList.contains('show')).toBe(true);

    Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(btn.classList.contains('show')).toBe(false);
  });

  test('scrolls to top on click', () => {
    window.scrollTo = jest.fn();
    const btn = document.getElementById('backToTop');
    btn.click();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

// ---------------------------------------------------------------------------
// Hamburger menu toggle
// ---------------------------------------------------------------------------
describe('Hamburger navbar toggler', () => {
  beforeEach(() => {
    buildBaseFixture();
    loadMainJs();
  });

  test('toggles .show on navbar-collapse when toggler is clicked', () => {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('.navbar-collapse');

    toggler.click();
    expect(collapse.classList.contains('show')).toBe(true);

    toggler.click();
    expect(collapse.classList.contains('show')).toBe(false);
  });

  test('closes menu when a nav-link is clicked on mobile viewport', () => {
    const collapse = document.querySelector('.navbar-collapse');

    // Open menu directly (avoid duplicate-handler issue from multiple loadMainJs)
    collapse.classList.add('show');

    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true, configurable: true });

    const link = document.querySelector('.nav-link');
    link.click();
    expect(collapse.classList.contains('show')).toBe(false);
  });

  test('closes menu when clicking outside', () => {
    const collapse = document.querySelector('.navbar-collapse');

    // Open menu directly
    collapse.classList.add('show');

    // Click outside
    document.body.click();
    expect(collapse.classList.contains('show')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Exhibition card filtering
// ---------------------------------------------------------------------------
describe('Exhibition card filtering', () => {
  beforeEach(() => {
    buildBaseFixture();
    loadMainJs();
  });

  test('filter "all" removes .filtered from all cards', () => {
    const allBtn = document.querySelector('[data-filter="all"]');
    const cards = document.querySelectorAll('.exhibition-card');

    allBtn.click();
    cards.forEach((card) => {
      expect(card.classList.contains('filtered')).toBe(false);
    });
  });

  test('filter "upcoming" hides non-upcoming cards', () => {
    const upcomingBtn = document.querySelector('[data-filter="upcoming"]');
    upcomingBtn.click();

    const upcomingCard = document.querySelector('.exhibition-card.upcoming');
    const pastCard = document.querySelector('.exhibition-card.past');

    expect(upcomingCard.classList.contains('filtered')).toBe(false);
    expect(pastCard.classList.contains('filtered')).toBe(true);
  });

  test('filter button gets .active class and others lose it', () => {
    const buttons = document.querySelectorAll('[data-filter]');
    const upcomingBtn = document.querySelector('[data-filter="upcoming"]');

    upcomingBtn.click();

    expect(upcomingBtn.classList.contains('active')).toBe(true);
    buttons.forEach((btn) => {
      if (btn !== upcomingBtn) {
        expect(btn.classList.contains('active')).toBe(false);
      }
    });
  });
});

// ---------------------------------------------------------------------------
// Days remaining badge update
// ---------------------------------------------------------------------------
describe('Days remaining badge', () => {
  beforeEach(() => {
    buildBaseFixture();
    loadMainJs();
  });

  test('updates the badge text with remaining days for upcoming cards', () => {
    const badge = document.querySelector('.exhibition-card.upcoming .badge.bg-secondary');
    // The card has data-date="2099-12-31" which is far in the future
    expect(badge.textContent).toMatch(/剩余: \d+天/);
  });
});

// ---------------------------------------------------------------------------
// Environment animation observer setup
// ---------------------------------------------------------------------------
describe('Environment animation observer', () => {
  beforeEach(() => {
    buildBaseFixture();
    loadMainJs();
  });

  test('environment items get .environment-initial class', () => {
    const items = document.querySelectorAll('.environment-item');
    items.forEach((item) => {
      expect(item.classList.contains('environment-initial')).toBe(true);
    });
  });

  test('section title gets .title-initial class', () => {
    const title = document.querySelector('.company-environment .section-title');
    expect(title.classList.contains('title-initial')).toBe(true);
  });

  test('lead description gets .desc-initial class', () => {
    const desc = document.querySelector('.company-environment .lead');
    expect(desc.classList.contains('desc-initial')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Language switch links
// ---------------------------------------------------------------------------
describe('Language switch links', () => {
  beforeEach(() => {
    buildBaseFixture();
    loadMainJs();
  });

  test('clicking a language link calls preventDefault and sets location', () => {
    // We can't fully test navigation in jsdom, but we can verify the
    // click handler calls preventDefault.
    const zhLink = document.querySelector('[data-lang="zh"]');
    const event = new Event('click', { bubbles: true, cancelable: true });
    const prevented = !zhLink.dispatchEvent(event);
    expect(prevented).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Image modal creation (for product images)
// ---------------------------------------------------------------------------
describe('Image modal', () => {
  beforeEach(() => {
    // Add product images to the fixture
    document.body.innerHTML = `
      <nav class="navbar">
        <button class="navbar-toggler"></button>
        <div class="navbar-collapse">
          <ul class="navbar-nav">
            <li><a class="nav-link" href="#">Link</a></li>
          </ul>
        </div>
      </nav>
      <div id="mainCarousel"></div>
      <div class="uno"><img src="test.jpg" /></div>
      <div class="timeline-container" style="width:400px;overflow:auto;"></div>
      <button class="prev-btn"></button>
      <button class="next-btn"></button>
    `;
    loadMainJs();
  });

  test('creates imageModal element when product images exist', () => {
    const modal = document.getElementById('imageModal');
    expect(modal).not.toBeNull();
    expect(modal.classList.contains('image-modal')).toBe(true);
  });

  test('product images get cursor:zoom-in style', () => {
    const img = document.querySelector('.uno img');
    expect(img.style.cursor).toBe('zoom-in');
  });

  test('clicking a product image opens the modal', () => {
    const img = document.querySelector('.uno img');
    img.click();

    const modal = document.getElementById('imageModal');
    expect(modal.style.display).toBe('flex');
  });

  test('clicking the close button hides the modal', () => {
    jest.useFakeTimers();

    const img = document.querySelector('.uno img');
    img.click();

    const modal = document.getElementById('imageModal');
    const closeBtn = modal.querySelector('.image-modal-close');
    closeBtn.click();

    expect(modal.classList.contains('show')).toBe(false);

    jest.advanceTimersByTime(350);
    expect(modal.style.display).toBe('none');

    jest.useRealTimers();
  });
});
