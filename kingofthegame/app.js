// إدارة السمات والتخصيصات
const ThemeManager = {
  currentTheme: 'royal',
  
  themes: {
    royal: {
      dark: '#0a0a1a',
      card: 'rgba(20, 20, 40, 0.9)',
      gold: '#ffd700',
      purple: '#9370db',
      blue: '#4169e1'
    },
    dark: {
      dark: '#121212',
      card: 'rgba(30, 30, 30, 0.9)',
      gold: '#daa520',
      purple: '#9c27b0',
      blue: '#2196f3'
    },
    elite: {
      dark: '#0f172a',
      card: 'rgba(30, 41, 59, 0.9)',
      gold: '#fbbf24',
      purple: '#8b5cf6',
      blue: '#3b82f6'
    }
  },
  
  init() {
    this.loadTheme();
    this.setupThemeToggle();
  },
  
  loadTheme() {
    const savedTheme = localStorage.getItem('king_theme') || 'royal';
    this.applyTheme(savedTheme);
  },
  
  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;
    
    this.currentTheme = themeName;
    
    // تحديث متغيرات CSS
    const root = document.documentElement;
    root.style.setProperty('--royal-dark', theme.dark);
    root.style.setProperty('--royal-card', theme.card);
    root.style.setProperty('--royal-gold', theme.gold);
    root.style.setProperty('--royal-purple', theme.purple);
    root.style.setProperty('--royal-blue', theme.blue);
    
    // حفظ التفضيل
    localStorage.setItem('king_theme', themeName);
    
    // إشعار
    if (window.KingApp) {
      KingApp.showNotification(`تم التبديل إلى سمة ${themeName}`, 'success');
    }
  },
  
  setupThemeToggle() {
    // يمكن إضافة زر تبديل السمات في المستقبل
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-palette"></i>';
    themeToggle.title = 'تبديل السمة';
    themeToggle.style.cssText = `
      position: fixed;
      bottom: 90px;
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
      box-shadow: 0 5px 15px var(--royal-shadow);
      transition: all 0.3s ease;
    `;
    
    themeToggle.addEventListener('click', () => {
      const themes = Object.keys(this.themes);
      const currentIndex = themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      this.applyTheme(themes[nextIndex]);
    });
    
    themeToggle.addEventListener('mouseenter', () => {
      themeToggle.style.transform = 'scale(1.1) rotate(15deg)';
    });
    
    themeToggle.addEventListener('mouseleave', () => {
      themeToggle.style.transform = 'scale(1) rotate(0)';
    });
    
    document.body.appendChild(themeToggle);
  }
};

// إدارة التفضيلات المحلية
const Preferences = {
  init() {
    this.loadPreferences();
  },
  
  preferences: {
    autoRefresh: true,
    itemsPerPage: 25,
    showOnlineOnly: false,
    notifications: true
  },
  
  loadPreferences() {
    try {
      const saved = localStorage.getItem('king_preferences');
      if (saved) {
        this.preferences = { ...this.preferences, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('⚠️ خطأ في تحميل التفضيلات:', error);
    }
  },
  
  savePreferences() {
    try {
      localStorage.setItem('king_preferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.warn('⚠️ خطأ في حفظ التفضيلات:', error);
    }
  },
  
  setPreference(key, value) {
    this.preferences[key] = value;
    this.savePreferences();
  },
  
  getPreference(key) {
    return this.preferences[key];
  }
};

// أدوات مساعدة
const Utils = {
  // تنسيق الأرقام
  formatNumber(num) {
    if (!num && num !== 0) return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },
  
  // تنسيق التاريخ
  formatDate(date) {
    if (!date) return 'غير محدد';
    
    try {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(date).toLocaleDateString('ar-SA', options);
    } catch (error) {
      return 'تاريخ غير صالح';
    }
  },
  
  // نسخ للنصوص
  copyToClipboard(text) {
    if (!navigator.clipboard) {
      this.fallbackCopyToClipboard(text);
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => {
        if (window.KingApp) {
          KingApp.showNotification('تم النسخ إلى الحافظة', 'success');
        }
      })
      .catch(err => {
        console.error('فشل النسخ:', err);
        this.fallbackCopyToClipboard(text);
      });
  },
  
  // طريقة بديلة للنسخ
  fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      if (window.KingApp) {
        KingApp.showNotification('تم النسخ إلى الحافظة', 'success');
      }
    } catch (err) {
      console.error('فشل النسخ البديل:', err);
    }
    
    document.body.removeChild(textArea);
  },
  
  // تنزيل البيانات
  downloadData(data, filename = 'data.json') {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      if (window.KingApp) {
        KingApp.showNotification('تم تنزيل البيانات بنجاح', 'success');
      }
    } catch (error) {
      console.error('فشل تنزيل البيانات:', error);
      if (window.KingApp) {
        KingApp.showNotification('فشل تنزيل البيانات', 'error');
      }
    }
  }
};

