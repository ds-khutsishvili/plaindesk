"use client"

/**
 * Компонент-контейнер для виджетов
 * 
 * Обеспечивает функциональность перетаскивания, изменения размера и
 * отображения элементов управления для всех виджетов.
 */

import { useRef, useState, useEffect, ReactNode, useCallback } from "react"
import { useDrag, DragSourceMonitor } from "react-dnd"
import type { Widget } from "@/types/Widget"
import { X, Settings, GripVertical } from "lucide-react"

interface WidgetContainerProps {
  widget: Widget                                                    // Данные виджета
  isDarkMode?: boolean                                              // Флаг темного режима
  isPreview?: boolean                                               // Флаг предпросмотра (при перетаскивании)
  onResize?: (widget: Widget, newSize: { width: number, height: number }) => void  // Обработчик изменения размера
  onRemove?: (id: number) => void                                   // Обработчик удаления
  onSettingsOpen?: (id: number) => void                             // Обработчик открытия настроек
  updateWidget?: (widget: Widget) => void                           // Обработчик обновления данных виджета
  children?: ReactNode                                              // Содержимое виджета
}

// Константы для размеров сетки и ограничений размера по умолчанию
const GRID_SIZE = 20
const DEFAULT_MIN_WIDTH = 100
const DEFAULT_MIN_HEIGHT = 80
const DEFAULT_MAX_WIDTH = 800
const DEFAULT_MAX_HEIGHT = 600

/**
 * Компонент-контейнер для виджетов
 */
