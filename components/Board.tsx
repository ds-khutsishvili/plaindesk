"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useDrop, DropTargetMonitor } from "react-dnd"
import type { Widget } from "../types/Widget"
import AddWidgetButton from "./AddWidgetButton"
import WidgetContainer from "./WidgetContainer"
import dynamic from "next/dynamic"

// Динамический импорт виджетов
const TextWidget = dynamic(() => import("@/widgets/TextWidget"))

interface BoardProps {
  isDarkMode?: boolean;
}

const GRID_SIZE = 20
const TOP_OFFSET = 60

const Board: React.FC<BoardProps> = ({
  isDarkMode = false,
}) => {
  // Состояние для хранения виджетов
  const [widgets, setWidgets] = useState<Widget[]>([])
  
  // Состояние для отображения меню выбора виджетов
  const [showWidgetMenu, setShowWidgetMenu] = useState(false)
  
  // Состояние для отображения настроек виджета
  const [activeSettingsId, setActiveSettingsId] = useState<number | null>(null)
  
  // Состояние для нового виджета, который перетаскивается
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null)
  
  // Ref для доски
  const boardRef = useRef<HTMLDivElement | null>(null)
  
  // Функция для размещения виджета на доске
  const placeWidget = useCallback((widget: Widget) => {
    setWidgets(prev => [...prev, widget])
    setDraggedWidget(null)
  }, [])
  
  // Функция для добавления виджета
  const addWidget = useCallback((type: string) => {
    const newWidget: Widget = {
      id: Date.now(),
      type,
      position: { x: GRID_SIZE, y: TOP_OFFSET + GRID_SIZE },
      size: { width: 240, height: 160 },
      title: `Виджет ${type}`,
      settings: {}
    }
    placeWidget(newWidget)
    setShowWidgetMenu(false)
  }, [placeWidget])
  
  // Функция для удаления виджета
  const removeWidget = useCallback((id: number) => {
    setWidgets(widgets => widgets.filter(widget => widget.id !== id))
    if (activeSettingsId === id) {
      setActiveSettingsId(null)
    }
  }, [activeSettingsId])
  
  // Функция для обновления виджета
  const updateWidget = useCallback((updatedWidget: Widget) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === updatedWidget.id ? {...updatedWidget} : widget
      )
    )
  }, [])
  
  // Функция для изменения размера виджета
  const handleResize = useCallback((widget: Widget, newSize: { width: number, height: number }) => {
    console.log('Resize called with:', widget.id, newSize);
    updateWidget({
      ...widget,
      size: newSize
    })
  }, [updateWidget])
  
  // Функция для открытия настроек виджета
  const handleSettingsOpen = useCallback((id: number) => {
    setActiveSettingsId(id)
  }, [])
  
  // Функция для закрытия настроек виджета
  const handleSettingsClose = useCallback(() => {
    setActiveSettingsId(null)
  }, [])
  
  // Настройка области для сброса (drop target)
  const [, drop] = useDrop(
    () => ({
      accept: "widget",
      drop: (item: Widget, monitor: DropTargetMonitor) => {
        const delta = monitor.getDifferenceFromInitialOffset()
        if (delta) {
          const left = Math.max(0, Math.round((item.position.x + delta.x) / GRID_SIZE) * GRID_SIZE)
          const top = Math.max(TOP_OFFSET, Math.round((item.position.y + delta.y) / GRID_SIZE) * GRID_SIZE)
          updateWidget({ ...item, position: { x: left, y: top } })
        }
      },
    }),
    [updateWidget]
  )
  
  // Применяем drop ref к доске
  useEffect(() => {
    drop(boardRef.current)
  }, [drop])
  
  // Обработчик клика по доске для размещения нового виджета
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggedWidget) {
        const boardRect = e.currentTarget.getBoundingClientRect()
        const x = Math.round((e.clientX - boardRect.left) / GRID_SIZE) * GRID_SIZE
        const y = Math.max(TOP_OFFSET, Math.round((e.clientY - boardRect.top) / GRID_SIZE) * GRID_SIZE)
        placeWidget({ ...draggedWidget, position: { x, y } })
      }
    },
    [draggedWidget, placeWidget]
  )

  // Функция для рендеринга содержимого виджета в зависимости от типа
  const renderWidgetContent = useCallback((widget: Widget) => {
    switch (widget.type) {
      case 'text':
        return (
          <TextWidget
            widget={widget}
            updateWidget={updateWidget}
            removeWidget={removeWidget}
            isDarkMode={isDarkMode}
          />
        )
      default:
        return (
          <div className="h-full flex items-center justify-center text-gray-400">
            Виджет типа {widget.type}
          </div>
        )
    }
  }, [updateWidget, removeWidget, isDarkMode])

  // Доступные типы виджетов
  const widgetTypes = [
    { id: 'text', name: 'Текст' },
    { id: 'calendar', name: 'Календарь' },
    { id: 'clock', name: 'Часы' },
    { id: 'todo', name: 'Задачи' }
  ]

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Основная доска с сеткой */}
      <div
        ref={boardRef}
        className={`w-full h-screen overflow-hidden relative transition-colors duration-200 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
        style={{
          backgroundImage: `linear-gradient(${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px), 
             linear-gradient(90deg, ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px)`,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundPosition: `0 ${TOP_OFFSET}px`,
        }}
        onClick={handleClick}
      >
        {/* Отображаем все виджеты */}
        {widgets.map((widget) => (
          <WidgetContainer 
            key={widget.id} 
            widget={widget} 
            isDarkMode={isDarkMode}
            onResize={handleResize}
            onRemove={removeWidget}
            onSettingsOpen={handleSettingsOpen}
            updateWidget={updateWidget}
          >
            {renderWidgetContent(widget)}
          </WidgetContainer>
        ))}
        
        {/* Отображаем "призрак" перетаскиваемого виджета */}
        {draggedWidget && (
          <div 
            className="absolute pointer-events-none opacity-70"
            style={{
              left: `${draggedWidget.position.x}px`,
              top: `${draggedWidget.position.y}px`,
              width: `${draggedWidget.size.width}px`,
              height: `${draggedWidget.size.height}px`,
            }}
          >
            <WidgetContainer 
              widget={draggedWidget} 
              isDarkMode={isDarkMode}
              isPreview={true}
            >
              {renderWidgetContent(draggedWidget)}
            </WidgetContainer>
          </div>
        )}
        
        {/* Кнопка добавления виджета в правом нижнем углу */}
        <AddWidgetButton 
          onClick={() => setShowWidgetMenu(true)} 
        />
        
        {/* Меню выбора виджетов */}
        {showWidgetMenu && (
          <div className="fixed bottom-20 right-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
            <div className="text-lg font-medium mb-2 dark:text-white">Выберите виджет</div>
            <div className="flex flex-col space-y-2">
              {widgetTypes.map(type => (
                <button
                  key={type.id}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-md text-left dark:text-white"
                  onClick={() => addWidget(type.id)}
                >
                  {type.name}
                </button>
              ))}
            </div>
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowWidgetMenu(false)}
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Модальное окно настроек виджета */}
        {activeSettingsId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="text-xl font-medium mb-4">Настройки виджета</div>
              <div className="mb-4">
                <label className="block mb-2">Заголовок</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  value={widgets.find(w => w.id === activeSettingsId)?.title || ''}
                  onChange={(e) => {
                    const widget = widgets.find(w => w.id === activeSettingsId)
                    if (widget) {
                      updateWidget({
                        ...widget,
                        title: e.target.value
                      })
                    }
                  }}
                />
              </div>
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  onClick={handleSettingsClose}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Board 