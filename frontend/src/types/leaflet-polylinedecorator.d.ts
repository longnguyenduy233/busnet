import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Symbol {
    /** `polygon: false` renders an open polyline chevron (two strokes); default is filled triangle. */
    function arrowHead(options?: {
      polygon?: boolean;
      pixelSize?: number;
      headAngle?: number;
      pathOptions?: L.PathOptions;
    }): unknown;
  }

  function polylineDecorator(
    line: L.Polyline | L.Polyline[] | L.LatLngExpression[],
    options?: {
      patterns?: Array<{
        offset?: number | string;
        endOffset?: number | string;
        repeat?: number | string;
        symbol?: unknown;
      }>;
    }
  ): L.Layer & { remove(): this };
}
