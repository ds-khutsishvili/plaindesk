import React, { useState, lazy, Suspense, useEffect } from 'react';
import Board from './components/Board';
import Header from './components/Header';
import './App.css';

// Import widget styles
import 'widget/styles';

// Lazy load the widget from the remote application
const Widget = lazy(() => import('widget/Widget'));

// Local storage key for widgets
const STORAGE_KEY = 'widget-board-widgets';

// Высота верхнего меню в пикселях (должна соответствовать значению в Header.css)
// Используем точное значение без дополнительных отступов
const HEADER_HEIGHT = 64;

const App = () => {
  // Initialize widgets from localStorage or use default
  const [widgets, setWidgets] = useState(() => {
    const savedWidgets = localStorage.getItem(STORAGE_KEY);
    if (savedWidgets) {
      try {
        return JSON.parse(savedWidgets);
      } catch (error) {
        console.error('Error parsing saved widgets:', error);
      }
    }
    // Default widget if nothing in localStorage
    return [{ id: 1, x: 0, y: 0, width: 6, height: 5 }];
  });

  // Save widgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    console.log('Widgets saved to localStorage:', widgets);
  }, [widgets]);

  const handleWidgetMove = (id, x, y) => {
    console.log(`Moving widget ${id} to position (${x}, ${y})`);
    
    // Обновляем координаты виджета в состоянии приложения
    const updatedWidgets = widgets.map(widget => 
      widget.id === id ? { ...widget, x, y } : widget
    );
    
    // Сохраняем обновленное состояние
    setWidgets(updatedWidgets);
    
    // Сохраняем в localStorage для отладки
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWidgets));
  };

  const handleWidgetResize = (id, width, height) => {
    console.log(`Resizing widget ${id} to size ${width}x${height}`);
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, width, height } : widget
    ));
  };

  // Function to add a new widget
  const handleAddWidget = () => {
    // Generate a new unique ID
    const newId = Math.max(0, ...widgets.map(w => w.id)) + 1;
    
    // Минимальные размеры виджета (должны соответствовать константам в Widget.js)
    const MIN_WIDTH_CELLS = 6;
    const MIN_HEIGHT_CELLS = 5;
    
    // Calculate a new position for the widget to avoid overlap
    // Use a cascading pattern: each new widget is positioned 2 cells to the right and 2 cells down
    // from the last widget, or starts a new row if it would go off-screen
    const GRID_OFFSET = 4; // Number of cells to offset each new widget
    const MAX_X = 20; // Maximum X position before starting a new row
    
    // Find the last widget's position
    let lastX = 0;
    let lastY = 0;
    
    if (widgets.length > 0) {
      // Sort widgets by creation order (assuming ID increases with each new widget)
      const sortedWidgets = [...widgets].sort((a, b) => b.id - a.id);
      const lastWidget = sortedWidgets[0];
      
      // Get the last widget's position
      lastX = lastWidget.x + GRID_OFFSET;
      lastY = lastWidget.y;
      
      // If the new widget would go too far right, move it to the next row
      if (lastX > MAX_X) {
        lastX = 0;
        lastY += GRID_OFFSET;
      }
    }
    
    // Create a new widget with calculated position
    const newWidget = {
      id: newId,
      x: lastX,
      y: lastY,
      width: MIN_WIDTH_CELLS,
      height: MIN_HEIGHT_CELLS
    };
    
    console.log(`Adding new widget at position (${lastX}, ${lastY})`);
    setWidgets([...widgets, newWidget]);
  };

  // Function to remove a widget
  const handleRemoveWidget = (id) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  return (
    <div className="App">
      <Header />
      <Board onAddWidget={handleAddWidget}>
        {widgets.map(widget => (
          <Suspense key={widget.id} fallback={<div className="widget-placeholder">Loading widget...</div>}>
            <Widget
              id={widget.id}
              x={widget.x}
              y={widget.y}
              width={widget.width}
              height={widget.height}
              onMove={handleWidgetMove}
              onResize={handleWidgetResize}
              onRemove={handleRemoveWidget}
              headerHeight={HEADER_HEIGHT}
            />
          </Suspense>
        ))}
      </Board>
    </div>
  );
};

export default App; 