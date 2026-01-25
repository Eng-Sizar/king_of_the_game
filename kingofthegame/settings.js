// ========================================
// ⚙️ King of the Game - Settings Only
// ========================================

// التمرير السلس
document.addEventListener('DOMContentLoaded', () => {
  // إضافة زر العودة للأعلى
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--royal-purple), var(--royal-blue));
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 1000;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px var(--royal-shadow);
  `;
  
  document.body.appendChild(backToTopBtn);
  
  // إظهار/إخفاء الزر
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.transform = 'translateY(0)';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.transform = 'translateY(20px)';
    }
  });
  
  // النقر للعودة للأعلى
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // شريط التقدم
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--royal-gold), var(--royal-purple));
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  
  document.body.appendChild(progressBar);
  
  // تحديث شريط التقدم
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });

  console.log('⚙️ إعدادات الموقع جاهزة');
});