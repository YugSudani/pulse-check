export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(
    () => window.__pwaInstallPrompt ?? null  // ← grab already-captured event
  );
  const [isInstallable, setIsInstallable] = useState(
    () => !!window.__pwaInstallPrompt
  );

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Still listen for future fires (e.g. after dismissal)
    const handler = (e) => {
      e.preventDefault();
      window.__pwaInstallPrompt = e;
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    const prompt = deferredPrompt ?? window.__pwaInstallPrompt;
    if (!prompt) return;

    prompt.prompt();
    const { outcome } = await prompt.userChoice;

    window.__pwaInstallPrompt = null;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, installApp };
}