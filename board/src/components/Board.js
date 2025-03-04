import React from 'react';
import './Board.css';
import { GRID_SIZE } from '../constants';

const Board = ({ children, onAddWidget }) => {
  return (
    <div className="board">
      <div className="grid-container">
        <div 
          className="grid"
          style={{
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
          }}
        >
          <div className="widgets-container">
            {children}
          </div>
        </div>
      </div>

      <button className="floating-action-button" onClick={onAddWidget}>
        <i className="add-icon">+</i>
      </button>
    </div>
  );
};

export default Board; 