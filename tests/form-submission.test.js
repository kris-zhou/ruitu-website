/**
 * Tests for the form submission handler in main.js.
 *
 * Because each call to loadMainJs() accumulates DOMContentLoaded handlers
 * on the shared document, submit handlers can fire more than once.
 * We use mockResolvedValue / mockRejectedValue (not *Once) to handle this.
 *
 * @jest-environment jsdom
 */

beforeAll(() => {
  window.bootstrap = { Carousel: jest.fn() };
});

function buildFormFixture() {
  document.body.innerHTML = `
    <nav class="navbar">
      <button class="navbar-toggler"></button>
      <div class="navbar-collapse"><ul class="navbar-nav"></ul></div>
    </nav>
    <div id="mainCarousel"></div>
    <form action="https://formsubmit.co/test@example.com" id="testForm">
      <input name="name" value="Test User" />
      <input name="email" value="test@example.com" />
      <textarea name="message">Hello &lt;script&gt;</textarea>
      <button type="submit">Submit</button>
    </form>
    <div class="timeline-container"></div>
    <button class="prev-btn"></button>
    <button class="next-btn"></button>
  `;
}

function loadMainJs() {
  jest.resetModules();
  require('../js/main');
  document.dispatchEvent(new Event('DOMContentLoaded'));
}

describe('Form submission handler', () => {
  beforeEach(() => {
    buildFormFixture();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('prevents default form submission and calls fetch', () => {
    loadMainJs();

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: 'true' }),
    });

    const form = document.getElementById('testForm');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    const prevented = !form.dispatchEvent(submitEvent);

    expect(prevented).toBe(true);
    expect(global.fetch).toHaveBeenCalled();
  });

  test('sends to the AJAX endpoint (replaces formsubmit.co URL)', () => {
    loadMainJs();

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: 'true' }),
    });

    const form = document.getElementById('testForm');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const fetchUrl = global.fetch.mock.calls[0][0];
    expect(fetchUrl).toBe('https://formsubmit.co/ajax/test@example.com');
  });

  test('disables submit button while submitting', () => {
    loadMainJs();

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: 'true' }),
    });

    const form = document.getElementById('testForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // At least one handler sets the button to disabled
    expect(submitBtn.disabled).toBe(true);
    expect(submitBtn.innerHTML).toContain('提交中');
  });

  test('shows success message after successful submission', async () => {
    loadMainJs();

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: 'true' }),
    });

    const form = document.getElementById('testForm');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 50));

    const successDiv = form.querySelector('.alert-success');
    expect(successDiv).not.toBeNull();
    expect(successDiv.textContent).toContain('谢谢');
  });

  test('resets the form after successful submission', async () => {
    loadMainJs();

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: 'true' }),
    });

    const form = document.getElementById('testForm');
    const resetSpy = jest.spyOn(form, 'reset');

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 50));

    expect(resetSpy).toHaveBeenCalled();
  });

  test('shows error message on network failure', async () => {
    loadMainJs();

    global.fetch.mockRejectedValue(new Error('网络错误，请稍后再试'));

    const form = document.getElementById('testForm');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 50));

    const errorDiv = form.querySelector('.alert-danger');
    expect(errorDiv).not.toBeNull();
    expect(errorDiv.textContent).toContain('提交失败');
  });

  test('shows error message when response is not ok', async () => {
    loadMainJs();

    global.fetch.mockResolvedValue({ ok: false });

    const form = document.getElementById('testForm');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await new Promise((r) => setTimeout(r, 50));

    const errorDiv = form.querySelector('.alert-danger');
    expect(errorDiv).not.toBeNull();
  });

  test('re-enables submit button after error', async () => {
    loadMainJs();

    global.fetch.mockRejectedValue(new Error('fail'));

    const form = document.getElementById('testForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 50));

    expect(submitBtn.disabled).toBe(false);
  });

  test('sanitizes HTML tags in form values', () => {
    loadMainJs();

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: 'true' }),
    });

    const form = document.getElementById('testForm');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const fetchCall = global.fetch.mock.calls[0];
    const formData = fetchCall[1].body;

    const dataField = formData.get('_data');
    expect(dataField).toBeDefined();
    const parsed = JSON.parse(dataField);
    expect(parsed.message).toContain('&lt;');
    expect(parsed.message).toContain('&gt;');
  });

  test('sets FormSubmit template and captcha parameters', () => {
    loadMainJs();

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: 'true' }),
    });

    const form = document.getElementById('testForm');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const fetchCall = global.fetch.mock.calls[0];
    const formData = fetchCall[1].body;

    expect(formData.get('_captcha')).toBe('false');
    expect(formData.get('_template')).toBe('table');
  });
});
