import { useState, useEffect } from "react";

const CountdownTimer = ({ timestamp, skipText }) => {
  const calculateTimeLeft = () => {
      const endTime = new Date(timestamp);
      const difference = endTime.getTime() - Date.now();
      return difference > 0 ? difference : 0;
    },
    [timeLeft, setTimeLeft] = useState(calculateTimeLeft()),
    padStart = (number) => number.toString().padStart(2, 0),
    formatTime = (time) => {
      const hours = Math.max(Math.floor(time / 3600000), 0);
      const minutes = Math.max(Math.floor((time % 3600000) / 60000), 0);
      const seconds = Math.max(Math.floor((time % 60000) / 1000), 0);

      return skipText
        ? `${padStart(hours)}:${padStart(minutes)}:${padStart(seconds)}`
        : `The stream will start in 
      ${!hours ? "" : `${hours} ${hours === 1 ? "hour" : "hours"}, `} 
      ${!minutes ? "" : `${minutes} ${minutes === 1 ? "minute" : "minutes"} and `}
      ${seconds} ${seconds === 1 ? "second" : "seconds"}. Stay tuned!`;
    },
    handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeLeft(calculateTimeLeft());
      }
    };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      window.location.reload();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  return formatTime(timeLeft);
};

export default CountdownTimer;
