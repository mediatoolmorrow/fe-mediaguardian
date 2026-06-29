// Detects WebViews (LINE, Facebook, Instagram) that Google blocks for OAuth
// with "403: disallowed_useragent", and escapes them to the system browser.
export const isInAppBrowser = () => {
  const ua = navigator.userAgent || '';
  return /Line\//i.test(ua) || /FBAN|FBAV/i.test(ua) || /Instagram/i.test(ua);
};

export const openInExternalBrowser = () => {
  const url = new URL(window.location.href);
  url.searchParams.set('openExternalBrowser', '1');
  window.location.href = url.toString();
};
