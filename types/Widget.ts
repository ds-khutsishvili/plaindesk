export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WidgetManifest {
  id: string;                // Уникальный идентификатор типа виджета
  name: string;              // Отображаемое имя виджета
  description: string;       // Описание виджета
  minSize: Size;             // Минимальный размер виджета
  maxSize: Size;             // Максимальный размер виджета
  defaultSize: Size;         // Размер виджета по умолчанию
  supportsDarkMode?: boolean; // Поддерживает ли виджет темную тему
  icon?: string;             // Иконка виджета (опционально)
}

export interface Widget {
  id: number;
  type: string;
  position: Position;
  size: Size;
  minSize?: Size;
  maxSize?: Size;
  title?: string;
  content?: any;
  settings?: Record<string, any>;
  lastUpdated?: number;      // Время последнего обновления виджета
  isSettingsOpen?: boolean;  // Флаг открытия настроек
} 