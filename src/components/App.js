import * as esri from 'esri-leaflet';
import * as L from 'leaflet';
import moment from 'moment';
import Panel from './Panel';
import './App.scss';
import '../../node_modules/leaflet/dist/leaflet.css';

export default class App {
    constructor() {
        this.month = moment().month() + 1;
        this.year = moment().year();
        this.point = null;
        this.map = null;
        this.layersData = {
            all: null,
            bestMatche: null,
            maybe: null
        };
        this.filters = {
            bedrooms: null,
            zipcode: null,
            population: null,
            ima: null,
            incomeBucket: null
        };
        this.panel = new Panel(this);
        this.initialLoad(this);
    }

    initialLoad(_app){
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
        Promise.all([housing]).then(values => {
            _app.layersData.all = values[0].data;
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

            document.getElementById('initial-loader-overlay').className = '';
        }).catch(reason => {
            console.log(reason);
        });
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

    checkParcelValid(parcel){
        return /\d/.test(parcel);
    }
}