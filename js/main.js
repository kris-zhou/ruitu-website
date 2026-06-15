// 浏览器兼容性和polyfill检测
(function() {
    // Object.assign polyfill
    if (typeof Object.assign !== 'function') {
        Object.assign = function(target) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            
            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }
    
    // forEach polyfill
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
    
    // Element.matches polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches = 
            Element.prototype.msMatchesSelector || 
            Element.prototype.webkitMatchesSelector;
    }
    
    // Element.closest polyfill
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            do {
                if (Element.prototype.matches.call(el, s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }
    
    // requestAnimationFrame polyfill
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(function() {
                callback(Date.now());
            }, 1000 / 60);
        };
    }
    
    // cancelAnimationFrame polyfill
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
    
    // 检测浏览器和设备
    var isIE = !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isAndroid = /(android)/i.test(navigator.userAgent);
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 为特定浏览器添加CSS类
    document.addEventListener('DOMContentLoaded', function() {
        var htmlElement = document.documentElement;
        
        if (isIE) htmlElement.classList.add('is-ie');
        if (isEdge) htmlElement.classList.add('is-edge');
        if (isChrome) htmlElement.classList.add('is-chrome');
        if (isFirefox) htmlElement.classList.add('is-firefox');
        if (isSafari) htmlElement.classList.add('is-safari');
        if (isIOS) htmlElement.classList.add('is-ios');
        if (isAndroid) htmlElement.classList.add('is-android');
        if (isMobile) htmlElement.classList.add('is-mobile');
        
        // 设置CSS变量以修复iOS中的视口高度问题
        function updateViewportHeight() {
            var vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
        }
        
        // 初始设置
        updateViewportHeight();
        
        // 在窗口调整大小或设备方向更改时更新
        window.addEventListener('resize', updateViewportHeight);
        window.addEventListener('orientationchange', updateViewportHeight);
        
        // 针对Safari和iOS的特殊修复
        if (isSafari || isIOS) {
            var styleElement = document.createElement('style');
            styleElement.textContent = `
                .navbar { background-color: rgba(255, 255, 255, 0.98) !important; }
                .carousel-caption { background-color: rgba(0, 0, 0, 0.7) !important; }
                
                /* 修复iOS表单元素的问题 */
                input, textarea, select, button {
                    -webkit-appearance: none;
                    border-radius: 0;
                }
                
                /* 修复iOS中的悬停效果 */
                a:hover, button:hover {
                    opacity: 1 !important;
                }
                
                /* 修复iOS中的滚动问题 */
                .timeline-container, .scrollable-content {
                    -webkit-overflow-scrolling: touch;
                }
            `;
            document.head.appendChild(styleElement);
        }
        
        // 针对IE的特殊修复
        if (isIE) {
            var ieStyleElement = document.createElement('style');
            ieStyleElement.textContent = `
                /* 修复IE中的Flexbox问题 */
                .d-flex, .flex-container {
                    display: block;
                }
                
                .d-flex > *, .flex-container > * {
                    float: left;
                }
                
                /* 修复IE中的栅格问题 */
                .col-md-6 {
                    width: 50%;
                    float: left;
                }
                
                .col-md-4 {
                    width: 33.333%;
                    float: left;
                }
                
                .col-md-3 {
                    width: 25%;
                    float: left;
                }
                
                /* 清除浮动 */
                .row::after {
                    content: "";
                    display: table;
                    clear: both;
                }
                
                /* 修复IE中的图像问题 */
                img {
                    width: auto;
                    height: auto;
                }
            `;
            document.head.appendChild(ieStyleElement);
            
            // 针对IE的JS修复
            var flexElements = document.querySelectorAll('.d-flex, .flex-container');
            flexElements.forEach(function(elem) {
                var children = elem.children;
                for (var i = 0; i < children.length; i++) {
                    if (getComputedStyle(children[i]).flex === '1') {
                        children[i].style.width = (100 / children.length) + '%';
                    }
                }
            });
        }
        
        // 针对移动设备的特殊修复
        if (isMobile) {
            // 禁用某些悬停效果，替换为轻触事件
            document.querySelectorAll('.hover-effect').forEach(function(elem) {
                elem.addEventListener('touchstart', function() {
                    this.classList.add('touch-hover');
                });
                
                elem.addEventListener('touchend', function() {
                    var element = this;
                    setTimeout(function() {
                        element.classList.remove('touch-hover');
                    }, 300);
                });
            });
            
            // 修复移动设备上的点击延迟
            // FastClick.attach(document.body);
            document.addEventListener('touchstart', function(){}, {passive: true});
        }
    });
})();

