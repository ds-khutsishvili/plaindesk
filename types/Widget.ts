export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Widget {
  id: number;
  type: string;
  position: Position;
  size: Size;
  title?: string;
  content?: any;
  settings?: Record<string, any>;
} 