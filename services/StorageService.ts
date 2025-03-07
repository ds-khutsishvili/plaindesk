/**
 * Абстрактный интерфейс для работы с хранилищем данных
 * Позволяет абстрагироваться от конкретной реализации (localStorage, IndexedDB, NoSQL и т.д.)
 */
export interface StorageService {
  /**
   * Получить данные по ключу
   * @param key Ключ для получения данных
   * @returns Данные или null, если данные не найдены
   */
  get<T>(key: string): Promise<T | null>;
  
  /**
   * Сохранить данные по ключу
   * @param key Ключ для сохранения данных
   * @param data Данные для сохранения
   */
  set<T>(key: string, data: T): Promise<void>;
  
  /**
   * Удалить данные по ключу
   * @param key Ключ для удаления данных
   */
  remove(key: string): Promise<void>;
  
  /**
   * Проверить наличие данных по ключу
   * @param key Ключ для проверки
   * @returns true, если данные существуют, иначе false
   */
  has(key: string): Promise<boolean>;
  
  /**
   * Очистить все данные
   */
  clear(): Promise<void>;
  
  /**
   * Получить все ключи, соответствующие шаблону
   * @param pattern Шаблон для поиска ключей (например, "plaindesk_*")
   * @returns Массив ключей
   */
  keys(pattern?: string): Promise<string[]>;
}

/**
 * Реализация StorageService для работы с localStorage
 */
export class LocalStorageService implements StorageService {
  private readonly prefix: string;
  
  /**
   * Создать экземпляр LocalStorageService
   * @param prefix Префикс для ключей в localStorage (для изоляции данных)
   */
  constructor(prefix: string = 'plaindesk_') {
    this.prefix = prefix;
  }
  
  /**
   * Получить полный ключ с префиксом
   * @param key Исходный ключ
   * @returns Ключ с префиксом
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }
  
  /**
   * Получить данные по ключу из localStorage
   * @param key Ключ для получения данных
   * @returns Данные или null, если данные не найдены
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key);
      const data = localStorage.getItem(fullKey);
      
      if (data === null) {
        return null;
      }
      
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  }
  
  /**
   * Сохранить данные по ключу в localStorage
   * @param key Ключ для сохранения данных
   * @param data Данные для сохранения
   */
  async set<T>(key: string, data: T): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      const serializedData = JSON.stringify(data);
      localStorage.setItem(fullKey, serializedData);
    } catch (error) {
      console.error(`Error setting data for key ${key}:`, error);
      throw error;
    }
  }
  
  /**
   * Удалить данные по ключу из localStorage
   * @param key Ключ для удаления данных
   */
  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  }
  
  /**
   * Проверить наличие данных по ключу в localStorage
   * @param key Ключ для проверки
   * @returns true, если данные существуют, иначе false
   */
  async has(key: string): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key);
      return localStorage.getItem(fullKey) !== null;
    } catch (error) {
      console.error(`Error checking data for key ${key}:`, error);
      return false;
    }
  }
  
  /**
   * Очистить все данные с указанным префиксом из localStorage
   */
  async clear(): Promise<void> {
    try {
      const keys = await this.keys();
      for (const key of keys) {
        await this.remove(key);
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
  
  /**
   * Получить все ключи из localStorage, соответствующие шаблону
   * @param pattern Шаблон для поиска ключей (например, "board_*")
   * @returns Массив ключей без префикса
   */
  async keys(pattern?: string): Promise<string[]> {
    try {
      const keys: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && key.startsWith(this.prefix)) {
          const keyWithoutPrefix = key.slice(this.prefix.length);
          
          if (!pattern || this.matchesPattern(keyWithoutPrefix, pattern)) {
            keys.push(keyWithoutPrefix);
          }
        }
      }
      
      return keys;
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }
  
  /**
   * Проверить, соответствует ли ключ шаблону
   * @param key Ключ для проверки
   * @param pattern Шаблон (поддерживает * в конце)
   * @returns true, если ключ соответствует шаблону, иначе false
   */
  private matchesPattern(key: string, pattern: string): boolean {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return key.startsWith(prefix);
    }
    
    return key === pattern;
  }
}

// Экспортируем экземпляр сервиса для использования в приложении
export const storageService = new LocalStorageService(); 