// 导航栏交互
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// 点击导航链接后关闭菜单
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// 滚动时导航栏样式变化
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// 表单提交
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('感谢您的留言！我们会尽快与您联系。');
        contactForm.reset();
    });
}

// 滚动动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .gallery-item, .showcase-item, .about-content, .contact-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 图片懒加载
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// 音乐播放器功能
const musicPlayer = document.getElementById('musicPlayer');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const closeMusicBtn = document.getElementById('closeMusicBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const volumeBtn = document.getElementById('volumeBtn');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const musicTitle = document.getElementById('musicTitle');

// 音乐标题
const defaultTitle = '米津玄师 - Lemon';

// 显示/隐藏音乐播放器
musicToggleBtn.addEventListener('click', () => {
    musicPlayer.classList.toggle('active');
});

// 关闭音乐播放器
closeMusicBtn.addEventListener('click', () => {
    musicPlayer.classList.remove('active');
});

// 播放/暂停
playPauseBtn.addEventListener('click', async () => {
    try {
        if (backgroundMusic.paused) {
            // 尝试播放，处理浏览器自动播放策略
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                await playPromise;
            }
            playPauseBtn.classList.add('playing');
            musicTitle.textContent = defaultTitle;
        } else {
            backgroundMusic.pause();
            playPauseBtn.classList.remove('playing');
            musicTitle.textContent = defaultTitle + ' (已暂停)';
        }
    } catch (error) {
        console.error('播放错误:', error);
        musicTitle.textContent = '播放失败，请检查浏览器设置';
        alert('无法播放音乐。请确保浏览器允许音频播放，并检查音乐文件是否存在。');
    }
});

// 更新进度条
backgroundMusic.addEventListener('timeupdate', () => {
    const progress = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
    progressBar.value = progress || 0;
    
    // 更新时间显示
    currentTimeEl.textContent = formatTime(backgroundMusic.currentTime);
    durationEl.textContent = formatTime(backgroundMusic.duration);
});

// 拖动进度条
progressBar.addEventListener('input', () => {
    const time = (progressBar.value / 100) * backgroundMusic.duration;
    backgroundMusic.currentTime = time;
});

// 音量控制
volumeBar.addEventListener('input', () => {
    backgroundMusic.volume = volumeBar.value / 100;
    updateVolumeIcon();
});

// 设置初始音量
backgroundMusic.volume = volumeBar.value / 100;

// 更新音量图标
function updateVolumeIcon() {
    const volume = backgroundMusic.volume;
    if (volume === 0) {
        volumeBtn.textContent = '🔇';
    } else if (volume < 0.5) {
        volumeBtn.textContent = '🔉';
    } else {
        volumeBtn.textContent = '🔊';
    }
}

// 点击音量按钮静音/取消静音
volumeBtn.addEventListener('click', () => {
    if (backgroundMusic.volume > 0) {
        backgroundMusic.volume = 0;
        volumeBar.value = 0;
    } else {
        backgroundMusic.volume = 0.5;
        volumeBar.value = 50;
    }
    updateVolumeIcon();
});

// 格式化时间
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 音乐加载完成
backgroundMusic.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(backgroundMusic.duration);
});

// 音乐播放结束
backgroundMusic.addEventListener('ended', () => {
    playPauseBtn.classList.remove('playing');
    musicTitle.textContent = '播放完成';
});

// 音乐播放错误处理
backgroundMusic.addEventListener('error', (e) => {
    musicTitle.textContent = '音乐加载失败';
    playPauseBtn.disabled = true;
    playPauseBtn.style.opacity = '0.5';
    console.error('音乐加载失败:', e);
    console.error('错误代码:', backgroundMusic.error ? backgroundMusic.error.code : '未知');
    console.error('错误信息:', backgroundMusic.error ? backgroundMusic.error.message : '未知');
    console.log('请检查：');
    console.log('1. 音乐文件路径是否正确 (music/lemon.mp3)');
    console.log('2. 文件是否存在');
    console.log('3. 浏览器是否支持该音频格式');
});

// 音乐加载成功
backgroundMusic.addEventListener('canplay', () => {
    console.log('音乐可以播放了');
    musicTitle.textContent = defaultTitle;
});

// 音乐开始播放
backgroundMusic.addEventListener('play', () => {
    console.log('音乐开始播放');
    musicTitle.textContent = defaultTitle;
});

// 音乐暂停
backgroundMusic.addEventListener('pause', () => {
    console.log('音乐已暂停');
});

// 检查是否有音乐源
document.addEventListener('DOMContentLoaded', () => {
    musicTitle.textContent = defaultTitle;
    
    // 检查音频元素
    console.log('音频元素src:', backgroundMusic.src);
    console.log('音频元素sources:', backgroundMusic.children.length);
    
    // 等待音频元数据加载
    backgroundMusic.addEventListener('loadedmetadata', () => {
        console.log('音频元数据已加载');
        console.log('音频时长:', backgroundMusic.duration, '秒');
        musicTitle.textContent = defaultTitle;
    });
    
    // 尝试加载音频
    backgroundMusic.load();
    
    if (!backgroundMusic.src && backgroundMusic.children.length === 0) {
        musicTitle.textContent = '请添加音乐文件';
        playPauseBtn.disabled = true;
        playPauseBtn.style.opacity = '0.5';
    }
});

// 初始化音量图标
updateVolumeIcon();

