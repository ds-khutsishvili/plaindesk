"use client"

/**
 * Индексный файл виджета часов
 * 
 * Экспортирует компонент виджета часов и его манифест.
 */

import ClockWidget from './ClockWidget';
import { CLOCK_WIDGET_MANIFEST } from './manifest';

// Экспортируем манифест
export { CLOCK_WIDGET_MANIFEST };

// Экспортируем компонент как дефолтный экспорт
export default ClockWidget; 