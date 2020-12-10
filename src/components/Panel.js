import moment from 'moment';
import Calculator from './Calculator';
import Filters from './Filters';
import './Panel.scss';
export default class Panel {
    constructor(app) {
        this.app = app;
        this.calculator = null;
        this.filters = null;
        this.data = null;
        this.panels = [];
    }

    closePanel(ev,_panel){
        let tempClass = ev.target.parentNode.parentNode.className;
        tempClass = tempClass.split(' ');
        ev.target.parentNode.parentNode.className = tempClass[0];
        _panel.app.map.flyTo([42.36, -83.1], 12);
        try {
            while (ev.target.parentNode.firstChild) {
                ev.target.parentNode.removeChild(ev.target.parentNode.firstChild);
            }
        } catch (error) {
            
        }
        _panel.panels.pop();
        // console.log(_panel.panels);
    }

    getPopulation(property){
        let population = '';
        if(property.Family != null){
            if(property.Homeless != null){
                if(property.Veterans != null){
                    if(property.Elderly != null){
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Family, Homeless, Veterans, Elderly and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Family, Homeless, Veterans and Elderly</p>`;
                        }
                    }else{
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Family, Homeless, Veterans and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Family, Homeless and Veterans</p>`;
                        }
                    }
                }else{
                    if(property.Elderly != null){
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Family, Homeless, Elderly and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Family, Homeless and Elderly</p>`;
                        }
                    }else{
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Family, Homeless and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Family and Homeless</p>`;
                        }
                    }
                }
            }else{
                if(property.Veterans != null){
                    if(property.Elderly != null){
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Family, Veterans, Elderly and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Family, Veterans and Elderly</p>`;
                        }
                    }else{
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Family, Veterans and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Family and Veterans</p>`;
                        }
                    }
                }else{
                    if(property.Elderly != null){
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Family, Elderly and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Family and Elderly</p>`;
                        }
                    }else{
                        population = `<p><strong>Population:</strong> Family</p>`;
                    }
                }
            }
        }else{
            if(property.Homeless != null){
                if(property.Veterans != null){
                    if(property.Elderly != null){
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Homeless, Veterans, Elderly and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Homeless, Veterans and Elderly</p>`;
                        }
                    }else{
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Homeless, Veterans and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Homeless and Veterans</p>`;
                        }
                    }
                }else{
                    if(property.Elderly != null){
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Homeless, Elderly and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Homeless and Elderly</p>`;
                        }
                    }else{
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Homeless and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Homeless</p>`;
                        }
                    }
                }
            }else{
                if(property.Veterans != null){
                    if(property.Elderly != null){
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Veterans, Elderly and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Veterans and Elderly</p>`;
                        }
                    }else{
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Veterans and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Veterans</p>`;
                        }
                    }
                }else{
                    if(property.Elderly != null){
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> Elderly and 'Special Needs or Disabled'</p>`;
                        }else{
                            population = `<p><strong>Population:</strong> Elderly</p>`;
                        }
                    }else{
                        if(property.Special_Needs_or_Disabled != null){
                            population = `<p><strong>Population:</strong> 'Special Needs or Disabled'</p>`;
                        }else{
                            population = ``;
                        }
                    }
                }
            }
        }
        return population;
    }

    buildPropertyInfo(_panel){
        let markup = `
        <h2>${_panel.data.properties.Project_Name}</h2>
        <section class="group">
        <span class="header">Property</span>
        <p><strong>Address:</strong> ${_panel.data.properties.Project_Address}</p>
        <p><strong>Neighborhood:</strong> ${_panel.data.properties.Neighborhood}</p>
        ${_panel.data.properties.Structure != null ? `<p><strong>Structure:</strong> ${_panel.data.properties.Structure}</p>`:``}
        ${_panel.data.properties.Public_Housing == 'TRUE' ? `<p><strong>Detroit Housing Commission Public Housing:</strong> Yes`:`<p><strong>DHC Public Housing:</strong> No`}
        ${this.getPopulation(_panel.data.properties)}
        </section>
        <section class="group">
        <span class="header">Units</span>
        <p><strong>Rent-restricted:</strong> ${_panel.data.properties.Affordable_Units}</p>
        <p><strong>Total:</strong> ${_panel.data.properties.Total_Units}</p>
        ${_panel.data.properties.Number_0BR != null ? `<p><strong>Studio:</strong> ${_panel.data.properties.Number_0BR}</p>`:``}
        ${_panel.data.properties.Number_1BR != null ? `<p><strong>1-Bedroom:</strong> ${_panel.data.properties.Number_1BR}</p>`:``}
        ${_panel.data.properties.Number_2BR != null ? `<p><strong>2-Bedroom:</strong> ${_panel.data.properties.Number_2BR}</p>`:``}
        ${_panel.data.properties.Number_3BR != null ? `<p><strong>3-Bedroom:</strong> ${_panel.data.properties.Number_3BR}</p>`:``}
        ${_panel.data.properties.Number_4BR != null ? `<p><strong>4-Bedroom:</strong> ${_panel.data.properties.Number_4BR}</p>`:``}
        ${_panel.data.properties.Number_5BR != null ? `<p><strong>5-Bedroom:</strong> ${_panel.data.properties.Number_5BR}</p>`:``}
        </section>
        <section class="group">
        <span class="header">Management</span>
        ${_panel.data.properties.Property_Phone != null ? `<p><strong>Property Phone:</strong> <a href="tel:${_panel.data.properties.Property_Phone}">${_panel.data.properties.Property_Phone}</a></p>`:``}
        ${_panel.data.properties.Management_Company != null ? `<p><strong>Company:</strong> ${_panel.data.properties.Management_Company}</p>`:``}
        ${_panel.data.properties.Manager_Contact != null ? `<p><strong>Manager:</strong> ${_panel.data.properties.Manager_Contact}</p>`:``}
        ${_panel.data.properties.Manager_Phone != null ? `<p><strong>Manager's Phone:</strong> <a href="tel:${_panel.data.properties.Manager_Phone}">${_panel.data.properties.Manager_Phone}</a></p>`:``}
        ${_panel.data.properties.Management_Website != null ? `<p><strong>Website:</strong> <a href="http://${_panel.data.properties.Management_Website}" target="_blank">Link</a></p>`:``}
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
        return markup;
    }

    buildFilters(_panel){
        let markup = `
        <h2>Search for housing</h2>
        <article id="filter-box">
        </article>
        `;
        return markup;
    }

    buildCalculator(_panel){
        let markup = `
        <section class="calculator">
          <h2>Income Calculator</h2>
          <article id="calc-box"></article>
        </section>
        `;
        return markup;
    }

    createPanel(_panel, panelType){
        let tempPanel = document.querySelector('.panel .panel-box');
        let closeBtn = document.createElement('button');
        closeBtn.innerText = 'x';
        closeBtn.className = 'close-section-btn';
        closeBtn.addEventListener("click", function(e){
            e.preventDefault();
            _panel.closePanel(e, _panel);
        });
        if(!_panel.panels.includes(panelType)){
            _panel.panels.push(panelType);
        }
        // console.log(_panel.panels);
        switch (_panel.panels[(_panel.panels.length - 1)]) {
            case 'property':
                tempPanel.innerHTML = `${_panel.buildPropertyInfo(_panel)}`;
                break;

            case 'filter':
                tempPanel.innerHTML = `${_panel.buildFilters(_panel)}`;
                _panel.filters = new Filters('filter-box', _panel.app);
                break;

            case 'calculator':
                tempPanel.innerHTML = `${_panel.buildCalculator(_panel)}`;
                _panel.calculator = new Calculator('calc-box', _panel.app);
                break;
        
            default:
                break;
        }
        tempPanel.prepend(closeBtn);
        document.querySelector('#app .panel').className = "panel active";
    }
}