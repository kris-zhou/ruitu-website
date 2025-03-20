/**
 * 导航栏移动端修复脚本 v3.0
 * 解决移动端导航栏菜单不能收起的问题
 */
document.addEventListener('DOMContentLoaded', function() {
    // 简单直接的解决方案
    
    // 1. 处理汉堡按钮点击
    var toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
        toggler.onclick = function(e) {
            var target = document.querySelector('.navbar-collapse');
            if (target) {
                if (target.classList.contains('show')) {
                    target.classList.remove('show');
                } else {
                    target.classList.add('show');
                }
            }
        };
    }
    
    // 2. 处理导航链接点击
    var links = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav [data-lang]');
    links.forEach(function(link) {
        link.onclick = function() {
            var target = document.querySelector('.navbar-collapse');
            if (target && target.classList.contains('show')) {
                target.classList.remove('show');
            }
        };
    });
    
    // 3. 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        var navbar = document.querySelector('.navbar');
        var toggler = document.querySelector('.navbar-toggler');
        var target = document.querySelector('.navbar-collapse');
        
        if (target && target.classList.contains('show') && 
            navbar && !navbar.contains(e.target) && 
            toggler && !toggler.contains(e.target)) {
            target.classList.remove('show');
        }
    });
}); 