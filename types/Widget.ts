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
  minSize?: Size;
  maxSize?: Size;
  title?: string;
  content?: any;
  settings?: Record<string, any>;
} 