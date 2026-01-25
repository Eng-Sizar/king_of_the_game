// ========================================
// 👑 King of the Game - Main Application
// ========================================

// تهيئة Supabase
let supabaseClient;

function initSupabase() {
  if (!supabaseClient) {
    const SUPABASE_URL = 'https://mmgxgalxbnfjgglkvfcv.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZ3hnYWx4Ym5mamdnbGt2ZmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyODY3OTMsImV4cCI6MjA4NDg2Mjc5M30.gRNxxL5zPVL6asD8-bZ6F8UZ24c-p1gytPJ1OSevBoY';
    
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized');
  }
  return supabaseClient;
}

// ========================================
// 🎯 King App - التطبيق الرئيسي
// ========================================
const KingApp = {
  coaches: [],
  filteredCoaches: [],
  currentPage: 1,
  itemsPerPage: 25,
  currentFilter: 'all',

  // تهيئة التطبيق
  async init() {
    console.log('👑 بدء تحميل King of the Game...');
    
    try {
      await this.loadCoaches();
      this.setupEventListeners();
      this.updateStats();
      console.log('✅ تم تحميل التطبيق بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تحميل التطبيق:', error);
      this.showError('حدث خطأ في تحميل البيانات');
    }
  },

  // جلب بيانات المدربين من Supabase
  async loadCoaches() {
    try {
      console.log('🔄 بدء جلب البيانات من Supabase...');
      
      const loadingElement = document.getElementById('coaches-ranking');
      if (loadingElement) {
        loadingElement.innerHTML = `
          <div class="loading-state">
            <div class="spinner">
              <i class="fas fa-crown fa-spin"></i>
            </div>
            <p>جاري تحميل بيانات المدربين...</p>
          </div>
        `;
      }

      // تهيئة Supabase
      const supabase = initSupabase();

      console.log('📡 جلب البيانات من جدول coaches...');
      
      // جلب البيانات من Supabase
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .order('total_titles', { ascending: false });

      console.log('📊 النتيجة:', { data, error });

      if (error) {
        console.error('❌ خطأ Supabase:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ لا توجد بيانات');
        this.showError('لا توجد بيانات في قاعدة البيانات. يرجى إدخال البيانات أولاً.');
        return;
      }

      // إضافة ترتيب للمدربين
      this.coaches = data.map((coach, index) => ({
        ...coach,
        rank: index + 1
      }));

      this.filteredCoaches = [...this.coaches];
      this.renderCoaches();
      this.updateStats();
      
      console.log(`✅ تم تحميل ${this.coaches.length} مدرب بنجاح`);
    } catch (error) {
      console.error('❌ خطأ في جلب البيانات:', error);
      console.error('تفاصيل الخطأ:', error.message);
      this.showError(`فشل الاتصال بقاعدة البيانات: ${error.message}`);
    }
  },

  // عرض المدربين
  renderCoaches() {
    const container = document.getElementById('coaches-ranking');
    if (!container) return;

    if (this.filteredCoaches.length === 0) {
      container.innerHTML = `
        <div class="loading-state">
          <p>لا توجد نتائج</p>
        </div>
      `;
      return;
    }

    // حساب الصفحات
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageCoaches = this.filteredCoaches.slice(startIndex, endIndex);

    // عرض المدربين
    container.innerHTML = pageCoaches.map(coach => this.createCoachRow(coach)).join('');

    // تحديث الترقيم
    this.updatePagination();
  },

  // إنشاء صف المدرب
  createCoachRow(coach) {
    const category = this.getCategory(coach.rank);
    const icon = this.getCategoryIcon(coach.rank);
    
    return `
      <div class="coach-row-enhanced ${category}">
        <div class="rank-display ${category}">
          <i class="${icon}"></i>
          <span>${coach.rank}</span>
        </div>
        
        <div class="coach-info-enhanced">
          <div class="coach-avatar-enhanced">
            <div class="avatar-placeholder">
              ${coach.coach_name.charAt(0)}
            </div>
          </div>
          
          <div class="coach-details-enhanced">
            <div class="coach-name">
              ${coach.coach_name}
              <span class="coach-title">${this.getCategoryTitle(coach.rank)}</span>
            </div>
          </div>
        </div>
        
        <div class="stats-display-enhanced">
          <div class="stat-badge-enhanced">
            <span class="stat-value">${coach.total_titles}</span>
            <span class="stat-label-small">بطولة</span>
          </div>
        </div>
      </div>
    `;
  },

  // تحديد الفئة حسب الترتيب
  getCategory(rank) {
    if (rank === 1) return 'king';
    if (rank <= 5) return 'prince';
    if (rank <= 15) return 'noble';
    return 'knight';
  },

  // الحصول على أيقونة الفئة
  getCategoryIcon(rank) {
    if (rank === 1) return 'fas fa-crown';
    if (rank <= 5) return 'fas fa-gem';
    if (rank <= 15) return 'fas fa-shield-halved';
    return 'fas fa-helmet-battle';
  },

  // الحصول على لقب الفئة
  getCategoryTitle(rank) {
    if (rank === 1) return 'ملك المنصة';
    if (rank <= 5) return 'أمير المنصة';
    if (rank <= 15) return 'نبيل المنصة';
    return 'فارس المنصة';
  },

  // تحديث الإحصائيات
  updateStats() {
    // إجمالي المدربين
    const totalCoaches = document.getElementById('total-coaches');
    if (totalCoaches) {
      totalCoaches.textContent = this.coaches.length;
    }

    // النشطون الآن (عشوائي للتجربة)
    const activeNow = document.getElementById('active-now');
    if (activeNow) {
      activeNow.textContent = Math.floor(this.coaches.length * 0.3);
    }

    // أعلى نقاط
    const topPoints = document.getElementById('top-points');
    if (topPoints) {
      topPoints.textContent = this.coaches.length > 0 ? this.coaches[0].total_titles : 0;
    }

    // متوسط النقاط
    const avgPoints = document.getElementById('avg-points');
    if (avgPoints) {
      const avg = this.coaches.length > 0 
        ? Math.round(this.coaches.reduce((sum, c) => sum + c.total_titles, 0) / this.coaches.length)
        : 0;
      avgPoints.textContent = avg;
    }

    // تحديث العدد في الهيدر
    const headerCount = document.getElementById('header-count');
    if (headerCount) {
      headerCount.textContent = this.coaches.length + '+';
    }
  },

  // تحديث الترقيم
  updatePagination() {
    const totalPages = Math.ceil(this.filteredCoaches.length / this.itemsPerPage);
    const container = document.getElementById('page-numbers-container');
    
    if (!container) return;

    let pagesHTML = '';
    
    // عرض 5 صفحات كحد أقصى
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesHTML += `
        <button class="page-number ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    container.innerHTML = pagesHTML;

    // تحديث أزرار السابق والتالي
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentPage === totalPages;
    }
  },

  // إعداد مستمعي الأحداث
  setupEventListeners() {
    // التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.closest('.tab-btn').classList.add('active');
        
        const filter = e.target.closest('.tab-btn').dataset.filter;
        this.applyFilter(filter);
      });
    });

    // الترقيم
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('page-number')) {
        this.currentPage = parseInt(e.target.dataset.page);
        this.renderCoaches();
      }
    });

    // السابق والتالي
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderCoaches();
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(this.filteredCoaches.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.renderCoaches();
        }
      });
    }

    // تغيير عدد العناصر في الصفحة
    const itemsPerPageSelect = document.getElementById('items-per-page');
    if (itemsPerPageSelect) {
      itemsPerPageSelect.addEventListener('change', (e) => {
        this.itemsPerPage = parseInt(e.target.value);
        this.currentPage = 1;
        this.renderCoaches();
      });
    }

    // التنقل السلس
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  },

  // تطبيق الفلتر
  applyFilter(filter) {
    this.currentFilter = filter;
    this.currentPage = 1;

    switch(filter) {
      case 'top':
        this.filteredCoaches = this.coaches.slice(0, 10);
        break;
      case 'rising':
        // المدربين الصاعدون (نفترض أنهم الأحدث)
        this.filteredCoaches = [...this.coaches].reverse().slice(0, 20);
        break;
      default:
        this.filteredCoaches = [...this.coaches];
    }

    this.renderCoaches();
  },

  // عرض خطأ
  showError(message) {
    const container = document.getElementById('coaches-ranking');
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="spinner">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p style="color: var(--royal-red);">${message}</p>
          <button onclick="KingApp.loadCoaches()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--royal-purple); color: white; border: none; border-radius: 8px; cursor: pointer;">
            إعادة المحاولة
          </button>
        </div>
      `;
    }
  },

  // إظهار إشعار
  showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
  }
};

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  KingApp.init();
});

// تصدير للاستخدام العام
window.KingApp = KingApp;