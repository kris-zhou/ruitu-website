/**
 * Utility functions for the Ruitu website.
 * Extracted from main.js for testability and reuse.
 */

/**
 * Throttle — limits how often `func` can fire.
 * The first call executes immediately; subsequent calls within `limit` ms
 * are deferred until the limit window elapses.
 */
function throttle(func, limit) {
    var lastFunc, lastRan;
    return function () {
        var context = this;
        var args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Debounce — delays `func` execution until `wait` ms after the last call.
 */
function debounce(func, wait) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Cubic ease-in-out used for smooth-scroll animation.
 * Returns a value in [0, 1] for input t in [0, 1].
 */
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

/**
 * Build a language-specific URL given the target language code
 * and the current path (window.location.pathname).
 *
 * @param {string} lang  - 'zh' | 'en' | 'kr'
 * @param {string} currentPath - e.g. '/', '/en/english.html', '/kr/korean.html'
 * @returns {string|undefined} target URL, or undefined for unknown lang
 */
function buildLanguageUrl(lang, currentPath) {
    var baseUrl = '';
    var pathSegments = currentPath.split('/');

    if (pathSegments.some(function (segment) { return segment === 'en' || segment === 'kr'; })) {
        baseUrl = '../';
    }

    if (lang === 'zh') {
        return baseUrl + 'index.html';
    } else if (lang === 'en') {
        return baseUrl + 'en/english.html';
    } else if (lang === 'kr') {
        return baseUrl + 'kr/korean.html';
    }
    return undefined;
}

/**
 * Sanitize a string for safe HTML display by escaping < and >.
 */
function sanitizeHtml(value) {
    if (typeof value !== 'string') return value;
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Calculate the number of days remaining from `today` to `eventDateStr`.
 * Returns a positive number if the event is in the future, negative if past.
 *
 * @param {string} eventDateStr - ISO-8601 or parseable date string
 * @param {Date}   [today]      - reference date (defaults to now)
 * @returns {number} days remaining (ceiling)
 */
function daysRemaining(eventDateStr, today) {
    var eventDate = new Date(eventDateStr);
    today = today || new Date();
    var diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate the CSS --vh custom property value (1% of viewport height).
 */
function calcVh(innerHeight) {
    return innerHeight * 0.01;
}

// Export for Node.js / Jest; in browser these are globals on the window.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        throttle: throttle,
        debounce: debounce,
        easeInOutCubic: easeInOutCubic,
        buildLanguageUrl: buildLanguageUrl,
        sanitizeHtml: sanitizeHtml,
        daysRemaining: daysRemaining,
        calcVh: calcVh,
    };
}
