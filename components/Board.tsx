"use client"

import { useState, useCallback, useRef, useEffect, Suspense } from "react"
import { useDrop, DropTargetMonitor } from "react-dnd"
import type { Widget } from "../types/Widget"
import AddWidgetButton from "./AddWidgetButton"
import WidgetContainer from "./WidgetContainer"
import dynamic from "next/dynamic"
import { widgetManifests, getWidgetManifest } from "@/widgets"
import { boardService } from "@/services/BoardService"

interface BoardProps {
  isDarkMode?: boolean;
}

const GRID_SIZE = 20

// Кэш для динамически загруженных компонентов виджетов
const widgetComponentsCache: Record<string, React.ComponentType<any>> = {};

// Функция для динамической загрузки компонента виджета
const loadWidgetComponent = (type: string) => {
  if (!widgetComponentsCache[type]) {
    // Преобразуем первую букву типа в верхний регистр для соответствия имени файла
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    widgetComponentsCache[type] = dynamic(
      () => import(`@/widgets/${capitalizedType}Widget`).catch(() => import('@/widgets/widget-template')),
      { 
        loading: () => <div className="h-full flex items-center justify-center text-gray-400">Загрузка...</div>,
        ssr: false
      }
    );
  }
  return widgetComponentsCache[type];
};

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
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true)
  
  // Ref для доски
  const boardRef = useRef<HTMLDivElement | null>(null)
  
  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Загружаем данные из хранилища
        await boardService.load();
        
        // Получаем виджеты
        const loadedWidgets = boardService.getWidgets();
        setWidgets(loadedWidgets);
        
        // Получаем настройки доски
        const settings = boardService.getBoardSettings();
        if (settings) {
          // Здесь можно применить настройки доски, например, размер сетки
          // setGridSize(settings.gridSize);
        }
      } catch (error) {
        console.error('Error loading board data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Очистка при размонтировании
    return () => {
      boardService.destroy();
    };
  }, []);
  
  // Функция для размещения виджета на доске
  const placeWidget = useCallback(async (widget: Widget) => {
    try {
      // Добавляем виджет в состояние
      setWidgets(prev => [...prev, widget]);
      
      // Сохраняем виджет в хранилище
      await boardService.addWidget(widget);
      
      // Сбрасываем состояние перетаскиваемого виджета
      setDraggedWidget(null);
    } catch (error) {
      console.error('Error placing widget:', error);
    }
  }, []);
  
  // Функция для добавления виджета
  const addWidget = useCallback((type: string) => {
    // Получаем манифест виджета
    const manifest = getWidgetManifest(type);
    
    const newWidget: Widget = {
      id: Date.now(),
      type,
      position: { x: GRID_SIZE, y: GRID_SIZE },
      size: manifest.defaultSize,
      minSize: manifest.minSize,
      maxSize: manifest.maxSize,
      title: manifest.name,
      settings: {},
      lastUpdated: Date.now()
    }
    
    placeWidget(newWidget);
    setShowWidgetMenu(false);
  }, [placeWidget]);
  
  // Функция для удаления виджета
  const removeWidget = useCallback(async (id: number) => {
    try {
      // Удаляем виджет из состояния
      setWidgets(widgets => widgets.filter(widget => widget.id !== id));
      
      // Удаляем виджет из хранилища
      await boardService.removeWidget(id);
      
      // Закрываем настройки, если они открыты для удаляемого виджета
      if (activeSettingsId === id) {
        setActiveSettingsId(null);
      }
    } catch (error) {
      console.error('Error removing widget:', error);
    }
  }, [activeSettingsId]);
  
  // Функция для обновления виджета
  const updateWidget = useCallback(async (updatedWidget: Widget) => {
    try {
      // Обновляем виджет в состоянии
      setWidgets(prev => 
        prev.map(widget => 
          widget.id === updatedWidget.id ? {...updatedWidget, lastUpdated: Date.now()} : widget
        )
      );
      
      // Обновляем виджет в хранилище
      await boardService.updateWidget(updatedWidget);
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  }, []);
  
  // Функция для изменения размера виджета
  const handleResize = useCallback((widget: Widget, newSize: { width: number, height: number }) => {
    updateWidget({
      ...widget,
      size: newSize,
      lastUpdated: Date.now()
    });
  }, [updateWidget]);
  
  // Функция для открытия настроек виджета
  const handleSettingsOpen = useCallback((id: number) => {
    setActiveSettingsId(id);
  }, []);
  
  // Функция для закрытия настроек виджета
  const handleSettingsClose = useCallback(() => {
    setActiveSettingsId(null);
  }, []);
  
  // Настройка области для сброса (drop target)
  const [, drop] = useDrop(
    () => ({
      accept: "widget",
      drop: (item: Widget, monitor: DropTargetMonitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          const left = Math.max(0, Math.round((item.position.x + delta.x) / GRID_SIZE) * GRID_SIZE);
          const top = Math.max(0, Math.round((item.position.y + delta.y) / GRID_SIZE) * GRID_SIZE);
          
          updateWidget({
            ...item,
            position: { x: left, y: top },
            lastUpdated: Date.now()
          });
        }
      },
    }),
    [updateWidget]
  );
  
  // Применяем drop ref к доске
  useEffect(() => {
    drop(boardRef.current);
  }, [drop]);
  
  // Обработчик клика по доске для размещения нового виджета
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggedWidget) {
        const boardRect = e.currentTarget.getBoundingClientRect();
        const x = Math.round((e.clientX - boardRect.left) / GRID_SIZE) * GRID_SIZE;
        const y = Math.round((e.clientY - boardRect.top) / GRID_SIZE) * GRID_SIZE;
        
        placeWidget({
          ...draggedWidget,
          position: { x, y },
          lastUpdated: Date.now()
        });
      }
    },
    [draggedWidget, placeWidget]
  );

  // Функция для рендеринга содержимого виджета в зависимости от типа
  const renderWidgetContent = useCallback((widget: Widget) => {
    const WidgetComponent = loadWidgetComponent(widget.type);
    
    return (
      <Suspense fallback={<div className="h-full flex items-center justify-center text-gray-400">Загрузка...</div>}>
        <WidgetComponent
          widget={widget}
          updateWidget={updateWidget}
          removeWidget={removeWidget}
          isDarkMode={isDarkMode}
        />
      </Suspense>
    );
  }, [updateWidget, removeWidget, isDarkMode]);

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">Загрузка доски...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Основная доска с сеткой */}
      <div
        ref={boardRef}
        className={`w-full h-screen relative transition-colors duration-200 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
        style={{
          backgroundImage: `linear-gradient(${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px), 
             linear-gradient(90deg, ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.1)"} 1px, transparent 1px)`,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundPosition: `0 0`,
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
              {widgetManifests.map(manifest => (
                <button
                  key={manifest.id}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-md text-left dark:text-white"
                  onClick={() => addWidget(manifest.id)}
                >
                  {manifest.name}
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
              <h2 className="text-xl font-bold mb-4">Настройки виджета</h2>
              
              {/* Здесь будут отображаться настройки виджета */}
              <div className="mb-4">
                {/* Содержимое настроек */}
                <p className="text-gray-500 dark:text-gray-400">Настройки для этого виджета пока недоступны.</p>
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
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
  );
};

export default Board; 