// 响应式增强功能
(function() {
    // 节流函数 - 限制高频率事件执行
    function throttle(func, limit) {
        var lastFunc, lastRan;
        return function() {
            var context = this;
            var args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
    
    // 防抖函数 - 合并多次触发为一次
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        // 响应式表格处理
        document.querySelectorAll('table:not(.table-responsive)').forEach(function(table) {
            if (!table.closest('.table-responsive')) {
                var wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
        
        // 响应式视频处理
        document.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"]').forEach(function(iframe) {
            if (!iframe.closest('.responsive-video')) {
                var wrapper = document.createElement('div');
                wrapper.className = 'responsive-video';
                iframe.parentNode.insertBefore(wrapper, iframe);
                wrapper.appendChild(iframe);
            }
        });
        
        // 图片加载错误处理
        document.querySelectorAll('img').forEach(function(img) {
            img.addEventListener('error', function() {
                if (this.dataset.errorHandled) return;
                this.dataset.errorHandled = 'true';
                this.src = 'images/placeholder.png';
                this.classList.add('img-error');
            });
        });
        
        // 使用IntersectionObserver进行图片懒加载
        if ('IntersectionObserver' in window) {
            var lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var lazyImage = entry.target;
                        var src = lazyImage.dataset.src;
                        
                        if (src) {
                            lazyImage.src = src;
                            lazyImage.classList.add('loaded');
                            lazyImage.classList.remove('lazy');
                            lazyImageObserver.unobserve(lazyImage);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img.lazy').forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // 回退到简单的滚动监听
            function lazyLoad() {
                var lazyImages = document.querySelectorAll('img.lazy');
                var scrollTop = window.pageYOffset;
                
                lazyImages.forEach(function(img) {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        var src = img.dataset.src;
                        
                        if (src) {
                            img.src = src;
                            img.classList.add('loaded');
                            img.classList.remove('lazy');
                        }
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoadThrottled);
                    window.removeEventListener('resize', lazyLoadThrottled);
                    window.removeEventListener('orientationchange', lazyLoadThrottled);
                }
            }
            
            var lazyLoadThrottled = throttle(lazyLoad, 200);
            
            document.addEventListener('scroll', lazyLoadThrottled);
            window.addEventListener('resize', lazyLoadThrottled);
            window.addEventListener('orientationchange', lazyLoadThrottled);
            
            // 初始加载
            lazyLoad();
        }
        
        // 平滑滚动增强
        if ('scrollBehavior' in document.documentElement.style) {
            // 浏览器原生支持平滑滚动
            document.documentElement.style.scrollBehavior = 'smooth';
        } else {
            // 添加平滑滚动的polyfill
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    var targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    var targetElement = document.querySelector(targetId);
                    if (!targetElement) return;
                    
                    var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    var startPosition = window.pageYOffset;
                    var distance = targetPosition - startPosition - 80; // 考虑导航栏的高度
                    var startTime = null;
                    var duration = 500; // 滚动持续时间，毫秒
                    
                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        var timeElapsed = currentTime - startTime;
                        var progress = Math.min(timeElapsed / duration, 1);
                        var ease = function(t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }; // 缓动函数
                        window.scrollTo(0, startPosition + distance * ease(progress));
                        
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        }
                    }
                    
                    requestAnimationFrame(animation);
                });
            });
        }
    });
    
    // 响应式处理函数
    function handleResponsive() {
        // 动态调整基于视口高度的元素
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // 响应式调整功能可以在这里添加
    }
    
    // 页面加载和调整大小时应用响应式处理
    window.addEventListener('load', handleResponsive);
    window.addEventListener('resize', throttle(handleResponsive, 100));
    window.addEventListener('orientationchange', handleResponsive);
})();

