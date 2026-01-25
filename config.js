// ملف تهيئة التطبيق
const Config = {
  // إعدادات Supabase
  supabase: {
    url: 'https://mmgxgalxbnfjgglkvfcv.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZ3hnYWx4Ym5mamdnbGt2ZmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzODk0OTEsImV4cCI6MjA1MDk2NTQ5MX0.-pA1u1i85fw-ek1sQeQg6Aqicm21Odye0mU3TyDeMn4',
  },
  
  // إعدادات التطبيق
  app: {
    name: 'King of the Game',
    version: '1.0.0',
    apiBaseUrl: '/api',
  },
  
  // إعدادات العرض
  display: {
    itemsPerPage: 25,
    autoRefreshInterval: 30000, // 30 ثانية
    statsRefreshInterval: 60000, // دقيقة واحدة
  },
  
  // إعدادات الإحصائيات
  stats: {
    maxCoaches: 1000,
    updateThreshold: 10,
  },
  
  // روابط الوسائط الاجتماعية
  social: {
    whatsapp: 'https://wa.me/message/IIIHPVUIHY74H1',
    telegram: 'https://t.me/I_X_X_T',
    instagram: 'https://www.instagram.com/i_x_x_t',
    game: 'https://ar.onlinesoccermanager.com/',
    resultsGroup: 'https://chat.whatsapp.com/BMJsJ3YiJtS3kXtfiZoYYa',
    discussionGroup: 'https://chat.whatsapp.com/FGv3EM4K472BJG3WZDfqMY',
  }
};

// للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Config;
} else {
  window.Config = Config;
}