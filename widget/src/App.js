import React from 'react';
import Widget from './components/Widget';

const App = () => {
  return (
    <div className="app">
      <header className="header">
        <h1>Widget Preview</h1>
        <p>This is a standalone preview of the widget</p>
      </header>
      <main className="preview">
        <Widget 
          id={1}
          x={2}
          y={2}
          width={4}
          height={3}
          onMove={() => {}}
          onResize={() => {}}
          standalone={true}
        />
      </main>
    </div>
  );
};

export default App; 