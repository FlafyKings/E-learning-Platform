import { min } from "date-fns";
import { useEffect, useState } from "react";

const useCountDown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  if (countDown < 0) {
    document.forms["testSolvingForm"].submit();
    return [0, 0];
  } else {
    return getReturnValues(countDown);
  }
};

const getReturnValues = (countDown) => {
  // calculate time left
  const minutes = Math.floor(countDown / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [minutes, seconds];
};

export default useCountDown;
