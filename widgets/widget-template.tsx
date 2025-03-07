"use client"

import { useState } from 'react';
import type { Widget } from '@/types/Widget';

export interface WidgetProps {
  widget: Widget;
  updateWidget?: (widget: Widget) => void;
  removeWidget?: (id: number) => void;
  isDarkMode?: boolean;
}

const WidgetTemplate: React.FC<WidgetProps> = ({
  widget,
  updateWidget,
  removeWidget,
  isDarkMode = false,
}) => {
  const [settings, setSettings] = useState(widget.settings || {});

  return (
    <div
      className={`rounded-lg shadow-sm flex flex-col p-4 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
      style={{
        width: `${widget.size.width}px`,
        height: `${widget.size.height}px`,
      }}
    >
      {widget.title && (
        <div className="text-lg font-medium mb-2">{widget.title}</div>
      )}
      <div className="flex-1">
        {/* Placeholder для контента виджета */}
        <div className="h-full flex items-center justify-center text-gray-400">
          Контент виджета
        </div>
      </div>
    </div>
  );
};

export default WidgetTemplate; 