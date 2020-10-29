import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import * as turf from '@turf/turf';
import * as arcGIS from 'terraformer-arcgis-parser';
import moment from 'moment';
import Panel from './Panel';
import './App.scss';
import '../../node_modules/leaflet/dist/leaflet.css';

export default class App {
    constructor() {
        this.lock = false;
        this.zips = {};
        this.point = null;
        this.map = null;
        this.layersData = {
            all: null,
            maybe: null
        };
        this.filters = {
            bedrooms: null,
            zipcode: null,
            population: null,
            ima: null,
            incomeBucket: null
        };
        this.layers = {};
        this.panel = new Panel(this);
        this.initialLoad(this);
    }

    initialLoad(_app){
        let zipURL = `https://gis.detroitmi.gov/arcgis/rest/services/DoIT/MetroZipCodes/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson`;
        fetch(zipURL)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {
            data.features.forEach(function(item) {
                _app.zips[item.properties.ZCTA5CE10] = item;
            });
        });
        document.getElementById('filters').addEventListener('click', (e)=>{
            _app.panel.createPanel(_app.panel, 'filter');
        });
        _app.map = L.map('map', {
            renderer: L.canvas()
        }).setView([42.36, -83.1], 12);
        
        esri.basemapLayer('Gray', {
            detectRetina: true
        }).addTo(_app.map);

      
        let housing = new Promise((resolve, reject) => {
            let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/HRD_Website_Data(Website_View)/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
            return fetch(url)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) {
            //console.log(data);
            resolve({"id": "housing", "data": data});
            });
        });

        let maybe = new Promise((resolve, reject) => {
            let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/HRD_Website_Data(Website_View)/FeatureServer/0/query?where=1%3D0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
            return fetch(url)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) {
            //console.log(data);
            resolve({"id": "housing", "data": data});
            });
        });
        Promise.all([housing, maybe]).then(values => {
            _app.layersData.all = values[0].data;
            _app.layersData.maybe = values[1].data;
            _app.createLayers(_app);
        }).catch(reason => {
            console.log(reason);
        });
    }

    createLayers(_app){
        _app.map.eachLayer(function (layer) {
            if(layer.feature != undefined){
                _app.map.removeLayer(layer);
            };
        });
        L.geoJSON(_app.layersData.all, {
            pointToLayer: function (geojson, latlng) {
                return L.circleMarker(latlng, {
                    fillColor: '#004445',
                    fillOpacity: 1,
                    stroke: false,
                    radius: 5
                });
            }
        }).on('click',function (layer) {
            console.log(layer);
            _app.panel.data = layer.propagatedFrom.feature;
            _app.panel.createPanel(_app.panel, 'property');
            _app.queryLayer(_app, layer.latlng);
        }).addTo(_app.map);

        L.geoJSON(_app.layersData.maybe, {
            pointToLayer: function (geojson, latlng) {
                return L.circleMarker(latlng, {
                    fillColor: '#feb70d',
                    fillOpacity: 1,
                    stroke: false,
                    radius: 5
                });
            }
        }).on('click',function (layer) {
            console.log(layer);
            _app.panel.data = layer.propagatedFrom.feature;
            _app.panel.createPanel(_app.panel, 'property');
            _app.queryLayer(_app, layer.latlng);
        }).addTo(_app.map);

        document.getElementById('initial-loader-overlay').className = '';
    }



    queryLayer(_app, latlng){
        let needAdress = false;
        let myIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconSize: [25, 35],
            iconAnchor: [25, 35],
            popupAnchor: [-3, -76],
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        });
        let tempLocation = null;
        if(latlng.geometry){
            tempLocation = {lat: latlng.geometry.coordinates[1],lng:  latlng.geometry.coordinates[0]};            
        }else{
            needAdress = true;
            tempLocation = latlng;
        }
        let userPoint = L.layerGroup().addTo(_app.map);
        if(_app.point){
            _app.point.clearLayers();
            _app.point = userPoint.addLayer(L.marker(tempLocation,{icon: myIcon}));
        }else{ 
            _app.point = userPoint.addLayer(L.marker(tempLocation,{icon: myIcon}));
        }
        _app.map.flyTo(tempLocation, 15);
        if(_app.panel.data.type == null){
            esri.query({ url:'https://gis.detroitmi.gov/arcgis/rest/services/OpenData/CertificateOfCompliance/FeatureServer/0'}).where(`parcel_id = '${_app.panel.data.parcel}'`).run(function (error, featureCollection) {
                if (error) {
                  console.log(error);
                  return;
                }
                if(featureCollection.features.length){
                    _app.panel.data.date = moment(featureCollection.features[0].properties.record_status_date).format('MMM Do, YYYY');
                    _app.panel.data.type = featureCollection.features[0].properties.task;
                    _app.panel.createPanel(_app.panel);
                }else{
                    esri.query({ url:'https://gis.detroitmi.gov/arcgis/rest/services/OpenData/RentalStatuses/FeatureServer/0'}).where(`parcel_id = '${_app.panel.data.parcel}'`).run(function (error, featureCollection) {
                        if (error) {
                        console.log(error);
                        return;
                        }

                        if(featureCollection.features.length){
                            _app.panel.data.date = moment(featureCollection.features[0].properties.record_status_date).format('MMM Do, YYYY');
                            _app.panel.data.type = featureCollection.features[0].properties.task;
                        }else{
                            _app.panel.data.type = null;
                        }
                        _app.panel.createPanel(_app.panel);
                    });
                }
            });
        }
    }

    removeFilters(ev, _app){
        if(_app.lock != true){
            console.log(ev);
            console.log('calling remove filters');
            document.getElementById('initial-loader-overlay').className = 'active';
            switch (ev.target.id) {
            case 'zipcode-filter-btn':
                _app.filters.zipcode = null;
                break;
        
            case 'population-filter-btn':
                _app.filters.population = null;
                break;
        
            case 'bedrooms-filter-btn':
                _app.filters.bedrooms = null;
                break;
        
            case 'income-filter-btn':
                _app.filters.incomeBucket = null;
                _app.filters.ima = null;
                break;
            
            default:
                break;
            }
            _app.updateMap(_app);
        }
    }

    applyFilters(ev, _app){
        _app.lock = true;
        console.log(_app.layers);
        console.log(ev.target.id);
        console.log(ev.target.value);
        document.getElementById('initial-loader-overlay').className = 'active';
        switch (ev.target.id) {
            case 'population':
            if(ev.target.value != null){
                _app.filters.population = ev.target.value; 
            }else{
                _app.filters.population = null;
            }
            break;
    
            case 'zipcode':
            if(ev.target.value != ''){
                _app.filters.zipcode = ev.target.value;
            }else{
                _app.filters.zipcode = null;
            }
            break;
    
            case 'rooms':
            if(ev.target.value != null){
                _app.filters.bedrooms = ev.target.value;
                _app.filters.incomeBucket = null;
            }else{
                _app.filters.bedrooms = null;
            } 
            break;
        
            default:
                console.log('doing default');
            //   _app.filters.population = null;
            //   _app.filters.zipcode = null;
            //   _app.filters.bedrooms = null;
            //   _app.filters.incomeBucket = null;
            //   document.getElementById('rooms').value = null;
            //   document.getElementById('population').value = null;
            //   document.getElementById('zipcode').value = '';
            //   document.getElementById('calculator-btn').className = 'off';
            //   document.getElementById('by-income-description').innerText = '';
            //   (document.querySelector('.legend.active') == null) ? 0 : document.querySelector('.legend.active').className = 'legend';
            //   let activeFilters = document.querySelectorAll('.filter-btn.active');
            //   activeFilters.forEach((btn)=>{
            //     btn.className = 'filter-btn';
            //   });
            break;
        }
        _app.updateMap(_app);
    }

    updateMap(_app){
        console.log('calling update map');
        let where = '';
        let whereMaybe = '';
        let polygon = null;
        console.log(_app.filters);
        if(_app.filters.population == null){
          if(_app.filters.bedrooms == null){
            switch (_app.filters.incomeBucket) {
              case null:
                where = '1%3D1';
                whereMaybe = '1%3D0';
                break;
              
              case 'Too_High':
                where = '1%3D0'
                whereMaybe = '1%3D0';
                break;
            
              default:
                where = `${_app.filters.incomeBucket}='Y'`;
                whereMaybe = `${_app.filters.incomeBucket}='M'`;
                break;
            }
          }else{
            switch (_app.filters.incomeBucket) {
              case null:
                where = `${_app.filters.bedrooms}<>null`;
                whereMaybe = '1%3D0';
                break;
              
              case 'Too_High':
                where = '1%3D0'
                whereMaybe = '1%3D0';
                break;
            
              default:
                where = `${_app.filters.bedrooms}<>null AND ${_app.filters.incomeBucket}='Y'`;
                whereMaybe = `${_app.filters.bedrooms}<>null AND ${_app.filters.incomeBucket}='M'`;
                break;
            }
          }
        }else{
          if(_app.filters.bedrooms == null){
            switch (_app.filters.incomeBucket) {
              case null:
                where = `${_app.filters.population}<>null`;
                whereMaybe = '1%3D0';
                break;
              
              case 'Too_High':
                where = '1%3D0';
                whereMaybe = '1%3D0';
                break;
            
              default:
                where = `${_app.filters.population}<>null AND ${_app.filters.incomeBucket}='Y'`;
                whereMaybe = `${_app.filters.population}<>null AND ${_app.filters.incomeBucket}='M'`;
                break;
            }
          }else{
            switch (_app.filters.incomeBucket) {
              case null:
                where = `${_app.filters.population}<>null AND ${_app.filters.bedrooms}<>null`;
                whereMaybe = '1%3D0';
                break;
              
              case 'Too_High':
                where = '1%3D0';
                whereMaybe = '1%3D0';
                break;
            
              default:
                where = `${_app.filters.population}<>null AND ${_app.filters.bedrooms}<>null AND ${_app.filters.incomeBucket}='Y'`;
                whereMaybe = `${_app.filters.population}<>null AND ${_app.filters.bedrooms}<>null AND ${_app.filters.incomeBucket}='M'`;
                break;
            }
          }
        }
        if(_app.filters.zipcode != null){
          let simplePolygon = turf.simplify(_app.zips[_app.filters.zipcode].geometry, {tolerance: 0.005, highQuality: false});
          polygon = arcGIS.convert(simplePolygon);
        }
        //console.log(where);
        //console.log(whereMaybe);
        let housing = new Promise((resolve, reject) => {
            let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/HRD_Website_Data(Website_View)/FeatureServer/0/query?where=${where}&objectIds=&time=&geometry=${(polygon != null) ? `${encodeURI(JSON.stringify(polygon))}`:``}&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
            return fetch(url)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) {
            //console.log(data);
            resolve({"id": "housing", "data": data});
            });
        });

        let maybe = new Promise((resolve, reject) => {
            let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/HRD_Website_Data(Website_View)/FeatureServer/0/query?where=${whereMaybe}&objectIds=&time=&geometry=${(polygon != null) ? `${encodeURI(JSON.stringify(polygon))}`:``}&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
            return fetch(url)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) {
            //console.log(data);
            resolve({"id": "maybe", "data": data});
            });
        });
        Promise.all([housing, maybe]).then(values => {
            console.log(values);
            _app.layersData.all = values[0].data;
            _app.layersData.maybe = values[1].data;
            _app.createLayers(_app);
            _app.lock = false;
        }).catch(reason => {
            console.log(reason);
        });
    }
}