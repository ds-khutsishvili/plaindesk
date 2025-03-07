/**
 * Сервис для работы с часовыми поясами в виджете часов
 * 
 * Этот сервис предоставляет методы для работы с часовыми поясами
 * и инкапсулирует всю логику, связанную с ними.
 */

import {
  getTimeInTimezone,
  formatTime,
  getTimezoneName,
  getTimezoneOffset,
  getCurrentTimezone,
  POPULAR_TIMEZONES,
  TIMEZONE_GROUPS,
  TimeFormatOptions,
  TimezoneInfo
} from '../../../utils/timezone';

/**
 * Сервис для работы с часовыми поясами
 */
export class TimezoneService {
  /**
   * Получает текущее время в указанном часовом поясе
   * 
   * @param timezone Идентификатор часового пояса
   * @returns Текущее время в указанном часовом поясе
   */
  static getCurrentTimeInTimezone(timezone: string): Date {
    return getTimeInTimezone(new Date(), timezone);
  }

  /**
   * Форматирует время с учетом настроек
   * 
   * @param date Дата для форматирования
   * @param options Опции форматирования
   * @returns Отформатированная строка времени
   */
  static formatTime(date: Date, options: TimeFormatOptions = {}): string {
    return formatTime(date, options);
  }

  /**
   * Получает название часового пояса
   * 
   * @param timezone Идентификатор часового пояса
   * @returns Название часового пояса
   */
  static getTimezoneName(timezone: string): string {
    return getTimezoneName(timezone);
  }

  /**
   * Получает смещение часового пояса относительно UTC
   * 
   * @param timezone Идентификатор часового пояса
   * @returns Смещение часового пояса
   */
  static getTimezoneOffset(timezone: string): string {
    return getTimezoneOffset(timezone);
  }

  /**
   * Получает текущий часовой пояс пользователя
   * 
   * @returns Идентификатор текущего часового пояса
   */
  static getCurrentTimezone(): string {
    return getCurrentTimezone();
  }

  /**
   * Получает список популярных часовых поясов
   * 
   * @returns Список популярных часовых поясов
   */
  static getPopularTimezones(): TimezoneInfo[] {
    return POPULAR_TIMEZONES;
  }

  /**
   * Получает полное отображаемое имя часового пояса (с названием и смещением)
   * 
   * @param timezone Идентификатор часового пояса
   * @returns Полное отображаемое имя часового пояса
   */
  static getFullTimezoneName(timezone: string): string {
    const name = getTimezoneName(timezone);
    const offset = getTimezoneOffset(timezone);
    
    return offset ? `${name} (${offset})` : name;
  }
} 