// ملف تهيئة التطبيق
const Config = {
  // إعدادات Supabase
  supabase: {
    url: 'https://mmgxgalxbnfjgglkvfcv.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZ3hnYWx4Ym5mamdnbGt2ZmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyODY3OTMsImV4cCI6MjA4NDg2Mjc5M30.gRNxxL5zPVL6asD8-bZ6F8UZ24c-p1gytPJ1OSevBoY',
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