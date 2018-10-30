'use strict';
import Map from './map.class.js';
export default class Controller {
  constructor() {
    this.geocoderOff = true;
    this.scoutVolunteers = null;
    this.map = new Map({
      styleURL: 'mapbox://styles/mapbox',
      mapContainer: 'map',
      geocoder: true,
      baseLayers: {
        street: 'streets-v10',
        satellite: 'cj774gftq3bwr2so2y6nqzvz4'
      },
      center: [-83.10, 42.36],
      zoom: 11,
      boundaries: {
        sw: [-83.3437,42.2102],
        ne: [-82.8754,42.5197]
      },
      sources: [
        {
          id: "litch-locations",
          type: "geojson",
          data: 'http://gis.detroitmi.gov/arcgis/rest/services/DoIT/LITCH/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
        },
        {
          id: "single-point",
          type: "geojson",
          data: {
              "type": "FeatureCollection",
              "features": []
          }
        }
      ],
      layers: [
        // {
        //   "id": "litch-locations-fill",
        //   "type": "fill",
        //   "source": "litch-locations",
        //   "layout": {},
        //   "paint": {
        //     "fill-color": '#9FD5B3',
        //     "fill-opacity": .5
        //   }
        // },
        // {
        //   "id": "litch-locations-borders",
        //   "type": "line",
        //   "source": "litch-locations",
        //   "layout": {},
        //   "paint": {
        //     "line-color": "#004544",
        //     "line-width": 3
        //   }
        // },
        // {
        //   "id": "litch-locations-hover",
        //   "type": "fill",
        //   "source": "litch-locations",
        //   "layout": {},
        //   "paint": {
        //     "fill-color": '#23A696',
        //     "fill-opacity": .5
        //   },
        //   "filter": ["==", "fid", ""]
        // },
        {
          id: "litch-locations-points",
          "source": "litch-locations",
          "type": "circle",
          "paint": {
              "circle-radius": 10,
              "circle-color": "#004544"
          }
        },
        {
          id: "point",
          "source": "single-point",
          "type": "circle",
          "paint": {
              "circle-radius": 10,
              "circle-color": "#007cbf"
          }
        }
      ]
    });
  }
  initialForm(ev,controller){
    switch (ev) {
      case 'v-sign-up':
        document.querySelector('#user-type-section').className = 'hidden';
        document.querySelector('main').className = '';
        break;
      default:

    }
  }
}
