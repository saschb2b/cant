export interface DevicePreset {
  id: string;
  name: string;
  category: "phone" | "tablet" | "desktop" | "custom";
  width: number;
  height: number;
  userAgent?: string;
}

export interface Viewport {
  id: string;
  deviceId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  scale: number;
  customName?: string;
}

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

export type LayoutMode = "freeform" | "grid";

export interface SyncSettings {
  scroll: boolean;
  mouse: boolean;
  click: boolean;
  hover: boolean;
  navigation: boolean;
}

export interface ViewerState {
  url: string;
  viewports: Viewport[];
  layoutMode: LayoutMode;
  canvasTransform: CanvasTransform;
  selectedViewportId: string | null;
  scrollPosition: number; // 0-1 percentage
  syncSettings: SyncSettings;
}

export type ViewerAction =
  | { type: "SET_URL"; url: string }
  | { type: "ADD_VIEWPORT"; viewport: Viewport }
  | { type: "REMOVE_VIEWPORT"; id: string }
  | { type: "UPDATE_VIEWPORT"; id: string; updates: Partial<Viewport> }
  | { type: "SELECT_VIEWPORT"; id: string | null }
  | { type: "SET_LAYOUT_MODE"; mode: LayoutMode }
  | { type: "SET_CANVAS_TRANSFORM"; transform: CanvasTransform }
  | { type: "SET_SCROLL_POSITION"; position: number }
  | { type: "TOGGLE_ORIENTATION"; id: string }
  | { type: "LOAD_STATE"; state: ViewerState }
  | { type: "SET_SYNC_SETTINGS"; settings: Partial<SyncSettings> }
  | { type: "REORDER_VIEWPORTS"; fromIndex: number; toIndex: number };

export interface SyncMessage {
  type:
    | "SCROLL"
    | "SCROLL_TO"
    | "MOUSE_MOVE"
    | "CLICK"
    | "HOVER"
    | "NAVIGATE"
    | "VIEWPORT_READY";
  scrollY?: number;
  mouseX?: number; // 0-1 percentage
  mouseY?: number; // 0-1 percentage
  selector?: string; // CSS selector for hover/click target
  url?: string;
  sourceId?: string;
  sameOrigin?: boolean;
}
