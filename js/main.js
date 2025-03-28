document.addEventListener('DOMContentLoaded', function () {
    // 导航菜单功能
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // 移动端菜单切换
    menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    // 点击导航链接关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');

            // 更新当前活动链接
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 作品筛选功能
    const filterBtns = document.querySelectorAll('.filter-btn');
    const academicItems = document.querySelectorAll('#academic .portfolio-item'); // 只选择学校作品

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // 更新活动按钮样式
            filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            academicItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 模态框功能
    const modal = document.getElementById('portfolio-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalDescription = document.getElementById('modal-description');
    const modalMainImage = document.getElementById('modal-main-image');
    const modalThumbnails = document.getElementById('modal-thumbnails');
    const modalToolsList = document.getElementById('modal-tools-list');
    const closeModal = document.querySelector('.close-modal');
    const portfolioLinks = document.querySelectorAll('.portfolio-link');

    // 打开模态框
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-id');
            const project = portfolioData[projectId];

            if (project) {
                // 设置项目信息
                modalTitle.textContent = project.title;
                modalCategory.textContent = project.category;
                modalDescription.innerHTML = `<p>${project.description}</p>`;

                // 设置主图片
                modalMainImage.src = project.images[0];
                modalMainImage.alt = project.title;

                // 清空并添加缩略图
                modalThumbnails.innerHTML = '';
                project.images.forEach((image, index) => {
                    const thumbnail = document.createElement('div');
                    thumbnail.className = index === 0 ? 'thumbnail active' : 'thumbnail';
                    thumbnail.innerHTML = `<img src="${image}" alt="${project.title} - 图片 ${index + 1}">`;

                    thumbnail.addEventListener('click', function () {
                        // 更新主图
                        modalMainImage.src = image;

                        // 更新活动缩略图
                        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                        this.classList.add('active');
                    });

                    modalThumbnails.appendChild(thumbnail);
                });

                // 清空并添加工具标签
                modalToolsList.innerHTML = '';
                project.tools.forEach(tool => {
                    const toolTag = document.createElement('span');
                    toolTag.className = 'tool-tag';
                    toolTag.textContent = tool;
                    modalToolsList.appendChild(toolTag);
                });

                // 显示模态框
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // 防止背景滚动
            }
        });
    });

    // 关闭模态框
    closeModal.addEventListener('click', function () {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // 滚动到顶部按钮
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top-btn');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 页面加载动画
    const loader = document.createElement('div');
    loader.classList.add('page-loader');
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);

    // 页面加载完成后隐藏加载动画
    window.addEventListener('load', function () {
        setTimeout(function () {
            loader.style.opacity = '0';
            setTimeout(function () {
                loader.style.display = 'none';
            }, 500);
        }, 800);
    });

    // 添加滚动动画
    const animateElements = document.querySelectorAll('.about-content, .portfolio-item, .contact-content');

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        element.classList.add('animate-element');
        observer.observe(element);
    });

    // 实习作品查看更多功能
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const internshipScroll = document.querySelector('.internship-scroll');
    const internshipContainer = document.getElementById('internship-container');
    const loadingIndicator = document.getElementById('internship-loading');
    const collapseBtn = document.getElementById('collapse-btn');
    let isExpanded = false;
    let autoScrollInterval;
    
    // 实习作品相关配置
    const internshipConfig = {
        totalImages: 278, // 总图片数量
        initialLoadCount: 10, // 初始加载数量
        batchSize: 30, // 每批次加载数量
        imagesLoaded: 0, // 已加载图片数量
        isLoading: false, // 是否正在加载
        baseImagePath: 'img/internship/', // 图片路径前缀，移除了shixi
        imageExt: '.jpg', // 图片扩展名
        currentPage: 1, // 当前页
        totalPages: 0, // 总页数
        hasAllImagesLoaded: false, // 是否已加载所有图片
    };
    
    // 计算总页数
    internshipConfig.totalPages = Math.ceil(internshipConfig.totalImages / internshipConfig.batchSize);
    
    // 创建简化版模态框用于实习作品（只显示图片）
    const createSimpleModal = () => {
        const modal = document.createElement('div');
        modal.id = 'internship-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content simple-modal">
                <span class="close-modal">&times;</span>
                <div class="simple-modal-body">
                    <img src="" alt="实习作品" id="internship-modal-image">
                </div>
                <div class="modal-navigation">
                    <button class="nav-btn prev-btn"><i class="fas fa-chevron-left"></i></button>
                    <button class="nav-btn next-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 关闭模态框事件
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        return modal;
    };
    
    // 创建简化版模态框
    const internshipModal = createSimpleModal();
    const internshipModalImage = document.getElementById('internship-modal-image');
    let currentImageIndex = 0;
    
    // 添加模态框导航功能
    const prevBtn = internshipModal.querySelector('.prev-btn');
    const nextBtn = internshipModal.querySelector('.next-btn');
    
    // 上一张图片
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(-1);
    });
    
    // 下一张图片
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage(1);
    });
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (!internshipModal.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            navigateImage(-1);
        } else if (e.key === 'ArrowRight') {
            navigateImage(1);
        } else if (e.key === 'Escape') {
            internshipModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // 图片导航函数
    function navigateImage(direction) {
        const images = document.querySelectorAll('#internship .portfolio-img img');
        
        if (images.length === 0) return;
        
        currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
        const newImage = images[currentImageIndex];
        
        // 如果图片还没加载，确保加载
        if (newImage.hasAttribute('data-src')) {
            newImage.src = newImage.getAttribute('data-src');
            newImage.removeAttribute('data-src');
        }
        
        internshipModalImage.src = newImage.src;
    }

    // 格式化图片编号（确保有前导零）
    function formatImageNumber(num) {
        return num.toString().padStart(3, '0');
    }
    
    // 创建实习作品图片元素
    function createInternshipImageElement(imageNumber) {
        const imageIndex = imageNumber; // 从1开始
        const formattedNumber = formatImageNumber(imageIndex);
        const imgPath = `${internshipConfig.baseImagePath}${formattedNumber}${internshipConfig.imageExt}`;
        
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item shixi';
        portfolioItem.dataset.index = imageIndex - 1;
        
        const portfolioImg = document.createElement('div');
        portfolioImg.className = 'portfolio-img';
        
        const img = document.createElement('img');
        
        // 是否使用懒加载（初始图片直接加载，其余懒加载）
        if (imageIndex <= internshipConfig.initialLoadCount) {
            img.src = imgPath;
            img.alt = `实习作品${formattedNumber}`;
        } else {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
            img.alt = `实习作品${formattedNumber}`;
            img.setAttribute('data-src', imgPath);
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
        
        portfolioImg.appendChild(img);
        portfolioItem.appendChild(portfolioImg);
        
        return portfolioItem;
    }

    // 图片懒加载函数
    const lazyLoadImages = () => {
        if (!('IntersectionObserver' in window)) {
            // 对于不支持IntersectionObserver的浏览器，手动加载
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                img.onload = () => {
                    img.style.opacity = '1';
                };
            });
            return;
        }
        
        // 创建 Intersection Observer 实例
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const dataSrc = img.getAttribute('data-src');
                    
                    if (dataSrc) {
                        img.src = dataSrc;
                        img.removeAttribute('data-src');
                        
                        // 图片加载完成后显示
                        img.onload = () => {
                            img.style.opacity = '1';
                        };
                        
                        // 停止观察已加载的图片
                        observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '0px 0px 200px 0px' }); // 提前200px开始加载
        
        // 获取所有需要懒加载的图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    };

    // 为实习作品图片添加点击事件，显示简化模态框
    const addInternshipImageClickEvents = () => {
        const internshipImages = document.querySelectorAll('#internship .portfolio-img');
        
        internshipImages.forEach((imgContainer, index) => {
            imgContainer.addEventListener('click', function() {
                const img = this.querySelector('img');
                currentImageIndex = parseInt(this.parentNode.dataset.index);
                
                // 确保图片已加载
                if (img.getAttribute('data-src')) {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                }
                
                // 设置模态框图片
                internshipModalImage.src = img.src;
                
                // 显示模态框
                internshipModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    };

    // 初始加载实习图片
    const loadInitialInternshipImages = () => {
        for (let i = 1; i <= internshipConfig.initialLoadCount; i++) {
            if (i <= internshipConfig.totalImages) {
                const imageElement = createInternshipImageElement(i);
                internshipContainer.appendChild(imageElement);
                internshipConfig.imagesLoaded++;
            }
        }
        
        // 初始化懒加载和点击事件
        lazyLoadImages();
        addInternshipImageClickEvents();
    };
    
    // 加载下一批图片
    const loadMoreImages = (count) => {
        if (internshipConfig.isLoading || internshipConfig.imagesLoaded >= internshipConfig.totalImages) {
            return;
        }
        
        internshipConfig.isLoading = true;
        loadingIndicator.classList.add('active');
        
        // 确定加载数量
        const startIndex = internshipConfig.imagesLoaded + 1;
        const endIndex = Math.min(internshipConfig.imagesLoaded + count, internshipConfig.totalImages);
        
        // 延迟加载，模拟网络请求
        setTimeout(() => {
            for (let i = startIndex; i <= endIndex; i++) {
                const imageElement = createInternshipImageElement(i);
                internshipContainer.appendChild(imageElement);
                internshipConfig.imagesLoaded++;
            }
            
            // 更新懒加载和点击事件
            lazyLoadImages();
            addInternshipImageClickEvents();
            
            internshipConfig.isLoading = false;
            loadingIndicator.classList.remove('active');
            
            // 检查是否所有图片都已加载
            if (internshipConfig.imagesLoaded >= internshipConfig.totalImages) {
                internshipConfig.hasAllImagesLoaded = true;
                viewMoreBtn.textContent = '收起作品';
            }
        }, 500);
    };
    
    // 加载所有图片
    const loadAllImages = () => {
        // 计算剩余图片数量
        const remainingImages = internshipConfig.totalImages - internshipConfig.imagesLoaded;
        
        if (remainingImages > 0) {
            loadMoreImages(remainingImages);
        }
    };

    // 自动滚动功能
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (!isExpanded) {
                const scrollWidth = internshipScroll.scrollWidth;
                const clientWidth = internshipScroll.clientWidth;
                const currentScroll = internshipScroll.scrollLeft;

                if (currentScroll + clientWidth >= scrollWidth) {
                    // 滚动到末尾时，平滑回到开始
                    internshipScroll.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // 正常滚动
                    internshipScroll.scrollTo({
                        left: currentScroll + 2,
                        behavior: 'smooth'
                    });
                }
            }
        }, 50); // 每50毫秒滚动一次
    }

    // 停止自动滚动
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // 鼠标悬停时停止自动滚动
    internshipScroll.addEventListener('mouseenter', stopAutoScroll);
    internshipScroll.addEventListener('mouseleave', () => {
        if (!isExpanded) {
            startAutoScroll();
        }
    });

    // 开始自动滚动
    startAutoScroll();
    
    // 初始加载实习作品图片
    loadInitialInternshipImages();

    // 收起作品函数
    const collapseInternshipWorks = () => {
        if (!isExpanded) return;
        
        isExpanded = false;
        
        // 收起作品
        internshipScroll.classList.remove('expanded');
        viewMoreBtn.textContent = '查看更多作品';
        collapseBtn.classList.remove('active');

        // 重置动画效果
        const portfolioItems = document.querySelectorAll('#internship .portfolio-item');
        portfolioItems.forEach(item => {
            item.style.transition = 'none';
            item.style.opacity = '1';
            item.style.transform = 'none';
        });

        // 恢复自动滚动
        setTimeout(() => {
            startAutoScroll();
        }, 500);
        
        // 滚动到实习作品部分顶部
        document.getElementById('internship').scrollIntoView({
            behavior: 'smooth'
        });
    };
    
    // 收起按钮点击事件
    collapseBtn.addEventListener('click', collapseInternshipWorks);

    // 点击查看更多按钮处理
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function () {
            isExpanded = !isExpanded;

            if (isExpanded) {
                // 展开所有作品
                stopAutoScroll();
                internshipScroll.classList.add('expanded');
                viewMoreBtn.textContent = '加载中...';
                collapseBtn.classList.add('active'); // 显示收起按钮
                
                // 加载所有图片
                loadAllImages();
                
                // 添加动画效果
                setTimeout(() => {
                    const portfolioItems = document.querySelectorAll('#internship .portfolio-item');
                    portfolioItems.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.transition = 'all 0.5s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index % 30 * 20); // 使用模运算避免延迟时间过长
                    });
                }, 300);
                
            } else {
                // 收起作品
                collapseInternshipWorks();
            }
        });
    }
    
    // 当滚动时，检查是否需要显示或隐藏收起按钮
    window.addEventListener('scroll', () => {
        if (!isExpanded) {
            collapseBtn.classList.remove('active');
            return;
        }
        
        // 在展开状态下，收起按钮始终可见
        collapseBtn.classList.add('active');
    });
}); 
