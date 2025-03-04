# Widget Board Application

A simple widget board application with draggable, resizable widgets that snap to a grid. Built using Webpack Module Federation to separate the board and widget applications.

## Project Structure

- `board/` - The host application that displays the grid and handles widget placement
- `widget/` - The remote application that provides the widget component

## Getting Started

1. Install dependencies for all applications:
   ```
   npm run install:all
   ```

2. Start both applications:
   ```
   npm start
   ```

3. Open your browser to:
   - Board application: http://localhost:3000
   - Widget application: http://localhost:3001

## Features

- Visually appealing grid-based board
- Draggable and resizable widgets
- Grid snapping for precise widget placement
- Modular architecture using Webpack Module Federation 