document.addEventListener('DOMContentLoaded', function() {
    // 初始化轮播图
    const mainCarousel = document.getElementById('mainCarousel');
    if (mainCarousel) {
        new bootstrap.Carousel(mainCarousel, {
            interval: 3500,
            ride: true,
            wrap: true
        });
    }

    // 修复汉堡按钮问题 - 完全重写处理逻辑
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // 替换Bootstrap的默认行为，手动控制折叠/展开
        navbarToggler.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            navbarCollapse.classList.toggle('show');
        });
        
        // 点击导航链接时关闭菜单
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) { // 只在移动视图下执行
                    navbarCollapse.classList.remove('show');
                }
            });
        });
        
        // 点击页面其他地方时关闭菜单
        document.addEventListener('click', function(e) {
            if (navbarCollapse.classList.contains('show') && !navbarCollapse.contains(e.target) && e.target !== navbarToggler) {
                navbarCollapse.classList.remove('show');
            }
        });
    }

    // 监听滚动事件
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // 环境展示部分的滚动动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const environmentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 当元素进入视口
            if (entry.isIntersecting) {
                entry.target.classList.add('environment-animate');
            } else {
                // 当元素离开视口
                entry.target.classList.remove('environment-animate');
            }
        });
    }, observerOptions);

    // 监听环境展示卡片
    document.querySelectorAll('.environment-item').forEach(item => {
        item.classList.add('environment-initial');
        environmentObserver.observe(item);
    });

    // 监听环境展示标题和描述
    const environmentTitle = document.querySelector('.company-environment .section-title');
    const environmentDesc = document.querySelector('.company-environment .lead');
    if (environmentTitle) {
        environmentTitle.classList.add('title-initial');
        environmentObserver.observe(environmentTitle);
    }
    if (environmentDesc) {
        environmentDesc.classList.add('desc-initial');
        environmentObserver.observe(environmentDesc);
    }

    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            if (!href || href === '#') return;
            try {
                var target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            } catch (err) {
                // invalid selector in href
            }
        });
    });

    // 正品保证图片随机排列与点击放大功能
    const galleryItems = document.querySelectorAll('.authenticity-gallery .authenticity-item');
    if (galleryItems.length > 0) {
        const gallery = document.querySelector('.authenticity-gallery');
        
        // 设置随机属性
        galleryItems.forEach((item, index) => {
            // 为每个项目设置随机变量
            item.style.setProperty('--random', Math.random().toFixed(2));
            
            // 随机缩放和旋转
            const randomRotate = Math.random() * 4 - 2;
            item.style.transform = `rotate(${randomRotate}deg)`;
            
            // 添加随机阴影
            const randomShadowBlur = 15 + Math.floor(Math.random() * 10);
            const randomShadowOpacity = 0.1 + Math.random() * 0.1;
            item.style.boxShadow = `0 ${randomShadowBlur}px 25px rgba(200, 142, 167, ${randomShadowOpacity})`;
            
            // 添加随机动画延迟
            item.style.animationDelay = `${index * 0.1}s`;
            
            // 添加点击事件，点击图片时在模态框中显示原始大小
            const image = item.querySelector('img');
            item.addEventListener('click', function() {
                const modal = document.getElementById('imageModal');
                if (!modal || !image) return;
                const modalImg = modal.querySelector('.image-modal-img');
                if (!modalImg) return;
                modal.style.display = 'flex';
                modalImg.src = image.src;
                
                // 确保DOM更新后再添加show类
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
            });
        });
        
        // 处理鼠标悬停效果
        galleryItems.forEach(item => {
            const image = item.querySelector('img');
            const inner = item.querySelector('.authenticity-item-inner');
            
            // 记录原始图片尺寸以便放大时使用
            image.addEventListener('load', function() {
                const naturalWidth = this.naturalWidth;
                const naturalHeight = this.naturalHeight;
                item.setAttribute('data-natural-width', naturalWidth);
                item.setAttribute('data-natural-height', naturalHeight);
            });
            
            item.addEventListener('mouseenter', function() {
                // 减小其他项目的不透明度
                galleryItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.style.opacity = '0.7';
                        otherItem.style.filter = 'blur(2px)';
                        otherItem.style.transform = 'scale(0.95) rotate(0deg)';
                    }
                });
                
                // 确保悬停的图片能显示得更清楚
                item.style.zIndex = '30';
            });
            
            item.addEventListener('mouseleave', function() {
                // 恢复所有项目的样式
                galleryItems.forEach(otherItem => {
                    otherItem.style.opacity = '1';
                    otherItem.style.filter = 'none';
                    
                    // 恢复随机旋转
                    const randomVar = otherItem.style.getPropertyValue('--random') || 0.5;
                    const randomRotate = (randomVar * 3 - 1.5);
                    otherItem.style.transform = `rotate(${randomRotate}deg)`;
                });
                
                // 重置z-index
                setTimeout(() => {
                    item.style.zIndex = '1';
                }, 300);
            });
        });
        
        // 确保模态框存在
        if (!document.getElementById('imageModal')) {
            const modal = document.createElement('div');
            modal.id = 'imageModal';
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="image-modal-content">
                    <span class="image-modal-close">&times;</span>
                    <img class="image-modal-img">
                </div>
            `;
            document.body.appendChild(modal);
            
            // 关闭模态框
            modal.querySelector('.image-modal-close').addEventListener('click', function() {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
            
            // 点击模态框外部关闭
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                }
            });
        }
    }
    
    // 产品图片点击放大功能
    const productImages = document.querySelectorAll('.uno img');
    if (productImages.length > 0) {
        // 创建模态框容器
        if (!document.getElementById('imageModal')) {
            const modal = document.createElement('div');
            modal.id = 'imageModal';
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="image-modal-content">
                    <span class="image-modal-close">&times;</span>
                    <img class="image-modal-img">
                </div>
            `;
            document.body.appendChild(modal);
            
            // 关闭模态框
            modal.querySelector('.image-modal-close').addEventListener('click', function() {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
            
            // 点击模态框外部关闭
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                }
            });
        }
        
        // 为每个产品图片添加点击事件
        productImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function() {
                const modal = document.getElementById('imageModal');
                if (!modal) return;
                const modalImg = modal.querySelector('.image-modal-img');
                if (!modalImg) return;
                modal.style.display = 'flex';
                modalImg.src = this.src;
                
                // 确保DOM更新后再添加show类
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
            });
        });
    }
    
    // 正品保证文档查看功能
    const authenticityViewButtons = document.querySelectorAll('.authenticity-view');
    const authenticityImages = document.querySelectorAll('.authenticity-img-container img');
    
    if (authenticityViewButtons.length > 0) {
        // 确保模态框存在
        if (!document.getElementById('imageModal')) {
            const modal = document.createElement('div');
            modal.id = 'imageModal';
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="image-modal-content">
                    <span class="image-modal-close">&times;</span>
                    <img class="image-modal-img">
                    <div class="image-modal-caption"></div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // 关闭模态框
            modal.querySelector('.image-modal-close').addEventListener('click', function() {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
            
            // 点击模态框外部关闭
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                }
            });
        }
        
        // 为查看按钮添加点击事件
        authenticityViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.authenticity-item');
                if (!item) return;
                const image = item.querySelector('img');
                const titleEl = item.querySelector('.authenticity-title');
                const idEl = item.querySelector('.authenticity-id');
                const dateEl = item.querySelector('.authenticity-date');
                const title = titleEl ? titleEl.textContent : '';
                const id = idEl ? idEl.textContent : '';
                const date = dateEl ? dateEl.textContent : '';
                
                const modal = document.getElementById('imageModal');
                if (!modal) return;
                const modalImg = modal.querySelector('.image-modal-img');
                const modalCaption = modal.querySelector('.image-modal-caption');
                if (!modalImg) return;
                
                modal.style.display = 'flex';
                modalImg.src = image ? image.src : '';
                if (modalCaption) {
                    modalCaption.innerHTML = `<strong>${title}</strong><br>${id}<br>${date}`;
                }
                
                // 确保DOM更新后再添加show类
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
            });
        });
        
        // 为图片添加点击事件
        authenticityImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function() {
                const item = this.closest('.authenticity-item');
                if (!item) return;
                const viewButton = item.querySelector('.authenticity-view');
                if (viewButton) {
                    viewButton.click();
                }
            });
        });
    }
    
    // 添加专业化表格的交互效果
    const authenticityItems = document.querySelectorAll('.authenticity-item');
    if (authenticityItems.length > 0) {
        authenticityItems.forEach(item => {
            // 悬停效果
            item.addEventListener('mouseenter', function() {
                const status = this.querySelector('.authenticity-status');
                if (status) {
                    status.style.transform = 'scale(1.05)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const status = this.querySelector('.authenticity-status');
                if (status) {
                    status.style.transform = 'scale(1)';
                }
            });
        });
    }

    // 语言切换功能
    const languageLinks = document.querySelectorAll('[data-lang]');
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认行为
            const lang = this.getAttribute('data-lang');
            const currentPath = window.location.pathname;
            
            // 获取基础URL（不包含语言部分）
            let baseUrl = '';
            const pathSegments = currentPath.split('/');
            
            // 如果当前在语言子目录中（en/ 或 kr/）
            if (pathSegments.some(segment => segment === 'en' || segment === 'kr')) {
                // 当前在语言子目录，需要上移一级
                baseUrl = '../';
            }
            
            // 根据选择的语言确定目标URL
            let targetUrl;
            if (lang === 'zh') {
                targetUrl = baseUrl + 'index.html';
            } else if (lang === 'en') {
                targetUrl = baseUrl + 'en/english.html';
            } else if (lang === 'kr') {
                targetUrl = baseUrl + 'kr/korean.html';
            }
            
            // 跳转到目标URL
            window.location.href = targetUrl;
        });
    });

    // 添加回到顶部按钮
    // 创建回到顶部按钮元素
    const backToTopBtn = document.createElement("a");
    backToTopBtn.id = "backToTop";
    backToTopBtn.className = "back-to-top";
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    // 监听滚动事件，控制按钮显示和隐藏
    window.addEventListener("scroll", function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });
    
    // 点击事件 - 回到顶部
    backToTopBtn.addEventListener("click", function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 添加业务流程六边形的动画效果
    const businessProcess = document.querySelector('.business-process');
    if (businessProcess) {
        const hexagonWrappers = document.querySelectorAll('.hexagon-wrapper');
        const hexagonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 获取当前六边形的步骤编号
                    const step = parseInt(entry.target.getAttribute('data-step')) || 1;
                    // 添加延迟动画效果，使六边形按顺序显示
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, (step - 1) * 200);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        });

        // 为每个六边形添加初始样式和观察
        hexagonWrappers.forEach(hexagon => {
            hexagon.style.opacity = '0';
            hexagon.style.transform = hexagon.style.transform + ' translateY(30px)';
            hexagon.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            hexagonObserver.observe(hexagon);
        });

        // 添加CSS类以实现动画效果
        const style = document.createElement('style');
        style.innerHTML = `
            .hexagon-wrapper.animate {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .hexagon-wrapper:nth-child(3n+1).animate {
                transform: translateY(0) !important;
            }
            
            .hexagon-wrapper:nth-child(3n+2).animate {
                transform: translateY(52px) !important;
            }
            
            .hexagon-wrapper:nth-child(3n+3).animate {
                transform: translateY(0) !important;
            }
            
            @media (max-width: 991px) {
                .hexagon-wrapper:nth-child(2n+1).animate {
                    transform: translateY(0) !important;
                }
                
                .hexagon-wrapper:nth-child(2n+2).animate {
                    transform: translateY(52px) !important;
                }
            }
            
            @media (max-width: 767px) {
                .hexagon-wrapper.animate {
                    transform: translateY(0) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 表单提交处理
    // 获取所有FormSubmit表单
    const forms = document.querySelectorAll('form[action^="https://formsubmit.co"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // 阻止表单默认提交行为
            e.preventDefault();
            
            // 显示加载状态
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            
            // 创建FormData对象
            const formData = new FormData(form);
            
            // 移除可能导致问题的字段
            formData.delete('_next');
            
            // 确保关闭验证码
            formData.set('_captcha', 'false');
            
            // 添加额外的参数，优化邮件格式
            formData.set('_template', 'table'); // 使用表格模板
            formData.set('_autoresponse', '感谢您的留言，我们已收到您的表单提交，将尽快与您联系。'); // 设置自动回复
            
            // 处理表单数据，确保格式正确，避免导致邮件刷新的内容
            const formEntries = Array.from(formData.entries());
            const formObject = {};
            
            formEntries.forEach(entry => {
                // 跳过FormSubmit特殊字段
                if (!entry[0].startsWith('_')) {
                    // 净化内容，避免HTML和JS内容
                    let value = entry[1];
                    if (typeof value === 'string') {
                        // 转义HTML标签
                        value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    }
                    formObject[entry[0]] = value;
                }
            });
            
            // 添加时间戳，避免缓存问题
            formObject.timestamp = new Date().toISOString();
            
            // 转换为URL编码格式
            const jsonData = JSON.stringify(formObject);
            formData.set('_data', jsonData);
            
            // 使用FormSubmit的AJAX API直接提交
            fetch(form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/'), {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络错误，请稍后再试');
                }
                return response.json().catch(function() {
                    return {};
                });
            })
            .then(data => {
                console.log('表单提交成功:', data);
                
                // 清空表单
                form.reset();
                
                // 创建成功消息容器
                const successDiv = document.createElement('div');
                successDiv.className = 'alert alert-success mt-3 text-center';
                successDiv.style.padding = '15px';
                successDiv.innerHTML = `
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>谢谢！</strong> 您的表单已成功提交。我们会尽快与您联系。
                `;
                
                // 将成功消息插入表单后
                form.appendChild(successDiv);
                
                // 恢复按钮状态
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // 5秒后移除成功消息
                setTimeout(() => {
                    successDiv.style.transition = 'opacity 0.5s';
                    successDiv.style.opacity = '0';
                    setTimeout(() => {
                        successDiv.remove();
                    }, 500);
                }, 5000);
            })
            .catch(error => {
                console.error('表单提交错误:', error);
                
                // 创建错误消息容器
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger mt-3 text-center';
                errorDiv.style.padding = '15px';
                errorDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle me-2"></i>
                    <strong>提交失败</strong> ${error.message}
                `;
                
                // 将错误消息插入表单后
                form.appendChild(errorDiv);
                
                // 恢复按钮状态
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // 5秒后移除错误消息
                setTimeout(() => {
                    errorDiv.style.transition = 'opacity 0.5s';
                    errorDiv.style.opacity = '0';
                    setTimeout(() => {
                        errorDiv.remove();
                    }, 500);
                }, 5000);
            });
        });
    });

    // 处理展会时间轴
    const timelineContainer = document.querySelector('.timeline-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const filterBtns = document.querySelectorAll('.timeline-controls button[data-filter]');
    const exhibitionCards = document.querySelectorAll('.exhibition-card');
    
    if (!timelineContainer || !prevBtn || !nextBtn) return;
    
    // 初始化滚动位置
    let scrollPosition = 0;
    const cardWidth = 370; // 卡片宽度 + 间距
    
    // 滚动到下一个卡片
    nextBtn.addEventListener('click', function() {
        scrollPosition = Math.min(scrollPosition + cardWidth, timelineContainer.scrollWidth - timelineContainer.clientWidth);
        timelineContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    });
    
    // 滚动到上一个卡片
    prevBtn.addEventListener('click', function() {
        scrollPosition = Math.max(scrollPosition - cardWidth, 0);
        timelineContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    });
    
    // 监听滚动事件，更新滚动位置
    timelineContainer.addEventListener('scroll', function() {
        scrollPosition = timelineContainer.scrollLeft;
        
        // 更新按钮状态
        prevBtn.disabled = scrollPosition <= 0;
        nextBtn.disabled = scrollPosition >= timelineContainer.scrollWidth - timelineContainer.clientWidth;
    });
    
    // 初始化按钮状态
    prevBtn.disabled = true;
    nextBtn.disabled = timelineContainer.scrollWidth <= timelineContainer.clientWidth;
    
    // 处理筛选功能
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的激活状态
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的激活状态
            this.classList.add('active');
            
            // 获取筛选类型
            const filter = this.getAttribute('data-filter');
            
            // 应用筛选
            exhibitionCards.forEach(card => {
                if (filter === 'all') {
                    card.classList.remove('filtered');
                } else {
                    if (card.classList.contains(filter)) {
                        card.classList.remove('filtered');
                    } else {
                        card.classList.add('filtered');
                    }
                }
            });
            
            // 重置滚动位置
            scrollPosition = 0;
            timelineContainer.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // 计算剩余天数
    exhibitionCards.forEach(card => {
        if (card.classList.contains('upcoming')) {
            const dateStr = card.getAttribute('data-date');
            const eventDate = new Date(dateStr);
            const today = new Date();
            
            // 计算剩余天数
            const diffTime = eventDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // 更新剩余天数显示
            const daysLeft = card.querySelector('.badge.bg-secondary');
            if (daysLeft) {
                daysLeft.textContent = `剩余: ${diffDays}天`;
            }
        }
    });
});

// 最近更新: 优化表单提交和邮件通知 - 2023年3月25日
