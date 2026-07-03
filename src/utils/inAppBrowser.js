const ua = () => navigator.userAgent || '';

export const isLineBrowser = () => /Line\//i.test(ua());

export const isFacebookBrowser = () => /FBAN|FBAV|FB_IAB|FBIOS|FBANDROID/i.test(ua());

export const isInAppBrowser = () => isLineBrowser() || isFacebookBrowser();

// LINE รองรับ ?openExternalBrowser=1 อย่างเป็นทางการ
// Facebook ไม่มี parameter แบบนี้ — ต้องแสดง UI ให้ copy link เปิดเอง
export const openInExternalBrowser = () => {
  const url = new URL(window.location.href);
  url.searchParams.set('openExternalBrowser', '1');
  window.location.href = url.toString();
};
