import { useEffect, useState } from "react";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // console.log("[PWA] usePwaInstall hook mounted");

    // ✅ Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      // console.log("[PWA] App is already installed");
      return;
    }

    const handler = (e) => {
      // console.log("[PWA] beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      // console.log("[PWA] App is now installable");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    // console.log("[PWA] Install button clicked");

    if (!deferredPrompt) {
      // console.warn("[PWA] No deferredPrompt available");
      return;
    }

    // console.log("[PWA] Showing install prompt");
    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    // console.log("[PWA] User choice:", choiceResult.outcome);

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, installApp };
}