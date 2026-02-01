// ===== SVG 道心值进度条 =====
function setProgress(percent) {
    const progress = document.querySelector('.progress-bar');
    const offset = 314 - (314 * percent) / 100; // 100% -> 0 offset
    progress.style.strokeDashoffset = offset;
}

// 页面加载示例
document.addEventListener("DOMContentLoaded", () => {
    let value = 0;
    const interval = setInterval(() => {
        if (value > 80) clearInterval(interval); // 模拟道心值80%
        setProgress(value);
        value += 2;
    }, 50);
});

// ===== 技能触发动画 =====
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});