'use strict';
import './Filters.scss';
export default class Filters {
  constructor(container, app) {
    this.form = null;
    this.app = app;
    this.init(document.getElementById(container), this);
  }
  
  init(container, _filterPanel){
    console.log(container);
    _filterPanel.form = document.createElement('form');
    // Create zipcodes section elemets
    let zipCodes = document.createElement('article');
    let zipCodesInput = document.createElement('input');
    let zipCodesList = document.createElement('datalist');
    let zipCodesInputLabel = document.createElement('label');
    let zipCodesBtn = document.createElement('button');
    zipCodesInput.type = 'text';
    zipCodesInput.setAttribute('id', 'zipcode');
    zipCodesInput.setAttribute('list','zipcodes');
    zipCodesInputLabel.innerText = 'By Zip code:';
    zipCodesInputLabel.setAttribute('for', 'zipcode');
    zipCodesList.setAttribute('id', 'zipcodes');
    for (const [key, value] of Object.entries(_filterPanel.app.zips)) {
        let tempOption = document.createElement('option');
        tempOption.value = key;
        zipCodesList.appendChild(tempOption);
    }
    zipCodesBtn.innerText = 'x';
    zipCodesBtn.id = 'zipcode-filter-btn';
    if(_filterPanel.app.filters.zipcode == null){
        zipCodesBtn.className = 'filter-btn';
    }else{
        zipCodesBtn.className = 'filter-btn active';
    }
    zipCodesInput.addEventListener('change', (ev)=>{
        ev.preventDefault();
        _filterPanel.app.applyFilters(ev, _filterPanel.app);
    });
    zipCodes.appendChild(zipCodesBtn);
    zipCodes.appendChild(zipCodesInputLabel);
    zipCodes.appendChild(zipCodesInput);
    zipCodes.appendChild(zipCodesList);
    _filterPanel.form.appendChild(zipCodes);
    
    // Create population section elemets
    let populationTypes = {
        first: 'Select Type',
        Elderly: 'Elderly',
        Family: 'Family',
        Special_Needs_or_Disabled: 'Special Need or Disabled',
        Homeless: 'Homeless',
        Veterans: 'Veterans'
    }
    let population = document.createElement('article');
    let populationSelect = document.createElement('select');
    let populationSelectLabel = document.createElement('label');
    let populationBtn = document.createElement('button');
    let populationDesc = document.createElement('p');
    populationSelect.setAttribute('id', 'population');
    populationSelect.setAttribute('aria-describedby','population-description');
    for (const [key, value] of Object.entries(populationTypes)) {
        let tempOption = document.createElement('option');
        if(key == 'first'){
            tempOption.value = null;
        }else{
            tempOption.value = key;
        }
        tempOption.innerText = value;
        populationSelect.appendChild(tempOption);
    }
    populationSelectLabel.innerText = 'For Special Populations:';
    populationSelectLabel.setAttribute('for', 'population');
    populationBtn.innerText = 'x';
    populationBtn.id = 'population-filter-btn';
    if(_filterPanel.app.filters.population == null){
        populationBtn.className = 'filter-btn';
    }else{
        populationBtn.className = 'filter-btn active';
    }
    populationDesc.innerText = '(Examples: elderly, veterans, families, etc.)';
    populationDesc.id = 'population-description';
    populationSelect.addEventListener('change', (ev)=>{
        ev.preventDefault();
        _filterPanel.app.applyFilters(ev, _filterPanel.app);
    });
    population.appendChild(populationBtn);
    population.appendChild(populationSelectLabel);
    population.appendChild(populationSelect);
    population.appendChild(populationDesc);
    _filterPanel.form.appendChild(population);

    // Create bedrooms section elemets
    let bedroomsTypes = {
        first: 'Select # of Bedrooms',
        F0BR: 'Studio',
        F1BR: '1 - Bedroom',
        F2BR: '2 - Bedroom',
        F3BR: '3 - Bedroom',
        F4BR: '4 - Bedroom',
        F5BR: '5 - Bedroom',
    }
    let bedrooms = document.createElement('article');
    let bedroomsSelect = document.createElement('select');
    let bedroomsSelectLabel = document.createElement('label');
    let bedroomsBtn = document.createElement('button');
    bedroomsSelect.setAttribute('id', 'rooms');
    for (const [key, value] of Object.entries(bedroomsTypes)) {
        let tempOption = document.createElement('option');
        if(key == 'first'){
            tempOption.value = null;
        }else{
            tempOption.value = key;
        }
        tempOption.innerText = value;
        bedroomsSelect.appendChild(tempOption);
    }
    bedroomsSelectLabel.innerText = 'By Number of Bedrooms:';
    bedroomsSelectLabel.setAttribute('for', 'rooms');
    bedroomsBtn.innerText = 'x';
    bedroomsBtn.id = 'bedrooms-filter-btn';
    if(_filterPanel.app.filters.bedrooms == null){
        bedroomsBtn.className = 'filter-btn';
    }else{
        bedroomsBtn.className = 'filter-btn active';
    }
    bedroomsSelect.addEventListener('change', (ev)=>{
        ev.preventDefault();
        _filterPanel.app.applyFilters(ev, _filterPanel.app);
    });
    bedrooms.appendChild(bedroomsBtn);
    bedrooms.appendChild(bedroomsSelectLabel);
    bedrooms.appendChild(bedroomsSelect);
    _filterPanel.form.appendChild(bedrooms);

    // Create Income elements
    let income = document.createElement('article');
    let incomeBtn = document.createElement('button');
    let calcBtn = document.createElement('button');
    incomeBtn.innerText = 'x';
    incomeBtn.id = 'income-filter-btn';
    incomeBtn.className = 'filter-btn';
    if(_filterPanel.app.filters.ima == null){
        calcBtn.innerText = 'Search by Income';
        calcBtn.className = 'off';
    }else{
        calcBtn.innerText = 'By Income';
        calcBtn.className = 'on';
    }
    calcBtn.addEventListener('click', (ev)=>{
        ev.preventDefault();
        if(ev.target.className == 'off'){
            _filterPanel.app.panel.createPanel(_filterPanel.app.panel, 'calculator');
        }
    });
    income.appendChild(incomeBtn);
    income.appendChild(calcBtn);
    _filterPanel.form.appendChild(income);

    // Create Income legend elements
    let legend = document.createElement('article');
    let best = document.createElement('p');
    let maybe = document.createElement('p');
    best.innerHTML = '<span>x</span> Best match for your income';
    maybe.innerHTML = '<span>x</span> May have units affordable for your income';
    if(_filterPanel.app.filters.ima == null){
        legend.className = 'legend';
    }else{
        legend.className = 'legend active';
    }
    legend.appendChild(best);
    legend.appendChild(maybe);
    _filterPanel.form.appendChild(legend);

    // Handle submits
    _filterPanel.form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        console.log(ev);
    });
    container.appendChild(_filterPanel.form);
  }

  buttonListener(ev, _filterPanel){
    (ev.target.id == 'cancel-btn') ? _filterPanel.cancelIncomeFilter(_filterPanel) : _filterPanel.checkEmtyValues(_filterPanel);
  }

  submit(ev){
    ev.preventDefault();
    if(ev.type == 'submit'){
        this.checkEmtyValues(this);
    }
  }
}
