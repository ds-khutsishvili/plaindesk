/**
 * Создает дебаунсированную функцию, которая откладывает вызов функции fn до тех пор,
 * пока не пройдет указанное время с момента последнего вызова дебаунсированной функции.
 * 
 * @param fn Функция для дебаунсинга
 * @param wait Время ожидания в миллисекундах
 * @returns Дебаунсированная функция
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null;
  let resolveList: Array<(value: ReturnType<T>) => void> = [];
  let rejectList: Array<(reason: any) => void> = [];
  
  return function(this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      // Добавляем функции resolve и reject в списки
      resolveList.push(resolve);
      rejectList.push(reject);
      
      // Очищаем предыдущий таймаут
      if (timeout) {
        clearTimeout(timeout);
      }
      
      // Устанавливаем новый таймаут
      timeout = setTimeout(() => {
        timeout = null;
        
        // Сохраняем текущие списки и очищаем их
        const currentResolveList = [...resolveList];
        const currentRejectList = [...rejectList];
        resolveList = [];
        rejectList = [];
        
        try {
          // Вызываем функцию и разрешаем все промисы с результатом
          const result = fn.apply(this, args);
          currentResolveList.forEach(resolve => resolve(result));
        } catch (error) {
          // В случае ошибки отклоняем все промисы
          currentRejectList.forEach(reject => reject(error));
        }
      }, wait);
    });
  };
} 