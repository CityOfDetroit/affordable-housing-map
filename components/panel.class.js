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
            <h2>${data.properties.Project_Name}</h2>
            <important>
            <p><strong>Elegibility:</strong> ${data.properties.Target_Population}</p>
            </important>
            <section class="group">
            <span class="header">Property</span>
            <p><strong>Address:</strong> ${data.properties.Project_Address}</p>
            <p><strong>Neighborhood:</strong> ${data.properties.Neighborhood}</p>
            <p><strong>Structure:</strong> ${data.properties.Structure}</p>
            </section>
            <section class="group">
            <span class="header">Units</span>
            <p><strong>Affordable:</strong> ${data.properties.Affordable_Units}</p>
            <p><strong>Total:</strong> ${data.properties.Total_Units}</p>
            </section>
            <section class="group">
            <span class="header">Sizes</span>
            <p><strong>Studio:</strong> ${data.properties.F0BR}</p>
            <p><strong>1 Bedroom:</strong> ${data.properties.F1BR}</p>
            <p><strong>2 Bedroom:</strong> ${data.properties.F2BR}</p>
            <p><strong>3 Bedroom:</strong> ${data.properties.F3BR}</p>
            <p><strong>4 Bedroom:</strong> ${data.properties.F4BR}</p>
            <p><strong>5 Bedroom:</strong> ${data.properties.F5BR}</p>
            </section>
        `;
        
        return html;
    }
}