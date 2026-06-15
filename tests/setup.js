/**
 * Jest setup file — polyfills for APIs missing in jsdom.
 */

// IntersectionObserver mock
class IntersectionObserverMock {
  constructor(callback, options) {
    this._callback = callback;
    this._options = options;
    this._elements = [];
  }

  observe(element) {
    this._elements.push(element);
  }

  unobserve(element) {
    this._elements = this._elements.filter((el) => el !== element);
  }

  disconnect() {
    this._elements = [];
  }
}

global.IntersectionObserver = IntersectionObserverMock;

// scrollTo mock
if (!window.scrollTo) {
  window.scrollTo = jest.fn();
}

// Element.prototype.scrollTo mock (jsdom lacks it on elements)
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = jest.fn();
}
