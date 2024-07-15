import { useEffect, useRef, useState } from "react";

const useIdleTimer = (timeout = 3000, onIdle) => {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = () => {
    setIsIdle(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
      if (onIdle) {
        onIdle();
      }
    }, timeout);
  };

  const handleActivity = () => {
    resetTimer();
    localStorage.setItem("lastActivity", Date.now().toString());
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) => window.addEventListener(event, handleActivity));

    const handleStorageEvent = (event) => {
      if (event.key === "lastActivity") {
        resetTimer();
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      window.removeEventListener("storage", handleStorageEvent);
      clearTimeout(timerRef.current);
    };
  }, [timeout, onIdle]);

  return isIdle;
};

export default useIdleTimer;
