// ตรวจจับ browser types
export const detectBrowser = () => {
  if (typeof window === "undefined") {
    return {
      isFacebookBrowser: false,
      isInstagramBrowser: false,
      isLineBrowser: false,
      isTwitterBrowser: false,
      isMobileBrowser: false,
      userAgent: "",
    };
  }

  const userAgent = window.navigator.userAgent || "";

  return {
    isFacebookBrowser: /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(userAgent),
    isInstagramBrowser: /Instagram/i.test(userAgent),
    isLineBrowser: /Line/i.test(userAgent),
    isTwitterBrowser: /Twitter/i.test(userAgent),
    isMobileBrowser:
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ),
    userAgent,
  };
};

// สร้าง URL สำหรับเปิดใน external browser
export const getExternalBrowserUrl = (currentUrl?: string) => {
  const url = currentUrl || window.location.href;

  // Remove Facebook parameters
  const cleanUrl = url.replace(/[?&]fbclid=[^&]*/g, "");

  return cleanUrl;
};

// เปิดใน external browser
export const openInExternalBrowser = () => {
  const url = getExternalBrowserUrl();

  // สำหรับ iOS - ใช้ Safari
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = url;
  }
  // สำหรับ Android - ใช้ Chrome หรือ default browser
  else if (/Android/i.test(navigator.userAgent)) {
    window.location.href = `intent://${url.replace(
      /^https?:\/\//,
      ""
    )}#Intent;scheme=https;package=com.android.chrome;end`;
  }
  // Fallback
  else {
    window.open(url, "_blank");
  }
};
