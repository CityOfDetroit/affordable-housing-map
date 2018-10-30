import Controller from './components/controller.class';

(function start() {
  const geoResults = function geoResults(ev){
    controller.map.geocoder.setInput('');
    controller.map.map.getSource('single-point').setData(ev.result.geometry);
    const url = `https://gis.detroitmi.gov/arcgis/rest/services/DoIT/RadioPatrols/MapServer/0/query?where=&text=&objectIds=&time=&geometry=${ev.result.center[0]}%2C+${ev.result.center[1]}&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=fid%2C+name&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson`;
    fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      console.log(data);
      if (data.features.length) {
        const patrol = data.features[0].properties.name.split(' ').join('+');
        document.getElementById('sheet-link').href = `https://app.smartsheet.com/b/form/f004f42fcd4345b89a35049a29ff408a?Patrol+ID=${data.features[0].properties.FID}&Patrol+Name=${patrol}`;
        document.querySelector('.patrol-info').innerHTML = `<h3>Radio Patrol ${data.features[0].properties.name}</h3><p>Interested in becoming part of your local radio patrol? Follow the link to start the process.</p><p><small>The Radio Patrol application process is managed by the Detroit Police Department. Once you complete the sign up, someone will contact you regarding the application process. Residents who complete the online form will be contacted after October 31 to start the application process.</small></p>`;
        document.querySelector('.data-panel').className = 'data-panel active';
        controller.geocoderOff = true;
      } else {
        const patrol = 'NEED+NAME';
        document.getElementById('sheet-link').href = `https://app.smartsheet.com/b/form/0c25bae787bc40ef9707c95b2d9684e8`;
        document.querySelector('.patrol-info').innerHTML = `<h3>NO RADIO PATROL FOUND</h3><p>Interested starting your new local radio patrlo? Follow the link to start the process.</p><p><small>The Radio Patrol application process is managed by the Detroit Police Department. Once you complete the sign up, someone will contact you regarding the application process. Residents who complete the online form will be contacted after October 31 to start the application process.</small></p>`;
        document.querySelector('.data-panel').className = 'data-panel active';
        controller.geocoderOff = true;
      }
    });
  }
  const controller = new Controller();

  controller.map.map.on('mousemove', function (e, parent = this) {
    const features = this.queryRenderedFeatures(e.point, {
      layers: ['radio-patrols-fill']
    });
    if (features.length) {
      this.setFilter('radio-patrols-hover', ['==', 'FID', features[0].properties.FID]);
    }
    this.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });
  controller.map.map.on('mouseleave', 'radio-patrols-fill', function () {
    this.setFilter('radio-patrols-hover', ['==', 'FID', '']);
  });
  controller.map.map.on('click', function (e, parent = this) {
    const features = this.queryRenderedFeatures(e.point, {
      layers: ['radio-patrols-fill']
    });
    // console.log(e.point);
    if (features.length) {
      console.log(features[0]);
      let patrol = features[0].properties.name.split(' ').join('+');
      document.getElementById('sheet-link').href = `https://app.smartsheet.com/b/form/f004f42fcd4345b89a35049a29ff408a?Patrol+ID=${features[0].properties.FID}&Patrol+Name=${patrol}`;
      document.querySelector('.patrol-info').innerHTML = `<h3>Radio Patrol ${features[0].properties.name}</h3><p>Interested in becoming part of your local radio patrol? Follow the link to start the process.</p><p><small>The Radio Patrol application process is managed by the Detroit Police Department. Once you complete the sign up, someone will contact you regarding the application process. Residents who complete the online form will be contacted after October 31 to start the application process.</small></p>`;
    } else {
      console.log('no radio patrol');
      let patrol = 'NEED+NAME';
      document.getElementById('sheet-link').href = `https://app.smartsheet.com/b/form/0c25bae787bc40ef9707c95b2d9684e8`;
      document.querySelector('.patrol-info').innerHTML = `<h3>NO RADIO PATROL FOUND</h3><p>Interested starting your new local radio patrlo? Follow the link to start the process.</p><p><small>The Radio Patrol application process is managed by the Detroit Police Department. Once you complete the sign up, someone will contact you regarding the application process. Residents who complete the online form will be contacted after October 31 to start the application process.</small></p>`;
    }
    document.querySelector('.data-panel').className = 'data-panel active';
  });
  controller.map.geocoder.on('result', function (ev) {
    console.log(ev);
    if(controller.geocoderOff){
      controller.geocoderOff = false;
      geoResults(ev);
    }else{
      console.log('extra call');
    }
    
  });

  document.getElementById('close-panel-btn').addEventListener('click', function () {
    document.querySelector('.data-panel.active').className = 'data-panel';
  });
  const startingBtns = document.querySelectorAll('#user-type-section button');
  startingBtns.forEach(function (btn) {
    btn.addEventListener('click', function (ev) {
      controller.initialForm(ev.target.attributes[2].nodeValue, controller);
    });
  });
  const reloadPage = function reloadPage() {
    window.location.reload(true);
  };
  document.getElementById('logo').addEventListener('click', reloadPage);
})(window);
