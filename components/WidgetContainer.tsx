"use client"

import { useRef, useState, useEffect, ReactNode } from "react"
import { useDrag, DragSourceMonitor } from "react-dnd"
import type { Widget } from "@/types/Widget"

interface WidgetContainerProps {
  widget: Widget
  isDarkMode?: boolean
  isPreview?: boolean
  onResize?: (widget: Widget, newSize: { width: number, height: number }) => void
  onRemove?: (id: number) => void
  onSettingsOpen?: (id: number) => void
  updateWidget?: (widget: Widget) => void
  children?: ReactNode
}

const GRID_SIZE = 20
const MIN_WIDTH = 100
const MIN_HEIGHT = 80

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
  const [isHovered, setIsHovered] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [startResizePos, setStartResizePos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  
  // Ref для кнопки перетаскивания
  const dragHandleRef = useRef<HTMLDivElement | null>(null)
  
  // Ref для основного контейнера
  const containerRef = useRef<HTMLDivElement | null>(null)
  
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
  
  // Применяем refs с помощью useEffect
  useEffect(() => {
    dragPreview(containerRef.current)
  }, [dragPreview, containerRef])
  
  // Стили для контейнера
  const style = {
    width: `${widget.size.width}px`,
    height: `${widget.size.height}px`,
    position: "absolute" as const,
    left: `${widget.position.x}px`,
    top: `${widget.position.y}px`,
    opacity: isDragging ? 0.5 : (isPreview ? 0.7 : 1),
    zIndex: isDragging ? 1000 : (isPreview ? 1000 : (isResizing ? 100 : 1)),
  }

  // Обработчик начала изменения размера
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setStartResizePos({ x: e.clientX, y: e.clientY })
    setStartSize({ width: widget.size.width, height: widget.size.height })
    
    // Добавляем обработчики событий на документ
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
  }
  
  // Обработчик движения мыши при изменении размера
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return
    
    const deltaX = e.clientX - startResizePos.x
    const deltaY = e.clientY - startResizePos.y
    
    // Рассчитываем новый размер с привязкой к сетке
    const newWidth = Math.max(
      MIN_WIDTH, 
      Math.round((startSize.width + deltaX) / GRID_SIZE) * GRID_SIZE
    )
    const newHeight = Math.max(
      MIN_HEIGHT, 
      Math.round((startSize.height + deltaY) / GRID_SIZE) * GRID_SIZE
    )
    
    // Вызываем колбэк для обновления размера
    if (onResize) {
      onResize(widget, { width: newWidth, height: newHeight })
    }
  }
  
  // Обработчик окончания изменения размера
  const handleResizeEnd = () => {
    setIsResizing(false)
    
    // Удаляем обработчики событий с документа
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }
  
  // Очистка обработчиков при размонтировании
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
    }
  }, [isResizing])
  
  // Применяем dragPreview к основному контейнеру и drag к кнопке перетаскивания
  return (
    <div
      ref={containerRef}
      style={style}
      className={`rounded-lg shadow-sm transition-all duration-200 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H6V8H8V6Z" fill="currentColor" />
              <path d="M8 11H6V13H8V11Z" fill="currentColor" />
              <path d="M8 16H6V18H8V16Z" fill="currentColor" />
              <path d="M13 6H11V8H13V6Z" fill="currentColor" />
              <path d="M13 11H11V13H13V11Z" fill="currentColor" />
              <path d="M13 16H11V18H13V16Z" fill="currentColor" />
              <path d="M18 6H16V8H18V6Z" fill="currentColor" />
              <path d="M18 11H16V13H18V11Z" fill="currentColor" />
              <path d="M18 16H16V18H18V16Z" fill="currentColor" />
            </svg>
          </div>
          
          {/* Кнопки управления */}
          <div className="absolute top-2 right-2 flex space-x-2">
            {/* Кнопка удаления */}
            <button 
              className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-70 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                if (onRemove) onRemove(widget.id)
              }}
            >
              ✕
            </button>
            
            {/* Кнопка настроек */}
            <button 
              className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center opacity-70 hover:opacity-100 dark:bg-gray-700 dark:text-gray-200"
              onClick={(e) => {
                e.stopPropagation()
                if (onSettingsOpen) onSettingsOpen(widget.id)
              }}
            >
              ⚙
            </button>
          </div>
        </>
      )}
      
      {/* Элемент изменения размера (виден только при наведении) */}
      {isHovered && !isPreview && (
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-end justify-end"
          onMouseDown={handleResizeStart}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path 
              d="M0 10L10 10L10 0" 
              fill="none" 
              stroke={isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"} 
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export default WidgetContainer 