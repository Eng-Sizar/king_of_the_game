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
    document.documentElement.style.setProperty('--royal-dark', theme.dark);
    document.documentElement.style.setProperty('--royal-card', theme.card);
    document.documentElement.style.setProperty('--royal-gold', theme.gold);
    document.documentElement.style.setProperty('--royal-purple', theme.purple);
    document.documentElement.style.setProperty('--royal-blue', theme.blue);
    
    // حفظ التفضيل
    localStorage.setItem('king_theme', themeName);
    
    // إشعار
    if (window.showNotification) {
      showNotification(`تم التبديل إلى سمة ${themeName}`, 'success');
    }
  },
  
  setupThemeToggle() {
    // يمكن إضافة زر تبديل السمات في المستقبل
    console.log('🎨 إدارة السمات جاهزة');
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
    const saved = localStorage.getItem('king_preferences');
    if (saved) {
      this.preferences = { ...this.preferences, ...JSON.parse(saved) };
    }
  },
  
  savePreferences() {
    localStorage.setItem('king_preferences', JSON.stringify(this.preferences));
  },
  
  setPreference(key, value) {
    this.preferences[key] = value;
    this.savePreferences();
  },
  
  getPreference(key) {
    return this.preferences[key];
  }
};

// إدارة التنبيهات والإشعارات
const Notifications = {
  permission: null,
  
  async init() {
    this.checkPermission();
    this.setupNotifications();
  },
  
  checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  },
  
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('هذا المتصفح لا يدعم الإشعارات');
      return false;
    }
    
    if (this.permission === 'default') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }
    
    return this.permission === 'granted';
  },
  
  setupNotifications() {
    // يمكن إضافة مستمعين لأحداث مختلفة لإرسال الإشعارات
  },
  
  showBrowserNotification(title, options = {}) {
    if (this.permission !== 'granted') return false;
    
    const notification = new Notification(title, {
      icon: '/kingofthegame/favicon.ico',
      badge: '/kingofthegame/favicon.ico',
      ...options
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    return true;
  }
};

// أدوات مساعدة
const Utils = {
  // تنسيق الأرقام
  formatNumber(num) {
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
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('ar-SA', options);
  },
  
  // نسخ للنصوص
  copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (window.showNotification) {
          showNotification('تم النسخ إلى الحافظة', 'success');
        }
      })
      .catch(err => {
        console.error('فشل النسخ:', err);
      });
  },
  
  // تنزيل البيانات
  downloadData(data, filename = 'data.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// تحسينات للواجهة
const UIEnhancements = {
  init() {
    this.addSmoothScrolling();
    this.addBackToTop();
    this.addProgressIndicator();
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
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.transform = 'translateY(0)';
      } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.transform = 'translateY(20px)';
      }
    });
    
    // حدث النقر
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }
};

// تهيئة كل الميزات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // تهيئة إدارة السمات
  ThemeManager.init();
  
  // تهيئة التفضيلات
  Preferences.init();
  
  // تهيئة الإشعارات
  Notifications.init().catch(console.error);
  
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
      .social-links-footer {
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
  `;
  
  document.head.appendChild(styles);
}

// تصدير الوحدات للاستخدام العام
window.Settings = {
  ThemeManager,
  Preferences,
  Notifications,
  Utils
};

console.log('⚙️ إعدادات الموقع جاهزة للاستخدام');