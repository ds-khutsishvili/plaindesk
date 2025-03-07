import { storageService } from './StorageService';
import type { Widget } from '@/types/Widget';
import { debounce } from '@/utils/debounce';

// Интерфейс для настроек доски
export interface BoardSettings {
  theme: 'light' | 'dark';
  gridSize: number;
  // Другие настройки доски
}

// Интерфейс для данных доски
export interface BoardData {
  id: string;
  lastUpdated: number;
  settings: BoardSettings;
}

// Интерфейс для коллекции виджетов
export interface WidgetsCollection {
  [id: string]: Widget;
}

/**
 * Сервис для управления состоянием доски и виджетов
 */
export class BoardService {
  private boardId: string;
  private boardData: BoardData | null = null;
  private widgets: WidgetsCollection = {};
  private saveTimeout: NodeJS.Timeout | null = null;
  
  // Ключи для хранения данных
  private get boardKey() {
    return `board_${this.boardId}`;
  }
  
  private get widgetsKey() {
    return `widgets_${this.boardId}`;
  }
  
  /**
   * Создать экземпляр BoardService
   * @param boardId ID доски (по умолчанию "default")
   */
  constructor(boardId: string = 'default') {
    this.boardId = boardId;
    
    // Настройка обработчика события beforeunload для сохранения данных перед закрытием страницы
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.saveImmediately);
    }
    
    // Настройка периодического сохранения (каждые 30 секунд)
    this.startPeriodicSave();
  }
  
  /**
   * Загрузить данные доски и виджетов из хранилища
   */
  async load(): Promise<void> {
    try {
      // Загрузка данных доски
      const boardData = await storageService.get<BoardData>(this.boardKey);
      
      if (boardData) {
        this.boardData = boardData;
      } else {
        // Если данные не найдены, создаем новую доску с настройками по умолчанию
        this.boardData = this.createDefaultBoardData();
        await this.saveBoardData();
      }
      
      // Загрузка виджетов
      const widgets = await storageService.get<WidgetsCollection>(this.widgetsKey);
      
      if (widgets) {
        this.widgets = widgets;
      } else {
        this.widgets = {};
        await this.saveWidgets();
      }
    } catch (error) {
      console.error('Error loading board data:', error);
      // В случае ошибки создаем новую доску с настройками по умолчанию
      this.boardData = this.createDefaultBoardData();
      this.widgets = {};
    }
  }
  
  /**
   * Создать данные доски по умолчанию
   */
  private createDefaultBoardData(): BoardData {
    return {
      id: this.boardId,
      lastUpdated: Date.now(),
      settings: {
        theme: 'light',
        gridSize: 20,
      },
    };
  }
  
  /**
   * Получить настройки доски
   */
  getBoardSettings(): BoardSettings | null {
    return this.boardData?.settings || null;
  }
  
  /**
   * Обновить настройки доски
   * @param settings Новые настройки
   */
  async updateBoardSettings(settings: Partial<BoardSettings>): Promise<void> {
    if (!this.boardData) {
      this.boardData = this.createDefaultBoardData();
    }
    
    this.boardData.settings = {
      ...this.boardData.settings,
      ...settings,
    };
    
    this.boardData.lastUpdated = Date.now();
    
    await this.scheduleSave();
  }
  
  /**
   * Получить все виджеты
   */
  getWidgets(): Widget[] {
    return Object.values(this.widgets);
  }
  
  /**
   * Получить виджет по ID
   * @param id ID виджета
   */
  getWidget(id: number): Widget | null {
    return this.widgets[`widget_${id}`] || null;
  }
  
  /**
   * Добавить виджет
   * @param widget Виджет для добавления
   */
  async addWidget(widget: Widget): Promise<void> {
    this.widgets[`widget_${widget.id}`] = {
      ...widget,
      lastUpdated: Date.now(),
    };
    
    await this.scheduleSave();
  }
  
  /**
   * Обновить виджет
   * @param widget Обновленный виджет
   */
  async updateWidget(widget: Widget): Promise<void> {
    const existingWidget = this.getWidget(widget.id);
    
    if (!existingWidget) {
      throw new Error(`Widget with id ${widget.id} not found`);
    }
    
    this.widgets[`widget_${widget.id}`] = {
      ...widget,
      lastUpdated: Date.now(),
    };
    
    await this.scheduleSave();
  }
  
  /**
   * Удалить виджет
   * @param id ID виджета
   */
  async removeWidget(id: number): Promise<void> {
    delete this.widgets[`widget_${id}`];
    await this.scheduleSave();
  }
  
  /**
   * Запланировать сохранение данных с дебаунсингом
   */
  private scheduleSave = debounce(async () => {
    await this.saveImmediately();
  }, 300);
  
  /**
   * Немедленно сохранить все данные
   */
  private saveImmediately = async (): Promise<void> => {
    await Promise.all([
      this.saveBoardData(),
      this.saveWidgets(),
    ]);
  };
  
  /**
   * Сохранить данные доски
   */
  private async saveBoardData(): Promise<void> {
    if (this.boardData) {
      await storageService.set(this.boardKey, this.boardData);
    }
  }
  
  /**
   * Сохранить виджеты
   */
  private async saveWidgets(): Promise<void> {
    await storageService.set(this.widgetsKey, this.widgets);
  }
  
  /**
   * Запустить периодическое сохранение
   */
  private startPeriodicSave(): void {
    if (typeof window !== 'undefined') {
      this.saveTimeout = setInterval(() => {
        this.saveImmediately();
      }, 30000); // 30 секунд
    }
  }
  
  /**
   * Остановить периодическое сохранение
   */
  private stopPeriodicSave(): void {
    if (this.saveTimeout) {
      clearInterval(this.saveTimeout);
      this.saveTimeout = null;
    }
  }
  
  /**
   * Очистить ресурсы при уничтожении сервиса
   */
  destroy(): void {
    this.stopPeriodicSave();
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.saveImmediately);
    }
  }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const boardService = new BoardService(); 