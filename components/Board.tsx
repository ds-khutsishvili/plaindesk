"use client"

import { useState, useCallback } from "react"
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { snapCenterToCursor } from "@dnd-kit/modifiers"
import type { Widget } from "../types/Widget"
import AddWidgetButton from "./AddWidgetButton"
import WidgetContainer from "./WidgetContainer"

interface BoardProps {
  isDarkMode?: boolean;
}

const GRID_SIZE = 20
const TOP_OFFSET = 64

const Board: React.FC<BoardProps> = ({
  isDarkMode = false,
}) => {
  // В MVP версии пока работаем с пустым массивом виджетов
  const [widgets, setWidgets] = useState<Widget[]>([])
  
  // Состояние для отслеживания перетаскиваемого виджета
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null)
  
  // Настройка сенсоров для dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Минимальное расстояние для активации перетаскивания
      },
    })
  )
  
  // Функция для добавления будущих виджетов 
  const addWidget = (widget: Widget) => {
    setWidgets([...widgets, widget])
  }

  // Функция для удаления виджета
  const removeWidget = (id: number) => {
    setWidgets(widgets.filter(widget => widget.id !== id))
  }

  // Обработчик начала перетаскивания
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const widgetId = Number(active.id)
    const draggedWidget = widgets.find(widget => widget.id === widgetId) || null
    setActiveWidget(draggedWidget)
  }

  // Обработчик окончания перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta, over } = event
    
    if (activeWidget) {
      // Обновляем позицию виджета с учетом сетки
      const newX = Math.round((activeWidget.position.x + delta.x) / GRID_SIZE) * GRID_SIZE
      const newY = Math.max(TOP_OFFSET, Math.round((activeWidget.position.y + delta.y) / GRID_SIZE) * GRID_SIZE)
      
      // Обновляем виджет в массиве
      setWidgets(widgets.map(widget => 
        widget.id === activeWidget.id 
          ? { ...widget, position: { x: newX, y: newY } } 
          : widget
      ))
    }
    
    setActiveWidget(null)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Основная доска с сеткой */}
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[snapCenterToCursor]}
      >
        <div
          className={`w-full h-screen overflow-hidden relative transition-colors duration-200 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
          style={{
            backgroundImage: `linear-gradient(${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px), 
               linear-gradient(90deg, ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px)`,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            backgroundPosition: `0 ${TOP_OFFSET}px`,
          }}
        >
          {/* Отображаем все виджеты */}
          {widgets.map((widget) => (
            <WidgetContainer 
              key={widget.id} 
              widget={widget} 
              isDarkMode={isDarkMode}
            />
          ))}
          
          {/* Отображаем превью перетаскиваемого виджета */}
          {activeWidget && (
            <WidgetContainer 
              widget={activeWidget} 
              isDarkMode={isDarkMode}
              isPreview={true}
            />
          )}
          
          {/* Кнопка добавления виджета в правом нижнем углу */}
          <AddWidgetButton 
            onClick={() => {
              // Пример добавления тестового виджета
              const newWidget: Widget = {
                id: Date.now(),
                type: "test",
                position: { x: 100, y: 100 },
                size: { width: 200, height: 150 },
                title: "Тестовый виджет"
              }
              addWidget(newWidget)
            }} 
          />
        </div>
      </DndContext>
    </div>
  )
}

export default Board 