import { useState, useEffect, useRef } from "react";

export default function TextToSpeech({ text, onWordIndex }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const intervalRef = useRef(null);
  const wordIndexRef = useRef(0);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      clearInterval(intervalRef.current);
      onWordIndex?.(-1);
    };
  }, []);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      clearInterval(intervalRef.current);
      setIsSpeaking(false);
      onWordIndex?.(-1);
      return;
    }

    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    wordIndexRef.current = 0;
    onWordIndex?.(0);

    // Move pointer every ~450ms per word
    intervalRef.current = setInterval(() => {
      wordIndexRef.current++;
      if (wordIndexRef.current < words.length) {
        onWordIndex?.(wordIndexRef.current);
      } else {
        clearInterval(intervalRef.current);
      }
    }, 400);

    utterance.onend = () => {
      clearInterval(intervalRef.current);
      setIsSpeaking(false);
      onWordIndex?.(-1);
    };

    utterance.onerror = () => {
      clearInterval(intervalRef.current);
      setIsSpeaking(false);
      onWordIndex?.(-1);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const isDisabled = !text || text.trim() === "";

  return (
    <button
      onClick={handleSpeak}
      disabled={isDisabled}
      title={isDisabled ? "No summary" : isSpeaking ? "Stop" : "Listen"}
      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
        isDisabled
          ? "opacity-30 cursor-not-allowed"
          : isSpeaking
            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            : "hover:bg-green-500/20 text-green-400"
      }`}
    >
      {isSpeaking ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
