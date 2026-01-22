  import "./App.css";
  import Routes_ from "./routes/Routes";
  import { AuthProvider } from "./context/AuthContext";
  import { useEffect } from "react";
  import { Toaster, toast } from "sonner";

  function App() {
    
    
    useEffect(() => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      OneSignalDeferred.push(async function (OneSignal) {
        await OneSignal.init({
          appId: "0083fa83-9121-4f94-88dc-8252974df51f",
          safari_web_id:
            "web.onesignal.auto.3b8b9214-66ac-44d1-a7fb-a9dc856242cb",
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
      <Toaster position="bottom-right"  richColors />
        <AuthProvider>
          <Routes_ />
        </AuthProvider>
      </>
    );
  }

  export default App;
