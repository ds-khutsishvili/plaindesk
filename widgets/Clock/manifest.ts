/**
 * Манифест виджета часов
 * 
 * Определяет метаданные и ограничения для виджета часов
 */

import { WidgetManifest } from '../../types/Widget';

/**
 * Манифест виджета часов
 */
export const CLOCK_WIDGET_MANIFEST: WidgetManifest = {
  id: 'clock',
  name: 'Часы',
  description: 'Виджет для отображения текущего времени и даты с поддержкой разных часовых поясов',
  minSize: { width: 100, height: 100 },
  maxSize: { width: 300, height: 300 },
  defaultSize: { width: 200, height: 200 },
  supportsDarkMode: true
}; 