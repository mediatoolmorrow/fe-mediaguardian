const ua = () => navigator.userAgent || '';

export const isLineBrowser = () => /Line\//i.test(ua());

export const isFacebookBrowser = () => /FBAN|FBAV|FB_IAB|FBIOS|FBANDROID/i.test(ua());

// ตรวจสอบ UA-based in-app browser
const isInAppBrowserByUA = () => isLineBrowser() || isFacebookBrowser()
  || /Instagram|TikTok|Twitter|Snapchat/i.test(ua());

// ทดสอบ sessionStorage จริง — วิธีนี้แม่นกว่า UA detection
// เพราะบาง browser block sessionStorage แต่ UA ไม่บ่งบอก
const isSessionStorageBlocked = () => {
  try {
    const key = '__ss_test__';
    sessionStorage.setItem(key, '1');
    sessionStorage.removeItem(key);
    return false;
  } catch {
    return true;
  }
};

// in-app browser = UA match หรือ sessionStorage ถูกบล็อก
export const isInAppBrowser = () => isInAppBrowserByUA() || isSessionStorageBlocked();

// LINE รองรับ ?openExternalBrowser=1 อย่างเป็นทางการ
export const openInExternalBrowser = () => {
  const url = new URL(window.location.href);
  url.searchParams.set('openExternalBrowser', '1');
  window.location.href = url.toString();
};
