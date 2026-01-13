import "./App.css";
import Routes_ from "./routes/Routes";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.init({
        appId: "224242a0-7959-4a1d-ab2e-cc56a6428b0d",
        safari_web_id:
          "web.onesignal.auto.07679346-76f9-40eb-adf2-79670b2a6a52",
        allowLocalhostAsSecureOrigin: true,
        // Enable slidedown prompts
        promptOptions: {
          slidedown: {
            enabled: true,
            autoPrompt: false, // Don't auto-prompt, we'll trigger manually
            actionMessage: "We'd like to send you notifications for updates.",
            acceptButtonText: "Allow", 
            cancelButtonText: "No Thanks",
          },
        },
      });
    });
  }, []);

  return (
    <>
      <AuthProvider>
        <Routes_ />
      </AuthProvider>
    </>
  );
}

export default App;
