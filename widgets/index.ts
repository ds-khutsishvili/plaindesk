/**
 * Центральный реестр виджетов
 * 
 * Этот файл служит единой точкой регистрации всех доступных виджетов в приложении.
 * Здесь импортируются и регистрируются манифесты всех виджетов, а также
 * предоставляются функции для работы с ними.
 */

import { WidgetManifest } from '@/types/Widget';
import { DEFAULT_WIDGET_MANIFEST } from './widget-template';
import { TEXT_WIDGET_MANIFEST } from './TextWidget';
import { CLOCK_WIDGET_MANIFEST } from './Clock/manifest';

/**
 * Массив всех доступных манифестов виджетов
 * 
 * При добавлении нового виджета, его манифест нужно импортировать выше
 * и добавить в этот массив.
 */
export const widgetManifests: WidgetManifest[] = [
  // Не включаем базовый виджет в список доступных виджетов
  // DEFAULT_WIDGET_MANIFEST,
  TEXT_WIDGET_MANIFEST,
  CLOCK_WIDGET_MANIFEST,
  // Добавьте здесь манифесты других виджетов
];

/**
 * Получает манифест виджета по его типу
 * 
 * @param type - Тип виджета (например, 'text', 'clock')
 * @returns Манифест виджета или DEFAULT_WIDGET_MANIFEST, если манифест не найден
 */
export function getWidgetManifest(type: string): WidgetManifest {
  const manifest = widgetManifests.find(m => m.id === type);
  return manifest || DEFAULT_WIDGET_MANIFEST;
}

/**
 * Примечание по автоматической регистрации виджетов:
 * 
 * В будущем можно реализовать автоматическую регистрацию виджетов
 * с использованием webpack context или других инструментов сборки.
 * Это позволит добавлять новые виджеты без необходимости явной регистрации.
 * 
 * Пример реализации с webpack:
 * const widgetContext = require.context('./', true, /manifest\.ts$/);
 * const widgetManifests = widgetContext.keys().map(key => widgetContext(key).default);
 */

// Функция для динамического импорта компонента виджета
export async function getWidgetComponent(type: string) {
  try {
    // Преобразуем первую букву типа в верхний регистр для соответствия имени файла
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    
    // Специальная обработка для виджета часов
    if (type === 'clock') {
      console.log('Загрузка виджета часов из новой структуры директорий');
      const module = await import('./Clock');
      return module.default;
    }
    
    // Обработка остальных виджетов
    console.log(`Загрузка виджета типа ${type} из стандартной структуры`);
    const module = await import(`./${capitalizedType}Widget`);
    return module.default;
  } catch (error) {
    console.error(`Ошибка при загрузке виджета типа ${type}:`, error);
    console.error('Детали ошибки:', error instanceof Error ? error.message : String(error));
    
    // В случае ошибки возвращаем базовый шаблон виджета
    try {
      const fallbackModule = await import('./widget-template');
      return fallbackModule.default;
    } catch (fallbackError) {
      console.error('Не удалось загрузить даже базовый шаблон виджета:', fallbackError);
      return null;
    }
  }
}