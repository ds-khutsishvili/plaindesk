/**
 * Хук для работы с часовыми поясами
 * 
 * Этот хук предоставляет функциональность для работы с часовыми поясами
 * и инкапсулирует всю логику, связанную с ними.
 */

import { useState, useEffect, useCallback } from 'react';
import { TimeFormatOptions } from '../../../utils/timezone';
import { TimezoneService } from '../services/TimezoneService';

interface UseTimezoneOptions {
  timezone?: string;
  showSeconds?: boolean;
  format24h?: boolean;
  updateInterval?: number;
}

interface UseTimezoneResult {
  currentTime: Date;
  formattedTime: string;
  timezoneName: string;
  timezoneOffset: string;
  fullTimezoneName: string;
}

/**
 * Хук для работы с часовыми поясами
 * 
 * @param options Опции для работы с часовыми поясами
 * @returns Объект с данными о времени в указанном часовом поясе
 */
export function useTimezone(options: UseTimezoneOptions): UseTimezoneResult {
  const {
    timezone,
    showSeconds = true,
    format24h = true,
    updateInterval = 1000
  } = options;

  // Состояние для хранения текущего времени в указанном часовом поясе
  const [currentTime, setCurrentTime] = useState<Date>(
    TimezoneService.getCurrentTimeInTimezone(timezone)
  );

  // Обновление времени с указанным интервалом
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(TimezoneService.getCurrentTimeInTimezone(timezone));
    }, updateInterval);

    // Очистка интервала при размонтировании компонента или изменении часового пояса
    return () => {
      clearInterval(timer);
    };
  }, [timezone, updateInterval]);

  // Форматирование времени
  const formattedTime = useCallback(() => {
    const formatOptions: TimeFormatOptions = {
      showSeconds,
      format24h
    };
    
    return TimezoneService.formatTime(currentTime, formatOptions);
  }, [currentTime, showSeconds, format24h]);

  // Получение названия часового пояса
  const timezoneName = useCallback(() => {
    return TimezoneService.getTimezoneName(timezone);
  }, [timezone]);

  // Получение смещения часового пояса
  const timezoneOffset = useCallback(() => {
    return TimezoneService.getTimezoneOffset(timezone);
  }, [timezone]);

  // Получение полного названия часового пояса
  const fullTimezoneName = useCallback(() => {
    return TimezoneService.getFullTimezoneName(timezone);
  }, [timezone]);

  return {
    currentTime,
    formattedTime: formattedTime(),
    timezoneName: timezoneName(),
    timezoneOffset: timezoneOffset(),
    fullTimezoneName: fullTimezoneName()
  };
} 