// تحسينات للواجهة
const UIEnhancements = {
  init() {
    this.addSmoothScrolling();
    this.addBackToTop();
    this.addProgressIndicator();
    this.addTooltips();
  },
  
  addSmoothScrolling() {
    // إضافة التمرير السلس للروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  },
  
  addBackToTop() {
    // إنشاء زر العودة للأعلى
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.title = 'العودة للأعلى';
    backToTopButton.style.cssText = `
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
    
    document.body.appendChild(backToTopButton);
    
    // إظهار/إخفاء الزر عند التمرير
    const toggleButton = () => {
      if (window.scrollY > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.transform = 'translateY(0)';
      } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.transform = 'translateY(20px)';
      }
    };
    
    window.addEventListener('scroll', toggleButton);
    toggleButton(); // التحقق الأولي
    
    // حدث النقر
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // تأثيرات hover
    backToTopButton.addEventListener('mouseenter', () => {
      backToTopButton.style.transform = 'translateY(-3px)';
      backToTopButton.style.boxShadow = '0 8px 20px var(--royal-shadow)';
    });
    
    backToTopButton.addEventListener('mouseleave', () => {
      backToTopButton.style.transform = window.scrollY > 300 ? 'translateY(0)' : 'translateY(20px)';
      backToTopButton.style.boxShadow = '0 5px 15px var(--royal-shadow)';
    });
  },
  
  addProgressIndicator() {
    // شريط تقدم التمرير
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
    const updateProgressBar = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    };
    
    window.addEventListener('scroll', updateProgressBar);
    window.addEventListener('resize', updateProgressBar);
    updateProgressBar(); // التحقق الأولي
  },
  
  addTooltips() {
    // إضافة تلميحات للأيقونات
    const elementsWithTooltip = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltip.forEach(element => {
      const tooltipText = element.dataset.tooltip;
      
      element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
          position: absolute;
          background: var(--royal-card);
          color: var(--text-royal);
          padding: 0.5rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          white-space: nowrap;
          z-index: 10000;
          box-shadow: 0 5px 15px var(--royal-shadow);
          border: 1px solid var(--royal-border);
          pointer-events: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.2s, transform 0.2s;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        
        // إظهار التلميحة
        setTimeout(() => {
          tooltip.style.opacity = '1';
          tooltip.style.transform = 'translateY(0)';
        }, 10);
        
        // تخزين المرجع
        element._tooltip = tooltip;
      });
      
      element.addEventListener('mouseleave', () => {
        if (element._tooltip) {
          element._tooltip.remove();
          delete element._tooltip;
        }
      });
    });
  }
};

// تهيئة كل الميزات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // تهيئة إدارة السمات
  ThemeManager.init();
  
  // تهيئة التفضيلات
  Preferences.init();
  
  // تحسينات الواجهة
  UIEnhancements.init();
  
  // إضافة أنماط إضافية
  addAdditionalStyles();
});

// إضافة أنماط CSS إضافية
function addAdditionalStyles() {
  const styles = document.createElement('style');
  styles.textContent = `
    /* تحسينات للواجهة */
    .back-to-top:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 8px 20px var(--royal-shadow) !important;
    }
    
    /* تأثيرات النقر */
    .coach-row-enhanced,
    .quick-action,
    .tab-btn,
    .page-btn,
    .page-number {
      cursor: pointer;
      user-select: none;
    }
    
    /* تحسينات للشاشات الكبيرة */
    @media (min-width: 1600px) {
      .king-main {
        max-width: 1600px;
      }
      
      .container {
        max-width: 1400px;
      }
    }
    
    /* وضع الطباعة */
    @media print {
      .king-nav,
      .quick-actions-section,
      .back-to-top,
      .scroll-progress,
      .social-links-footer,
      #theme-toggle {
        display: none !important;
      }
      
      .ranking-container {
        box-shadow: none !important;
        border: 1px solid #ddd !important;
      }
      
      .coach-row-enhanced {
        page-break-inside: avoid;
      }
    }
    
    /* تحسينات الوصول */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    
    /* التركيز للواجهة */
    :focus-visible {
      outline: 2px solid var(--royal-gold);
      outline-offset: 2px;
    }
    
    /* تلميحات */
    .tooltip {
      animation: tooltipFadeIn 0.2s ease-out;
    }
    
    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  
  document.head.appendChild(styles);
}

// تصدير الوحدات للاستخدام العام
window.Settings = {
  ThemeManager,
  Preferences,
  Utils
};

console.log('⚙️ إعدادات الموقع جاهزة للاستخدام');