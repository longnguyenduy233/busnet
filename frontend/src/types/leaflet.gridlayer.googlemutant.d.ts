declare module 'leaflet.gridlayer.googlemutant' {
  import * as L from 'leaflet';
  namespace googleMutant {
    function googleMutant(options?: { type?: string; [key: string]: any }): L.Layer;
  }
  export = googleMutant;
}
