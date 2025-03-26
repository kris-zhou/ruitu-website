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
    
    // 检测浏览器和设备
    var isIE = !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isAndroid = /(android)/i.test(navigator.userAgent);
    
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
        
        // 针对Safari的特殊修复
        if (isSafari || isIOS) {
            var styleElement = document.createElement('style');
            styleElement.textContent = `
                .navbar { background-color: rgba(255, 255, 255, 0.98) !important; }
                .carousel-caption { background-color: rgba(0, 0, 0, 0.7) !important; }
            `;
            document.head.appendChild(styleElement);
        }
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    // 初始化轮播图
    const mainCarousel = document.getElementById('mainCarousel');
    new bootstrap.Carousel(mainCarousel, {
        interval: 3500,
        ride: true,
        wrap: true
    });

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
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

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
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
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
                const modalImg = modal.querySelector('.image-modal-img');
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
                const modalImg = modal.querySelector('.image-modal-img');
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
                const image = item.querySelector('img');
                const title = item.querySelector('.authenticity-title').textContent;
                const id = item.querySelector('.authenticity-id').textContent;
                const date = item.querySelector('.authenticity-date').textContent;
                
                const modal = document.getElementById('imageModal');
                const modalImg = modal.querySelector('.image-modal-img');
                const modalCaption = modal.querySelector('.image-modal-caption');
                
                modal.style.display = 'flex';
                modalImg.src = image.src;
                modalCaption.innerHTML = `<strong>${title}</strong><br>${id}<br>${date}`;
                
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
                // 中文版本 - 回到主目录
                targetUrl = baseUrl + 'index.html';
            } else {
                // 英文或韩文版本 - 进入对应语言子目录
                targetUrl = baseUrl + lang + '/index.html';
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
                    const step = parseInt(entry.target.getAttribute('data-step'));
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
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            
            // 创建FormData对象
            const formData = new FormData(form);
            
            // 添加额外的参数，确保FormSubmit处理正确
            formData.append('_captcha', 'false');
            
            // 移除_next参数，阻止页面跳转
            for (let pair of formData.entries()) {
                if (pair[0] === '_next') {
                    formData.delete('_next');
                }
            }
            
            // 发送AJAX请求
            fetch('https://formsubmit.co/ajax/' + form.getAttribute('action').split('/').pop(), {
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
                return response.json();
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
