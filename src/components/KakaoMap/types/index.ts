export type MapProps = {
  width?: number | string;
  height?: number | string;
  appKey: string;
  lat?: number; // center
  lng?: number; // center
  markerList?: any;
  container?: any;
  center?: number;
  mapTypeId?: any;
  draggable: boolean;
  disableDoubleClick?: boolean;
  projectionId?: any;
  tileAnimation?: boolean;
  keyboardShortcuts?: any;
};
