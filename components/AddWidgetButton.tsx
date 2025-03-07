"use client"

import { Plus } from 'lucide-react';

interface AddWidgetButtonProps {
  onClick: () => void;
}

const AddWidgetButton: React.FC<AddWidgetButtonProps> = ({ onClick }) => {
  return (
    <div 
      className="add-widget-button fixed bottom-8 right-8 z-10"
      onClick={onClick}
    >
      <Plus size={24} strokeWidth={3} />
    </div>
  );
};

export default AddWidgetButton; 