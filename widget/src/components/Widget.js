import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const Widget = ({ id, x, y, width, height, onMove, onResize, onRemove, headerHeight = 64, standalone = false }) => {
  // Grid cell size in pixels
  const CELL_SIZE = 20;
  
  // State to track if widget is being dragged or resized
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  // State for the clock
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // State for settings modal
  const [showSettings, setShowSettings] = useState(false);
  
  // Ref для измерения содержимого
  const contentRef = useRef(null);
  
  // Фиксированные минимальные размеры для виджета часов
  const MIN_WIDTH_CELLS = 6; // Минимальная ширина в ячейках
  const MIN_HEIGHT_CELLS = 5; // Минимальная высота в ячейках
  
  // Фиксированные минимальные размеры в пикселях
  const MIN_WIDTH = MIN_WIDTH_CELLS * CELL_SIZE;
  const MIN_HEIGHT = MIN_HEIGHT_CELLS * CELL_SIZE;
  
  // Максимальные размеры (в 3 раза больше минимальных)
  const MAX_WIDTH = MIN_WIDTH * 3;
  const MAX_HEIGHT = MIN_HEIGHT * 3;
  
  // Local storage key for widget settings
  const WIDGET_SETTINGS_KEY = `widget-settings-${id}`;
  
  // State for widget settings
  const [settings, setSettings] = useState(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem(WIDGET_SETTINGS_KEY);
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error(`Error parsing saved settings for widget ${id}:`, error);
      }
    }
    // Default settings
    return {
      showSeconds: true,
      showDate: false,
      use24Hour: true,
      backgroundColor: '#f8f9fa',
      textColor: '#333'
    };
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(WIDGET_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, WIDGET_SETTINGS_KEY]);
  
  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);
  
  // При первом рендере устанавливаем минимальный размер и проверяем позицию Y
  useEffect(() => {
    let needsUpdate = false;
    let newX = x;
    let newY = y;
    let newWidth = width;
    let newHeight = height;
    
    // Если размер меньше минимального, обновляем его
    if (width < MIN_WIDTH_CELLS) {
      newWidth = MIN_WIDTH_CELLS;
      needsUpdate = true;
    }
    
    if (height < MIN_HEIGHT_CELLS) {
      newHeight = MIN_HEIGHT_CELLS;
      needsUpdate = true;
    }
    
    // Верхний левый угол должен быть координатами 0,0
    const minYCells = 0;
    
    // Если позиция Y меньше минимальной, обновляем её
    if (y < minYCells) {
      newY = minYCells;
      needsUpdate = true;
    }
    
    // Если нужно обновить размер или позицию
    if (needsUpdate) {
      onResize(id, newWidth, newHeight);
      if (newX !== x || newY !== y) {
        onMove(id, newX, newY);
      }
    }
    
    // Выводим координаты виджета в консоль для отладки
    console.log(`Widget ${id} rendered at position (${x}, ${y}) with size ${width}x${height}`);
  }, [id, x, y, width, height, onResize, onMove, MIN_WIDTH_CELLS, MIN_HEIGHT_CELLS, CELL_SIZE]);
  
  // Format the time based on settings
  const formattedTime = () => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: settings.showSeconds ? 'numeric' : undefined,
      hour12: !settings.use24Hour
    };
    
    return currentTime.toLocaleTimeString(undefined, options);
  };
  
  // Format the date if needed
  const formattedDate = () => {
    if (!settings.showDate) return null;
    
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    return currentTime.toLocaleDateString(undefined, options);
  };
  
  // Calculate position in pixels - точно по сетке
  const position = {
    x: x * CELL_SIZE,
    y: y * CELL_SIZE
  };
  
  // Calculate size in pixels - точно по сетке
  const size = {
    width: width * CELL_SIZE,
    height: height * CELL_SIZE
  };
  
  // Handle drag events
  const handleDrag = (e, data) => {
    // Предотвращаем всплытие события
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragStop = (e, data) => {
    // Предотвращаем всплытие события
    e.stopPropagation();
    setIsDragging(false);
    
    // Calculate grid position
    const newX = Math.round(data.x / CELL_SIZE);
    
    // Верхний левый угол должен быть координатами 0,0
    const minYCells = 0;
    
    // Ограничиваем минимальную позицию Y, чтобы виджет не мог быть перемещен выше верхнего меню
    const newY = Math.max(minYCells, Math.round(data.y / CELL_SIZE));
    
    // Выводим координаты в консоль для отладки
    console.log(`Dragging widget ${id} to position (${newX}, ${newY}), data: `, data);
    
    // Update position if changed
    if (newX !== x || newY !== y) {
      // Вызываем функцию обновления координат
      onMove(id, newX, newY);
    }
  };
  
  // Handle resize events
  const handleResize = (e, { size }) => {
    // Предотвращаем всплытие события
    e.stopPropagation();
    setIsResizing(true);
  };
  
  const handleResizeStop = (e, { size }) => {
    // Предотвращаем всплытие события
    e.stopPropagation();
    setIsResizing(false);
    
    // Calculate grid size
    const newWidth = Math.max(MIN_WIDTH_CELLS, Math.round(size.width / CELL_SIZE));
    const newHeight = Math.max(MIN_HEIGHT_CELLS, Math.round(size.height / CELL_SIZE));
    
    // Update size if changed
    if (newWidth !== width || newHeight !== height) {
      onResize(id, newWidth, newHeight);
    }
  };
  
  // Toggle settings
  const toggleSetting = (settingName) => {
    setSettings({
      ...settings,
      [settingName]: !settings[settingName]
    });
  };

  // Toggle settings modal
  const toggleSettingsModal = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowSettings(!showSettings);
  };

  // For standalone mode (preview)
  if (standalone) {
    return (
      <div className="widget" style={{ width: size.width, height: size.height }}>
        <div className="widget-content" ref={contentRef}>
          <div className="clock-display">
            <span className="time" style={{ 
              backgroundColor: settings.backgroundColor,
              color: settings.textColor
            }}>
              {formattedTime()}
            </span>
            {settings.showDate && (
              <div className="date">
                {formattedDate()}
              </div>
            )}
          </div>
          
          {/* Display widget coordinates and size */}
          <div className="widget-info">
            <div className="widget-coordinates">
              Position: X: {x}, Y: {y}
            </div>
            <div className="widget-dimensions">
              Size: {width} × {height}
            </div>
          </div>
          
          <div className="widget-settings">
            <div className="settings-row">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.showSeconds} 
                  onChange={() => toggleSetting('showSeconds')}
                />
                Show seconds
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.showDate} 
                  onChange={() => toggleSetting('showDate')}
                />
                Show date
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.use24Hour} 
                  onChange={() => toggleSetting('use24Hour')}
                />
                24-hour format
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // For board mode (draggable and resizable)
  return (
    <Draggable
      position={position}
      grid={[CELL_SIZE, CELL_SIZE]}
      onDrag={handleDrag}
      onStop={handleDragStop}
      // Добавляем handle, чтобы виджет можно было перемещать только за специальную ручку
      handle=".widget-move-handle"
      key={`draggable-${id}`}
      // Устанавливаем границы для перемещения, чтобы виджет не мог быть перемещен выше верхнего меню
      bounds={{
        top: 0, // Верхний левый угол должен быть координатами 0,0
        left: 0,
        right: Infinity,
        bottom: Infinity
      }}
    >
      <div className={`widget-wrapper ${isDragging ? 'dragging' : ''}`} data-widget-id={id} data-widget-x={x} data-widget-y={y}>
        <ResizableBox
          width={size.width}
          height={size.height}
          minConstraints={[MIN_WIDTH, MIN_HEIGHT]}
          maxConstraints={[MAX_WIDTH, MAX_HEIGHT]}
          resizeHandles={['se']}
          onResize={handleResize}
          onResizeStop={handleResizeStop}
          className={`widget ${isResizing ? 'resizing' : ''}`}
          grid={[CELL_SIZE, CELL_SIZE]}
          key={`resizable-${id}`}
        >
          {/* Иконки управления */}
          <div className="widget-controls">
            <div className="widget-move-handle" title="Drag to move">
              ⋮⋮
            </div>
            <button 
              className="widget-settings-btn" 
              onClick={toggleSettingsModal}
              title="Widget settings"
            >
              ⚙
            </button>
            <button 
              className="widget-close-btn" 
              onClick={() => onRemove(id)}
              title="Remove widget"
            >
              ✕
            </button>
          </div>
          
          <div className="widget-content" ref={contentRef}>
            <div className="clock-display">
              <span className="time" style={{ 
                backgroundColor: settings.backgroundColor,
                color: settings.textColor
              }}>
                {formattedTime()}
              </span>
              {settings.showDate && (
                <div className="date">
                  {formattedDate()}
                </div>
              )}
            </div>
            
            {/* Display widget coordinates and size */}
            <div className="widget-info">
              <div className="widget-coordinates">
                Position: X: {x}, Y: {y}
              </div>
              <div className="widget-dimensions">
                Size: {width} × {height}
              </div>
            </div>
            
            {/* Settings modal */}
            {showSettings && (
              <div className="widget-settings-modal">
                <div className="widget-settings-header">
                  <h3>Widget Settings</h3>
                  <button 
                    className="widget-settings-close-btn" 
                    onClick={toggleSettingsModal}
                  >
                    ✕
                  </button>
                </div>
                <div className="widget-settings">
                  <div className="settings-row">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={settings.showSeconds} 
                        onChange={() => toggleSetting('showSeconds')}
                      />
                      Show seconds
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={settings.showDate} 
                        onChange={() => toggleSetting('showDate')}
                      />
                      Show date
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={settings.use24Hour} 
                        onChange={() => toggleSetting('use24Hour')}
                      />
                      24-hour format
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="react-resizable-handle react-resizable-handle-se" />
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default Widget;