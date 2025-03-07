/**
 * Константы для модуля часовых поясов
 */
import { TimezoneGroup, TimezoneInfo } from './types';

/**
 * Список популярных часовых поясов
 */
export const POPULAR_TIMEZONES: TimezoneInfo[] = [
  { id: 'UTC', name: 'UTC', offset: '+00:00' },
  { id: 'Europe/Moscow', name: 'Москва', offset: '+03:00', region: 'Europe' },
  { id: 'Europe/London', name: 'Лондон', offset: '+00:00', region: 'Europe' },
  { id: 'America/New_York', name: 'Нью-Йорк', offset: '-05:00', region: 'America' },
  { id: 'America/Los_Angeles', name: 'Лос-Анджелес', offset: '-08:00', region: 'America' },
  { id: 'Asia/Tokyo', name: 'Токио', offset: '+09:00', region: 'Asia' },
  { id: 'Asia/Dubai', name: 'Дубай', offset: '+04:00', region: 'Asia' },
  { id: 'Australia/Sydney', name: 'Сидней', offset: '+10:00', region: 'Australia' },
];

/**
 * Часовые пояса, сгруппированные по регионам
 */
export const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    region: 'UTC',
    timezones: [
      { id: 'UTC', name: 'UTC', offset: '+00:00' }
    ]
  },
  {
    region: 'Европа',
    timezones: [
      { id: 'Europe/Moscow', name: 'Москва', offset: '+03:00' },
      { id: 'Europe/London', name: 'Лондон', offset: '+00:00' },
      { id: 'Europe/Paris', name: 'Париж', offset: '+01:00' },
      { id: 'Europe/Berlin', name: 'Берлин', offset: '+01:00' },
      { id: 'Europe/Kiev', name: 'Киев', offset: '+02:00' },
    ]
  },
  {
    region: 'Америка',
    timezones: [
      { id: 'America/New_York', name: 'Нью-Йорк', offset: '-05:00' },
      { id: 'America/Los_Angeles', name: 'Лос-Анджелес', offset: '-08:00' },
      { id: 'America/Chicago', name: 'Чикаго', offset: '-06:00' },
      { id: 'America/Toronto', name: 'Торонто', offset: '-05:00' },
      { id: 'America/Mexico_City', name: 'Мехико', offset: '-06:00' },
    ]
  },
  {
    region: 'Азия',
    timezones: [
      { id: 'Asia/Tokyo', name: 'Токио', offset: '+09:00' },
      { id: 'Asia/Shanghai', name: 'Шанхай', offset: '+08:00' },
      { id: 'Asia/Dubai', name: 'Дубай', offset: '+04:00' },
      { id: 'Asia/Singapore', name: 'Сингапур', offset: '+08:00' },
      { id: 'Asia/Hong_Kong', name: 'Гонконг', offset: '+08:00' },
    ]
  },
  {
    region: 'Австралия и Океания',
    timezones: [
      { id: 'Australia/Sydney', name: 'Сидней', offset: '+10:00' },
      { id: 'Australia/Melbourne', name: 'Мельбурн', offset: '+10:00' },
      { id: 'Pacific/Auckland', name: 'Окленд', offset: '+12:00' },
    ]
  },
]; 