
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CountdownProps {
  endTime: string;
}

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };
    
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="text-center">
      <p className="text-xs text-lime-200 mb-1">{t('promo_ends_in')}</p>
      <div className="flex justify-center items-baseline space-x-2 text-white font-mono">
        <div>
          <span className="text-sm font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="text-xs">d</span>
        </div>
        <div>
          <span className="text-sm font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-xs">h</span>
        </div>
        <div>
          <span className="text-sm font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-xs">m</span>
        </div>
        <div>
          <span className="text-sm font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-xs">s</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
