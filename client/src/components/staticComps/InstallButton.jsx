import { usePwaInstall } from "../../hooks/usePwaInstall";
import { Download } from "lucide-react";

export default function InstallButton() {
  const { isInstallable, installApp } = usePwaInstall();

  // if (!isInstallable) return null;

  return (
    <button
      onClick={installApp}
      className="flex cursor-pointer items-center gap-3 p-3 sm:p-3 hover:bg-[#121A28] rounded-lg transition w-full text-left min-h-[44px] text-gray-300"
    >
      <Download className="w-4 h-4 mr-2" />
      Install App
    </button>
  );
}
