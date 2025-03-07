"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import type { Widget } from "@/types/Widget"

interface WidgetContainerProps {
  widget: Widget
  isDarkMode?: boolean
  isPreview?: boolean
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widget,
  isDarkMode = false,
  isPreview = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Настройка перетаскивания с помощью dnd-kit
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: String(widget.id),
    data: widget,
    disabled: isPreview,
  })
  
  // Стили для перетаскивания
  const style = {
    transform: CSS.Translate.toString(transform),
    width: `${widget.size.width}px`,
    height: `${widget.size.height}px`,
    position: "absolute" as const,
    left: `${widget.position.x}px`,
    top: `${widget.position.y}px`,
    opacity: isPreview ? 0.7 : 1,
    zIndex: isPreview ? 1000 : 1,
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg shadow-sm p-4 transition-all duration-200 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
      {/* Заголовок виджета */}
      {widget.title && (
        <div className="text-lg font-medium mb-2">{widget.title}</div>
      )}
      
      {/* Содержимое виджета */}
      <div className="flex-1">
        {widget.content || (
          <div className="h-full flex items-center justify-center text-gray-400">
            Контент виджета
          </div>
        )}
      </div>
      
      {/* Элементы управления (видны только при наведении) */}
      {isHovered && !isPreview && (
        <div className="absolute top-2 right-2 flex space-x-2">
          {/* Кнопка удаления */}
          <button 
            className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              console.log("Удаление виджета", widget.id)
            }}
          >
            ✕
          </button>
          
          {/* Кнопка настроек */}
          <button 
            className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center opacity-70 hover:opacity-100 dark:bg-gray-700 dark:text-gray-200"
            onClick={(e) => {
              e.stopPropagation()
              console.log("Настройки виджета", widget.id)
            }}
          >
            ⚙
          </button>
        </div>
      )}
      
      {/* Элемент изменения размера (виден только при наведении) */}
      {isHovered && !isPreview && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => {
            e.stopPropagation()
            console.log("Изменение размера виджета", widget.id)
          }}
        />
      )}
    </div>
  )
}

export default WidgetContainer 