'use strict';
export default class Panel {
    constructor(container){
        this.container = container;
    }

    buildPanel(data){
        this.container.innerHTML = this.buildMarkUp(data);
    }

    clearPanel(){
        this.container.innerHTML = '';
    }

    buildMarkUp(data){
        let html = `
            <h2>${data.properties.Project_Na}</h2>
            <p><strong>Address:</strong> ${data.properties.Project_Ad}</p>
            <p><strong>Elegibility:</strong> ${data.properties.Eligibilit}</p>
        `;
        
        return html;
    }
}