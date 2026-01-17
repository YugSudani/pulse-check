import { useEffect, useState } from "react";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    console.log("[PWA] usePwaInstall hook mounted");

    const handler = (e) => {
      console.log("[PWA] beforeinstallprompt event fired");
      console.log("[PWA] Event object:", e);

      // Stop Chrome from showing the default mini-infobar
      e.preventDefault();

      console.log("[PWA] Default install prompt prevented");

      setDeferredPrompt(e);
      setIsInstallable(true);

      console.log("[PWA] App is now installable");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      console.log("[PWA] usePwaInstall hook unmounted");
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    console.log("[PWA] Install button clicked");

    if (!deferredPrompt) {
      console.warn("[PWA] No deferredPrompt available — install aborted");
      return;
    }

    console.log("[PWA] Showing install prompt");
    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;

    console.log("[PWA] User choice result:", choiceResult);

    if (choiceResult.outcome === "accepted") {
      console.log("[PWA] User accepted the install prompt");
    } else {
      console.log("[PWA] User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);

    console.log("[PWA] deferredPrompt cleared, install state reset");
  };

  return { isInstallable, installApp };
}