const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widget,
  isDarkMode = false,
  isPreview = false,
  onResize,
  onRemove,
  onSettingsOpen,
  updateWidget,
  children
}) => {
  // Состояния для взаимодействия с виджетом
  const [isHovered, setIsHovered] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [startResizePos, setStartResizePos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  
  // Определяем минимальный и максимальный размер виджета
  const minWidth = widget.minSize?.width || DEFAULT_MIN_WIDTH
  const minHeight = widget.minSize?.height || DEFAULT_MIN_HEIGHT
  const maxWidth = widget.maxSize?.width || DEFAULT_MAX_WIDTH
  const maxHeight = widget.maxSize?.height || DEFAULT_MAX_HEIGHT
  
  // Refs для DOM-элементов
  const dragHandleRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  
  // ===== Функциональность перетаскивания (Drag & Drop) =====
  
  // Настройка перетаскивания с помощью react-dnd
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "widget",
      item: () => ({ ...widget }),
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: !isPreview && !isResizing,
    }),
    [widget, isPreview, isResizing]
  )
  
  // Применяем dragPreview к основному контейнеру
  useEffect(() => {
    dragPreview(containerRef.current)
  }, [dragPreview, containerRef])
  
  // ===== Функциональность изменения размера =====
  
  // Обработчик движения мыши при изменении размера
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startResizePos.x;
    const deltaY = e.clientY - startResizePos.y;
    
    // Применяем ограничения минимального и максимального размера
    const newWidth = Math.min(
      maxWidth,
      Math.max(
        minWidth, 
        Math.round((startSize.width + deltaX) / GRID_SIZE) * GRID_SIZE
      )
    );
    
    const newHeight = Math.min(
      maxHeight,
      Math.max(
        minHeight, 
        Math.round((startSize.height + deltaY) / GRID_SIZE) * GRID_SIZE
      )
    );
    
    // Вызываем колбэк для обновления размера
    if (onResize) {
      onResize(widget, { width: newWidth, height: newHeight });
    } else {
      console.warn('onResize callback is not provided for widget:', widget.id);
    }
  };
  
  // Обработчик окончания изменения размера
  const handleResizeEnd = () => {
    setIsResizing(false);
    
    // Удаляем обработчики событий с документа
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };
  
  // Обработчик начала изменения размера
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setStartResizePos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: widget.size.width, height: widget.size.height });
    
    // Добавляем обработчики событий для отслеживания движения мыши и отпускания кнопки
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  // Создаем функцию handleResizeMove и handleResizeEnd только один раз с помощью useRef
  const handleResizeMoveRef = useRef(handleResizeMove);
  const handleResizeEndRef = useRef(handleResizeEnd);
  
  // Обновляем ссылки на функции при изменении зависимостей
  useEffect(() => {
    handleResizeMoveRef.current = handleResizeMove;
    handleResizeEndRef.current = handleResizeEnd;
  }, [widget, minWidth, minHeight, maxWidth, maxHeight, onResize, isResizing, startResizePos, startSize]);
  
  // Обертки для обработчиков событий, которые используют актуальные ссылки на функции
  const handleResizeMoveWrapper = useCallback((e: MouseEvent) => {
    handleResizeMoveRef.current(e);
  }, []);
  
  const handleResizeEndWrapper = useCallback(() => {
    handleResizeEndRef.current();
  }, []);
  
  // Обработчик начала изменения размера с использованием обертки
  const handleResizeStartWithWrapper = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setStartResizePos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: widget.size.width, height: widget.size.height });
    
    // Добавляем обработчики событий для отслеживания движения мыши и отпускания кнопки
    document.addEventListener('mousemove', handleResizeMoveWrapper);
    document.addEventListener('mouseup', handleResizeEndWrapper);
  }, [widget, handleResizeMoveWrapper, handleResizeEndWrapper]);
  
  // Очистка обработчиков при размонтировании компонента
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMoveWrapper);
      document.removeEventListener('mouseup', handleResizeEndWrapper);
    };
  }, [handleResizeMoveWrapper, handleResizeEndWrapper]);
  
  // ===== Стили и рендеринг =====
  
  // Стили для контейнера
  const style = {
    width: `${widget.size.width}px`,
    height: `${widget.size.height}px`,
    position: "absolute" as const,
    left: `${widget.position.x}px`,
    top: `${widget.position.y}px`,
    opacity: isDragging ? 0.5 : (isPreview ? 0.7 : 1),
    zIndex: isDragging ? 1000 : (isPreview ? 1000 : (isResizing ? 100 : 1)),
    cursor: isResizing ? 'nwse-resize' : 'default',
  }
  
  // Обработчики событий наведения мыши
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  // Обработчики для кнопок управления
  const handleRemoveClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove(widget.id);
  }, [onRemove, widget.id]);
  
  const handleSettingsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSettingsOpen) onSettingsOpen(widget.id);
  }, [onSettingsOpen, widget.id]);
  
  return (
    <div
      ref={containerRef}
      style={style}
      className={`rounded-lg shadow-sm transition-all duration-200 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Содержимое виджета */}
      <div className="p-4 h-full">
        {children}
      </div>
      
      {/* Элементы управления (видны только при наведении) */}
      {isHovered && !isPreview && (
        <>
          {/* Кнопка перетаскивания */}
          <div 
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center opacity-70 hover:opacity-100 cursor-move dark:bg-gray-700 dark:text-gray-200"
            ref={(node) => {
              dragHandleRef.current = node;
              drag(node);
            }}
          >
            <GripVertical size={14} />
          </div>
          
          {/* Кнопки управления */}
          <div className="absolute top-2 right-2 flex space-x-2">
            {/* Кнопка настроек */}
            <button 
              className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center opacity-70 hover:opacity-100 dark:bg-gray-700 dark:text-gray-200"
              onClick={handleSettingsClick}
            >
              <Settings size={14} />
            </button>
            
            {/* Кнопка удаления */}
            <button 
              className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-70 hover:opacity-100"
              onClick={handleRemoveClick}
            >
              <X size={14} />
            </button>
          </div>
          
          {/* Элемент для изменения размера */}
          <div 
            className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize"
            onMouseDown={handleResizeStartWithWrapper}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-1 right-1"
            >
              <path d="M22 22L12 22L22 12L22 22Z" fill={isDarkMode ? "white" : "black"} fillOpacity="0.7" />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}

export default WidgetContainer 