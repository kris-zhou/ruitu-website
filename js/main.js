document.addEventListener('DOMContentLoaded', function() {
    // 初始化轮播图
    const mainCarousel = document.getElementById('mainCarousel');
    new bootstrap.Carousel(mainCarousel, {
        interval: 3500,
        ride: true,
        wrap: true
    });

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
});
