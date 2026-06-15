/**
 * Shared site components and utilities.
 *
 * Centralises the navbar, footer, head-meta injection and image-modal
 * creation so that every page in every language reuses the same code
 * instead of copy-pasting hundreds of lines of identical markup.
 *
 * Usage (per page):
 *   <script src="<basePath>/js/components.js"></script>
 *   <script>
 *     SiteComponents.injectHead({ basePath: '..', lang: 'en', ... });
 *     // ... page-specific body content ...
 *     SiteComponents.renderNavbar({ ... });
 *     SiteComponents.renderFooter({ ... });
 *   </script>
 */
var SiteComponents = (function () {
    'use strict';

    // ------------------------------------------------------------------
    // Site-wide contact & company info (single source of truth)
    // ------------------------------------------------------------------
    var SITE_CONFIG = {
        companyAddress: {
            zh: '香港新界屯门青杨街8号得利工业中心A座14楼08室',
            en: 'Unit 08, 14/F, Block A, Tak Lee Industrial Centre, 8 Tsing Yeung Street, Tuen Mun, New Territories, Hong Kong',
            kr: 'Unit 08, 14/F, Block A, Tak Lee Industrial Centre, 8 Tsing Yeung Street, Tuen Mun, New Territories, Hong Kong'
        },
        phone: '+86 1538744 6201',
        email: 'jeremyx3245@sina.com',
        wechatId: 'nuligongzuo32',
        copyrightYear: '2023',
        brandCount: 32
    };

    // ------------------------------------------------------------------
    // Per-language text bundles
    // ------------------------------------------------------------------
    var I18N = {
        zh: {
            companyName: '瑞途（香港）贸易有限公司',
            companyShort: '瑞途（香港）贸易有限公司',
            footerAbout: '专业美妆产品供应商，致力于为全球客户提供卓越的跨境美妆批发服务。',
            navHome: '首页',
            navAbout: '关于我们',
            navProducts: '产品和服务',
            navBusiness: '业务流程',
            navLogistics: '物流与仓储',
            navContact: '联系我们',
            contactUs: '联系我们',
            quickLinks: '快速链接',
            copyright: '保留所有权利.',
            privacyPolicy: '隐私政策',
            disclaimer: '免责声明',
            wechatLabel: '微信'
        },
        en: {
            companyName: 'Ruitu (Hong Kong) Trading Co., Ltd.',
            companyShort: 'Ruitu Trading Co., Ltd.',
            footerAbout: 'Professional beauty products supplier dedicated to providing excellent cross-border beauty wholesale services.',
            navHome: 'Home',
            navAbout: 'About Us',
            navProducts: 'Products & Services',
            navBusiness: 'Business Process',
            navLogistics: 'Logistics',
            navContact: 'Contact Us',
            contactUs: 'Contact Us',
            quickLinks: 'Quick Links',
            copyright: 'All rights reserved.',
            privacyPolicy: 'Privacy Policy',
            disclaimer: 'Disclaimer',
            wechatLabel: 'WeChat'
        },
        kr: {
            companyName: '루이투 (홍콩) 무역 유한회사',
            companyShort: '루이투 무역 유한회사',
            footerAbout: '글로벌 고객에게 우수한 국경간 뷰티 도매 서비스를 제공하는 전문 뷰티 제품 공급업체입니다.',
            navHome: '홈',
            navAbout: '회사 소개',
            navProducts: '제품 및 서비스',
            navBusiness: '비즈니스 프로세스',
            navLogistics: '물류 서비스',
            navContact: '문의하기',
            contactUs: '문의처',
            quickLinks: '빠른 링크',
            copyright: '모든 권리 보유.',
            privacyPolicy: '개인정보 정책',
            disclaimer: '면책 조항',
            wechatLabel: '위챗'
        }
    };

    // ------------------------------------------------------------------
    // Common <head> meta tags (everything before title / description)
    // ------------------------------------------------------------------
    function injectHeadMeta() {
        var metas = [
            '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0">',
            '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">',
            '<meta name="renderer" content="webkit">',
            '<meta name="format-detection" content="telephone=no">',
            '<meta name="apple-mobile-web-app-capable" content="yes">',
            '<meta name="apple-mobile-web-app-status-bar-style" content="black">',
            '<meta name="msapplication-tap-highlight" content="no">',
            '<meta name="HandheldFriendly" content="true">',
            '<meta name="mobile-web-app-capable" content="yes">',
            '<meta http-equiv="cleartype" content="on">',
            '<meta http-equiv="expires" content="0">',
            '<meta http-equiv="pragma" content="no-cache">',
            '<meta http-equiv="cache-control" content="no-cache">',
            '<meta name="theme-color" content="#ffffff">'
        ];
        document.head.insertAdjacentHTML('afterbegin', metas.join('\n'));
    }

    // ------------------------------------------------------------------
    // Common CSS & JS dependencies
    // ------------------------------------------------------------------
    function injectDependencies(basePath) {
        var bp = basePath || '.';
        var html = [
            '<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">',
            '<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">',
            '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">',
            '<link rel="stylesheet" href="' + bp + '/css/style.css">',
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" crossorigin="anonymous">',
            '<!--[if lt IE 9]>',
            '  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"><\/script>',
            '  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"><\/script>',
            '<![endif]-->'
        ];
        document.head.insertAdjacentHTML('beforeend', html.join('\n'));
    }

    // ------------------------------------------------------------------
    // Browser compatibility detection script (was duplicated in every <head>)
    // ------------------------------------------------------------------
    function detectBrowserCompat() {
        var supportsFlexbox = 'flexBasis' in document.documentElement.style ||
            'WebkitFlexBasis' in document.documentElement.style ||
            'MozFlexBasis' in document.documentElement.style ||
            'msFlexBasis' in document.documentElement.style;

        if (!supportsFlexbox) {
            document.documentElement.className += ' old-browser';
        }

        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        var isEdge = !isIE && !!window.StyleMedia;

        if (isIE || isEdge) {
            document.documentElement.className += ' ms-browser';
        }
    }

    // ------------------------------------------------------------------
    // Navbar renderer
    // ------------------------------------------------------------------

    /**
     * @param {Object} opts
     * @param {string} opts.lang       - 'zh' | 'en' | 'kr'
     * @param {string} opts.basePath   - relative path to repo root, e.g. '..' or '.'
     * @param {string} opts.containerId - id of the placeholder element (default 'navbar-container')
     * @param {boolean} opts.isSubpage  - true for pages/* (adds extra nav items)
     */
    function renderNavbar(opts) {
        var lang = opts.lang || 'zh';
        var bp = opts.basePath || '.';
        var t = I18N[lang];
        var containerId = opts.containerId || 'navbar-container';
        var isSubpage = opts.isSubpage || false;

        var homeHref, aboutHref, productsHref, businessHref, logisticsHref, contactHref;
        var zhHref, enHref, krHref;
        var logoAlt = t.companyName;

        if (isSubpage) {
            homeHref = bp + '/index.html';
            aboutHref = bp + '/index.html#about';
            productsHref = bp + '/index.html#products';
            businessHref = bp + '/index.html#business';
            logisticsHref = bp + '/index.html#logistics';
            contactHref = bp + '/index.html#contact';
        } else if (lang === 'zh') {
            homeHref = '#top';
            aboutHref = '#about';
            productsHref = '#products';
            businessHref = '#business';
            logisticsHref = '#logistics';
            contactHref = '#contact';
        } else {
            homeHref = '#top';
            aboutHref = '#about';
            productsHref = '#products';
            businessHref = '#business';
            logisticsHref = '#logistics';
            contactHref = '#contact';
        }

        if (lang === 'zh') {
            zhHref = isSubpage ? bp + '/index.html' : 'index.html';
            enHref = isSubpage ? bp + '/en/english.html' : 'en/english.html';
            krHref = isSubpage ? bp + '/kr/korean.html' : 'kr/korean.html';
        } else {
            zhHref = bp + '/index.html';
            enHref = lang === 'en' ? 'english.html' : bp + '/en/english.html';
            krHref = lang === 'kr' ? 'korean.html' : bp + '/kr/korean.html';
        }

        var navItems = '';
        navItems += '<li class="nav-item"><a class="nav-link" href="' + homeHref + '">' + t.navHome + '</a></li>';
        navItems += '<li class="nav-item"><a class="nav-link" href="' + aboutHref + '">' + t.navAbout + '</a></li>';

        if (!isSubpage || lang !== 'zh') {
            // Main pages and en/kr subpages: show products & contact
            if (lang === 'zh' && !isSubpage) {
                // Chinese main page only shows Home, About, Contact
                navItems += '<li class="nav-item"><a class="nav-link" href="' + contactHref + '">' + t.navContact + '</a></li>';
            } else if (isSubpage) {
                navItems += '<li class="nav-item"><a class="nav-link" href="' + productsHref + '">' + t.navProducts + '</a></li>';
                navItems += '<li class="nav-item"><a class="nav-link" href="' + businessHref + '">' + t.navBusiness + '</a></li>';
                navItems += '<li class="nav-item"><a class="nav-link" href="' + logisticsHref + '">' + t.navLogistics + '</a></li>';
                navItems += '<li class="nav-item"><a class="nav-link" href="' + contactHref + '">' + t.navContact + '</a></li>';
            } else {
                // en/kr main pages: Products + Contact
                navItems += '<li class="nav-item"><a class="nav-link" href="' + productsHref + '">' + t.navProducts + '</a></li>';
                navItems += '<li class="nav-item"><a class="nav-link" href="' + contactHref + '">' + t.navContact + '</a></li>';
            }
        } else {
            // Chinese subpages (pages/*): full nav
            navItems += '<li class="nav-item"><a class="nav-link" href="' + productsHref + '">' + t.navProducts + '</a></li>';
            navItems += '<li class="nav-item"><a class="nav-link" href="' + businessHref + '">' + t.navBusiness + '</a></li>';
            navItems += '<li class="nav-item"><a class="nav-link" href="' + logisticsHref + '">' + t.navLogistics + '</a></li>';
            navItems += '<li class="nav-item"><a class="nav-link" href="' + contactHref + '">' + t.navContact + '</a></li>';
        }

        // Language switcher - use flag images for main pages, text for subpages
        var langSwitcher;
        if (isSubpage) {
            langSwitcher =
                '<div class="d-flex"><ul class="navbar-nav">' +
                '<li class="nav-item d-flex align-items-center">' +
                '<a href="' + zhHref + '" data-lang="zh" class="nav-link px-2">中文</a>' +
                '<a href="' + enHref + '" data-lang="en" class="nav-link px-2">English</a>' +
                '<a href="' + krHref + '" data-lang="kr" class="nav-link px-2">한국어</a>' +
                '</li></ul></div>';
        } else {
            var flagBase = bp + '/images/flags/';
            langSwitcher =
                '<ul class="navbar-nav">' +
                '<li class="nav-item d-flex align-items-center">' +
                '<a href="' + zhHref + '" class="nav-link px-2" data-lang="zh"><img src="' + flagBase + 'cn.png" alt="中文" width="24" title="中文"></a>' +
                '<a href="' + enHref + '" class="nav-link px-2" data-lang="en"><img src="' + flagBase + 'en.png" alt="English" width="24" title="English"></a>' +
                '<a href="' + krHref + '" class="nav-link px-2" data-lang="kr"><img src="' + flagBase + 'kr.png" alt="한국어" width="24" title="한국어"></a>' +
                '</li></ul>';
        }

        var brandHref = isSubpage ? bp + '/index.html' : '#top';

        var html =
            '<nav class="navbar navbar-expand-lg navbar-light fixed-top">' +
            '<div class="container">' +
            '<a class="navbar-brand" href="' + brandHref + '">' +
            '<img src="' + bp + '/images/logo.png" alt="' + logoAlt + '" height="60">' +
            '</a>' +
            '<button class="navbar-toggler" type="button" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">' +
            '<span class="navbar-toggler-icon"></span></button>' +
            '<div class="collapse navbar-collapse" id="navbarNav">' +
            '<ul class="navbar-nav mx-auto">' + navItems + '</ul>' +
            langSwitcher +
            '</div></div></nav>';

        var container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        }
    }

    // ------------------------------------------------------------------
    // Footer renderer
    // ------------------------------------------------------------------

    /**
     * @param {Object} opts
     * @param {string} opts.lang       - 'zh' | 'en' | 'kr'
     * @param {string} opts.basePath   - relative path to repo root
     * @param {string} opts.containerId
     * @param {boolean} opts.isSubpage
     */
    function renderFooter(opts) {
        var lang = opts.lang || 'zh';
        var bp = opts.basePath || '.';
        var t = I18N[lang];
        var containerId = opts.containerId || 'footer-container';
        var isSubpage = opts.isSubpage || false;
        var c = SITE_CONFIG;

        var homeHref = isSubpage ? bp + '/index.html' : '#top';
        var aboutHref = isSubpage ? bp + '/index.html#about' : '#about';
        var productsHref = isSubpage ? bp + '/index.html#products' : '#products';
        var businessHref = isSubpage ? bp + '/index.html#business' : '#business';
        var logisticsHref = isSubpage ? bp + '/index.html#logistics' : '#logistics';
        var contactHref = isSubpage ? bp + '/index.html#contact' : '#contact';
        var privacyHref = isSubpage ? 'privacy.html' : (bp === '.' ? 'pages/privacy.html' : bp + '/pages/privacy.html');
        var disclaimerHref = isSubpage ? 'disclaimer.html' : (bp === '.' ? 'pages/disclaimer.html' : bp + '/pages/disclaimer.html');

        var address = c.companyAddress[lang] || c.companyAddress.en;
        var wechatLabel = t.wechatLabel;

        var html =
            '<footer class="footer">' +
            '<div class="container"><div class="row">' +
            '<div class="col-md-4 mb-3">' +
            '<div class="d-flex align-items-center mb-2">' +
            '<img src="' + bp + '/images/logo.png" alt="' + t.companyName + '" class="footer-logo me-2">' +
            '<h5 class="mb-0">' + t.companyShort + '</h5></div>' +
            '<p class="footer-about">' + t.footerAbout + '</p></div>' +

            '<div class="col-md-4 mb-3"><h5>' + t.contactUs + '</h5>' +
            '<ul class="list-unstyled footer-contact">' +
            '<li><i class="fas fa-map-marker-alt"></i> ' + address + '</li>' +
            '<li><i class="fas fa-phone"></i> ' + c.phone + '</li>' +
            '<li><i class="fas fa-envelope"></i> ' + c.email + '</li>' +
            '<li><i class="fab fa-weixin"></i> ' + wechatLabel + ': ' + c.wechatId + '</li>' +
            '</ul></div>' +

            '<div class="col-md-4"><h5>' + t.quickLinks + '</h5>' +
            '<div class="row"><div class="col-6"><ul class="list-unstyled">' +
            '<li><a href="' + homeHref + '">' + t.navHome + '</a></li>' +
            '<li><a href="' + aboutHref + '">' + t.navAbout + '</a></li>' +
            '<li><a href="' + productsHref + '">' + t.navProducts + '</a></li>' +
            '</ul></div><div class="col-6"><ul class="list-unstyled">' +
            '<li><a href="' + businessHref + '">' + t.navBusiness + '</a></li>' +
            '<li><a href="' + logisticsHref + '">' + t.navLogistics + '</a></li>' +
            '<li><a href="' + contactHref + '">' + t.navContact + '</a></li>' +
            '</ul></div></div></div>' +

            '</div>' +  // end row
            '<div class="footer-bottom"><div class="row align-items-center">' +
            '<div class="col-md-6 text-center text-md-start">' +
            '<p class="mb-0">&copy; ' + c.copyrightYear + ' ' + t.companyName + '. ' + t.copyright + '</p></div>' +
            '<div class="col-md-6"><div class="footer-links">' +
            '<a href="' + privacyHref + '">' + t.privacyPolicy + '</a>' +
            '<a href="' + disclaimerHref + '">' + t.disclaimer + '</a>' +
            '</div></div></div></div>' +

            '</div></footer>';

        var container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        }
    }

    // ------------------------------------------------------------------
    // Shared image modal (was duplicated 3× in main.js)
    // ------------------------------------------------------------------
    function ensureImageModal() {
        if (document.getElementById('imageModal')) {
            return document.getElementById('imageModal');
        }

        var modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'image-modal';
        modal.innerHTML =
            '<div class="image-modal-content">' +
            '<span class="image-modal-close">&times;</span>' +
            '<img class="image-modal-img">' +
            '<div class="image-modal-caption"></div>' +
            '</div>';
        document.body.appendChild(modal);

        function closeModal() {
            modal.classList.remove('show');
            setTimeout(function () {
                modal.style.display = 'none';
            }, 300);
        }

        modal.querySelector('.image-modal-close').addEventListener('click', closeModal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        return modal;
    }

    function openImageModal(src, captionHtml) {
        var modal = ensureImageModal();
        var modalImg = modal.querySelector('.image-modal-img');
        var modalCaption = modal.querySelector('.image-modal-caption');

        modal.style.display = 'flex';
        modalImg.src = src;
        if (modalCaption) {
            modalCaption.innerHTML = captionHtml || '';
        }

        setTimeout(function () {
            modal.classList.add('show');
        }, 10);
    }

    // ------------------------------------------------------------------
    // Brand wall renderer (duplicated across zh / en / kr pages)
    // ------------------------------------------------------------------
    function renderBrandWall(opts) {
        var bp = opts.basePath || '.';
        var lang = opts.lang || 'zh';
        var containerId = opts.containerId || 'brand-wall-container';
        var count = SITE_CONFIG.brandCount;

        var altPrefix = { zh: '品牌', en: 'Brand ', kr: '브랜드' };
        var prefix = altPrefix[lang] || altPrefix.en;

        var imgs = '';
        for (var i = 1; i <= count; i++) {
            imgs += '<img src="' + bp + '/images/brands/brand' + i + '.png" alt="' + prefix + i + '" class="brand-logo">';
        }

        var container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="brand-wall">' + imgs + '</div>';
        }
    }

    // ------------------------------------------------------------------
    // Form alert helper (success / error feedback with auto-dismiss)
    // ------------------------------------------------------------------
    function showFormAlert(container, type, messageHtml) {
        var icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        var cls = type === 'success' ? 'alert-success' : 'alert-danger';

        var div = document.createElement('div');
        div.className = 'alert ' + cls + ' mt-3 text-center';
        div.style.padding = '15px';
        div.innerHTML = '<i class="fas ' + icon + ' me-2"></i>' + messageHtml;

        container.appendChild(div);

        setTimeout(function () {
            div.style.transition = 'opacity 0.5s';
            div.style.opacity = '0';
            setTimeout(function () {
                div.remove();
            }, 500);
        }, 5000);
    }

    // ------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------
    return {
        SITE_CONFIG: SITE_CONFIG,
        I18N: I18N,
        injectHeadMeta: injectHeadMeta,
        injectDependencies: injectDependencies,
        detectBrowserCompat: detectBrowserCompat,
        renderNavbar: renderNavbar,
        renderFooter: renderFooter,
        ensureImageModal: ensureImageModal,
        openImageModal: openImageModal,
        renderBrandWall: renderBrandWall,
        showFormAlert: showFormAlert
    };
})();
