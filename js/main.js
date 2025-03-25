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

    // 处理联系表单提交
    const contactForms = document.querySelectorAll('form[data-netlify="true"]');
    contactForms.forEach(form => {
        // 确保表单包含隐藏的表单名称字段
        if (!form.querySelector('input[name="form-name"]')) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'form-name';
            hiddenInput.value = form.getAttribute('name');
            form.appendChild(hiddenInput);
        }
        
        form.addEventListener('submit', function(e) {
            if (form.checkValidity()) {
                e.preventDefault();

                // 显示加载状态
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 提交中...';
                }
                
                // 创建表单数据对象
                const formData = new FormData(form);
                
                // 添加Netlify所需的表单名称字段
                formData.append("form-name", form.getAttribute("name"));

                // 通过fetch API提交表单
                // 使用相对于当前站点根目录的提交URL
                // 如果NetlifyURLs自动重定向可能导致404，改用表单本身的action属性或默认/
                const formAction = form.getAttribute('action') || '/.netlify/functions/submission-created';
                
                fetch(formAction, {
                    method: 'POST',
                    headers: { 
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams(formData).toString()
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response;
                })
                .then(() => {
                    // 创建成功提示
                    const successAlert = document.createElement('div');
                    successAlert.className = 'alert alert-success mt-3 mb-0';
                    successAlert.innerHTML = `
                        <i class="fas fa-check-circle me-2"></i>
                        ${form.getAttribute('name').includes('zh') ? '消息已成功发送！我们将尽快与您联系。' : 
                          form.getAttribute('name').includes('en') ? 'Message sent successfully! We will contact you soon.' : 
                          '메시지가 성공적으로 전송되었습니다! 곧 연락 드리겠습니다.'}
                    `;
                    
                    // 插入成功提示
                    form.reset();
                    form.appendChild(successAlert);
                    
                    // 3秒后恢复按钮状态
                    setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnContent;
                        }
                        
                        // 5秒后移除成功提示
                        setTimeout(() => {
                            successAlert.remove();
                        }, 5000);
                    }, 3000);
                })
                .catch(error => {
                    // 处理错误
                    console.error('表单提交错误:', error);
                    
                    // 创建错误提示
                    const errorAlert = document.createElement('div');
                    errorAlert.className = 'alert alert-danger mt-3 mb-0';
                    errorAlert.innerHTML = `
                        <i class="fas fa-exclamation-circle me-2"></i>
                        ${form.getAttribute('name').includes('zh') ? '抱歉，提交失败。请稍后再试或直接联系我们。' : 
                          form.getAttribute('name').includes('en') ? 'Sorry, submission failed. Please try again later or contact us directly.' : 
                          '죄송합니다. 제출에 실패했습니다. 나중에 다시 시도하거나 직접 문의해 주세요.'}
                    `;
                    
                    // 插入错误提示
                    form.appendChild(errorAlert);
                    
                    // 恢复按钮状态
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnContent;
                    }
                    
                    // 5秒后移除错误提示
                    setTimeout(() => {
                        errorAlert.remove();
                    }, 5000);
                });
            }
        });
    });
});
