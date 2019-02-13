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

    getPopulation(property){
        let population = `
        ${property.Family != 'null' ? `Family `:``}
        ${property.Homeless != 'null' ? `Homeless `:``}
        ${property.Veterans != 'null' ? `Veterans `:``}
        ${property.Elderly != 'null' ? `Elderly`:``}
        `;
        return population;
    }

    buildMarkUp(data){
        let html = `
            <h4>${data.properties.Project_Name}</h4>
            <section class="group">
            <span class="header">Property</span>
            <p><strong>Address:</strong> ${data.properties.Project_Address}</p>
            <p><strong>Neighborhood:</strong> ${data.properties.Neighborhood}</p>
            <p><strong>Structure:</strong> ${data.properties.Structure}</p>
            <p><strong>Population:</strong> ${this.getPopulation(data.properties)}</p>
            </section>
            <section class="group">
            <span class="header">Units</span>
            <p><strong>Rent-restricted:</strong> ${data.properties.Affordable_Units}</p>
            <p><strong>Total:</strong> ${data.properties.Total_Units}</p>
            ${data.properties.F0BR != 'null' ? `<p><strong>Studio:</strong> ${data.properties.F0BR}</p>`:``}
            ${data.properties.F1BR != 'null' ? `<p><strong>1-Bedroom:</strong> ${data.properties.F1BR}</p>`:``}
            ${data.properties.F2BR != 'null' ? `<p><strong>2-Bedroom:</strong> ${data.properties.F2BR}</p>`:``}
            ${data.properties.F3BR != 'null' ? `<p><strong>3-Bedroom:</strong> ${data.properties.F3BR}</p>`:``}
            ${data.properties.F4BR != 'null' ? `<p><strong>4-Bedroom:</strong> ${data.properties.F4BR}</p>`:``}
            ${data.properties.F5BR != 'null' ? `<p><strong>5-Bedroom:</strong> ${data.properties.F5BR}</p>`:``}
            </section>
            <section class="group">
            <span class="header">Management</span>
            ${data.properties.Property_Phone != 'null' ? `<p><strong>Property Phone:</strong> <a href="tel:${data.properties.Property_Phone}">${data.properties.Property_Phone}</a></p>`:``}
            ${data.properties.Management_Website != '' ? `<p><strong>Company:</strong> <a href="http://${data.properties.Management_Website}" target="_blank">${data.properties.Management_Company}</a></p>`:`${data.properties.Management_Company != 'null' ? `<p><strong>Company:</strong> ${data.properties.Management_Company}</p>`:``}`}
            ${data.properties.Manager_Contact != '' ? `<p><strong>Manager:</strong> ${data.properties.Manager_Contact}</p>`:``}
            ${data.properties.Manager_Phone != '' ? `<p><strong>Manager's Phone:</strong> <a href="tel:${data.properties.Manager_Phone}">${data.properties.Manager_Phone}</a></p>`:``}
            </section>
            <section class="group">
            <span class="header">Learn more</span>
            <article class="sub-group">
                <a class="btn resource" href="/taxonomy/term/5441" target="_blank">What is affordable housing?</a>
                <a class="btn resource" href="/taxonomy/term/5446" target="_blank">Who is eligible?</a>
            </article>
            </section>
            <p><small>Properties may or may not have units available, and rents may vary. Property management contact information is continuously updated, as management may change. If you discover any information is not up to date, please submit a note using our <a href="https://app.smartsheet.com/b/form/1cc29c45f4694a7a97315dde550db40c" target="_blank">online form.</a></small></p>
        `;
        
        return html;
    }
}