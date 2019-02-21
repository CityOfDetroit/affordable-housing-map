'use strict';
import Map from './map.class.js';
import Panel from './panel.class.js';
import Calculator from './calculator.class';
const turf = require('@turf/turf');
const arcGIS = require('terraformer-arcgis-parser');
export default class Controller {
  constructor(container) {
    this.geocoderOff = true;
    this.scoutVolunteers = null;
    this.filters = {
      'bedrooms': null,
      'neighborhood': null,
      'population': null,
      'ima': null,
      'incomeBucket': null
    };
    this.neighborhoods = {};
    this.calculator = new Calculator('calc-box',this);
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
          data: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/HRD_Website_Data(Website_View)/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`
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
        {
          id: "litch-locations-points",
          "source": "litch-locations",
          "type": "circle",
          "paint": {
              "circle-radius": 8,
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
    this.panel = new Panel(container);
    this.populatNeighborhoods(this);
  }
  
  initialForm(ev,_controller){
    switch (ev) {
      case 'v-sign-up':
        document.querySelector('#user-type-section').className = 'hidden';
        document.querySelector('section.application').className = 'application';
        break;
      default:

    }
  }

  populatNeighborhoods(_controller){
    let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/theNeighborhoods/FeatureServer/5/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=2898&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=name&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      let list = '';
      data.features.forEach(function(item) {
        _controller.neighborhoods[item.properties.name] = item;
        list += `<option value='${item.properties.name}'></option>`
        document.getElementById('neighborhoods').innerHTML = list;
      });
    });
  }

  updatePanel(ev, _controller){
    this.panel.buildPanel(ev);
  }

  updateMap(_controller){
    let where = '';
    let polygon = null;
    console.log(_controller.filters);
    if(_controller.filters.population == null){
      if(_controller.filters.bedrooms == null){
        if(_controller.filters.incomeBucket == null){
          where = '1%3D1';
        }else{
          where = `${_controller.filters.incomeBucket}='Y'`;
        }
      }else{
        if(_controller.filters.incomeBucket == null){
          where = `${_controller.filters.bedrooms}<>null`;
        }else{
          where = `${_controller.filters.bedrooms}<>null AND ${_controller.filters.incomeBucket}='Y'`;
        }
      }
    }else{
      if(_controller.filters.bedrooms == null){
        if(_controller.filters.incomeBucket == null){
          where = `${_controller.filters.population}<>null`;
        }else{
          where = `${_controller.filters.population}<>null AND ${_controller.filters.incomeBucket}='Y'`;
        }
      }else{
        if(_controller.filters.incomeBucket == null){
          where = `${_controller.filters.population}<>null AND ${_controller.filters.bedrooms}<>null`;
        }else{
          where = `${_controller.filters.population}<>null AND ${_controller.filters.bedrooms}<>null AND ${_controller.filters.incomeBucket}='Y'`;
        }
      }
    }
    if(_controller.filters.neighborhood != null){
      let simplePolygon = turf.simplify(_controller.filters.neighborhood,{tolerance: 0.005, highQuality: false});
      polygon = arcGIS.convert(simplePolygon.geometry);
    }
    
    let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/HRD_Website_Data(Website_View)/FeatureServer/0/query?where=${where}&objectIds=&time=&geometry=${(polygon != null) ? `${encodeURI(JSON.stringify(polygon))}`:``}&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
      console.log(data);
      _controller.map.map.getSource('litch-locations').setData(data);
      document.getElementById('initial-loader-overlay').className = '';
    });
  }

  filterMap(ev, _controller){
    console.log(ev);
    document.getElementById('initial-loader-overlay').className = 'active';
    switch (ev.target.id) {
      case 'population':
        (ev.target.value != 'null') ? _controller.filters.population = ev.target.value : _controller.filters.population = null;
        break;

      case 'neighborhood':
        (ev.target.value != '') ? _controller.filters.neighborhood = _controller.neighborhoods[ev.target.value] : _controller.filters.neighborhood = null;
        break;
    
      default:
        _controller.filters.population = null;
        _controller.filters.neighborhood = null;
        _controller.filters.bedrooms = null;
        _controller.filters.incomeBucket = null;
        document.getElementById('population').value = null;
        document.getElementById('neighborhood').value = '';
        document.getElementById('calculator-btn').className = 'off';
        document.querySelector('#calculator-btn span').innerHTML = 'OFF';
        break;
    }
    _controller.updateMap(_controller);
  }

  geoResults(ev, _controller){
    _controller.map.geocoder.setInput('');
    _controller.map.map.getSource('single-point').setData(ev.result.geometry);
    _controller.map.map.flyTo({
      center: ev.result.center,
      zoom: 12,
      speed: 1,
      curve: 1,
      easing(t) {
        return t;
      }
    });
    const url = `http://gis.detroitmi.gov/arcgis/rest/services/DoIT/LITCH/MapServer/0/query?where=&text=&objectIds=&time=&geometry=${ev.result.center[0]}%2C+${ev.result.center[1]}&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=fid%2C+name&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json`;
    fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      console.log(data);
      if (data.features.length) {
        const patrol = data.features[0].properties.name.split(' ').join('+');
        document.getElementById('sheet-link').href = `https://app.smartsheet.com/b/form/f004f42fcd4345b89a35049a29ff408a?Patrol+ID=${data.features[0].properties.FID}&Patrol+Name=${patrol}`;
        document.querySelector('.patrol-info').innerHTML = `<h3>Radio Patrol ${data.features[0].properties.name}</h3><p>Interested in becoming part of your local radio patrol? Follow the link to start the process.</p><p><small>The Radio Patrol application process is managed by the Detroit Police Department. Once you complete the sign up, someone will contact you regarding the application process. Residents who complete the online form will be contacted after October 31 to start the application process.</small></p>`;
        document.querySelector('.data-panel').className = 'data-panel active';
        _controller.geocoderOff = true;
      } else {
        const patrol = 'NEED+NAME';
        document.getElementById('sheet-link').href = `https://app.smartsheet.com/b/form/0c25bae787bc40ef9707c95b2d9684e8`;
        document.querySelector('.patrol-info').innerHTML = `<h3>NO RADIO PATROL FOUND</h3><p>Interested starting your new local radio patrlo? Follow the link to start the process.</p><p><small>The Radio Patrol application process is managed by the Detroit Police Department. Once you complete the sign up, someone will contact you regarding the application process. Residents who complete the online form will be contacted after October 31 to start the application process.</small></p>`;
        document.querySelector('.data-panel').className = 'data-panel active';
        _controller.geocoderOff = true;
      }
    });
  }
}
