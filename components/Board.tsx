"use client"

import { useState, useCallback } from "react"
import { useDrop } from "react-dnd"
import type { Widget } from "../types/Widget"
import AddWidgetButton from "./AddWidgetButton"

interface BoardProps {
  isDarkMode?: boolean;
}

const GRID_SIZE = 20
const TOP_OFFSET = 80

const Board: React.FC<BoardProps> = ({
  isDarkMode = false,
}) => {
  // В MVP версии пока работаем с пустым массивом виджетов
  const [widgets, setWidgets] = useState<Widget[]>([])
  
  // Функция для добавления будущих виджетов 
  const addWidget = (widget: Widget) => {
    setWidgets([...widgets, widget])
  }

  const [, drop] = useDrop(
    () => ({
      accept: "widget",
      drop: () => ({}),
    }),
    [],
  )

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Основная доска с сеткой */}
      <div
        ref={drop}
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
        {/* Кнопка добавления виджета в правом нижнем углу */}
        <AddWidgetButton onClick={() => console.log("Клик по кнопке добавления виджета")} />
      </div>
    </div>
  )
}

export default Board 