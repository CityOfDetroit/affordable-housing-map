'use strict';
export default class Calculator {
  constructor(container, controller) {
    this.form = null;
    this.controller = controller;
    this.init(document.getElementById(container), this);
  }
  
  init(container, _calculator){
    _calculator.form = document.createElement('form');
    // Create salary-hourly section elemets
    let salaryHourly = document.createElement('fieldset');
    let salaryHourlyLegend = document.createElement('legend');
    let salaryHourlyOptions = document.createElement('ul');
    let salaryHourlyOption1 = document.createElement('li');
    let salaryHourlyOption2 = document.createElement('li');
    let salaryHourlySalary = document.createElement('input');
    let salaryHourlySalaryLabel = document.createElement('label');
    let salaryHourlyHourly = document.createElement('input');
    let salaryHourlyHourlyLabel = document.createElement('label');
    // Add attributes to elements
    salaryHourlyLegend.innerText = 'Are you hourly or salary?';
    salaryHourlySalary.type = 'radio';
    salaryHourlySalary.setAttribute('id', 'salary');
    salaryHourlySalary.setAttribute('name','salary-hourly');
    salaryHourlySalary.value = 'salary';
    salaryHourlySalary.checked = true;
    salaryHourlySalaryLabel.setAttribute('for', 'salary'); 
    salaryHourlySalaryLabel.innerText = 'Salary'; 
    salaryHourlyHourly.type = 'radio';
    salaryHourlyHourly.setAttribute('id', 'hourly');
    salaryHourlyHourly.setAttribute('name','salary-hourly');
    salaryHourlyHourly.value = 'hourly';
    salaryHourlyHourlyLabel.setAttribute('for', 'hourly'); 
    salaryHourlyHourlyLabel.innerText = 'Hourly'; 
    salaryHourlySalaryLabel.addEventListener('click', (ev)=>{
        this.updateForm('hourly-salary', ev, _calculator);
    });
    salaryHourlySalary.addEventListener('click', (ev)=>{
        this.updateForm('hourly-salary', ev, _calculator);
    });
    salaryHourlyHourlyLabel.addEventListener('click', (ev)=>{
        this.updateForm('hourly-salary', ev, _calculator);
    });
    salaryHourlyHourly.addEventListener('click', (ev)=>{
        this.updateForm('hourly-salary', ev, _calculator);
    });
    // Build DOM for salary-hourly section
    salaryHourlyOption1.appendChild(salaryHourlySalary);
    salaryHourlyOption1.appendChild(salaryHourlySalaryLabel);
    salaryHourlyOption2.appendChild(salaryHourlyHourly);
    salaryHourlyOption2.appendChild(salaryHourlyHourlyLabel);
    salaryHourlyOptions.appendChild(salaryHourlyOption1);
    salaryHourlyOptions.appendChild(salaryHourlyOption2);
    salaryHourly.appendChild(salaryHourlyLegend);
    salaryHourly.appendChild(salaryHourlyOptions);
    
    // Create Salary section elemets
    let salary = document.createElement('section');
    let annualSalary = document.createElement('input');
    let annualSalaryLabel = document.createElement('label');
    // Add attributes to elements
    salary.className = 'logic-section salary active';
    annualSalary.type = 'number';
    annualSalary.setAttribute('id', 'annual-salary');
    annualSalary.value = 0;
    annualSalaryLabel.setAttribute('for', 'annual-salary'); 
    annualSalaryLabel.innerText = 'Annual Salary:'; 
    // Build DOM for salary section
    salary.appendChild(annualSalaryLabel);
    salary.appendChild(annualSalary);

    // Create hourly section elemets
    let hourly = document.createElement('section');
    let hourlyWageBox = document.createElement('article');
    let hourlyWage = document.createElement('input');
    let hourlyWageLabel = document.createElement('label');
    let hoursPerWeekBox = document.createElement('article');
    let hoursPerWeek = document.createElement('input');
    let hoursPerWeekLabel = document.createElement('label');
    // Add attributes to elements
    hourly.className = 'logic-section salary active';
    hourlyWage.type = 'number';
    hourlyWage.setAttribute('id', 'hourly-wage');
    hourlyWage.setAttribute('step', '.01');
    hourlyWage.value = 0;
    hourlyWageLabel.setAttribute('for', 'hourly-wage'); 
    hourlyWageLabel.innerText = 'Hourly Wage:'; 
    hoursPerWeek.type = 'number';
    hoursPerWeek.setAttribute('id', 'hours-per-week');
    hoursPerWeek.value = 0;
    hoursPerWeekLabel.setAttribute('for', 'hours-per-week'); 
    hoursPerWeekLabel.innerText = 'Hours Worked per week:'; 
    // Build DOM for hourly section
    hourlyWageBox.appendChild(hourlyWageLabel);
    hourlyWageBox.appendChild(hourlyWage);
    hoursPerWeekBox.appendChild(hoursPerWeekLabel);
    hoursPerWeekBox.appendChild(hoursPerWeek);
    hourly.appendChild(hourlyWageBox);
    hourly.appendChild(hoursPerWeekBox);
    
    // Create add-income section elemets
    let addIncome = document.createElement('section');
    let addIncomeValue = document.createElement('input');
    let addIncomeLabel = document.createElement('label');
    // Add attributes to elements
    addIncomeValue.type = 'number';
    addIncomeValue.setAttribute('id', 'add-income');
    addIncomeValue.value = 0;
    addIncomeLabel.setAttribute('for', 'add-income'); 
    addIncomeLabel.innerText = 'Additional Income:'; 
    // Build DOM for add-income section
    addIncome.appendChild(addIncomeLabel);
    addIncome.appendChild(addIncomeValue);

    // Create dependents section elemets
    let dependents = document.createElement('section');
    let dependentsValue = document.createElement('input');
    let dependentsLabel = document.createElement('label');
    // Add attributes to elements
    dependentsValue.type = 'number';
    dependentsValue.setAttribute('id', 'dependents');
    dependentsValue.value = 0;
    dependentsLabel.setAttribute('for', 'dependents'); 
    dependentsLabel.innerText = 'Number of Dependents:'; 
    // Build DOM for dependents section
    dependents.appendChild(dependentsLabel);
    dependents.appendChild(dependentsValue);

    // Create household section elemets
    let household = document.createElement('fieldset');
    let householdLegend = document.createElement('legend');
    let householdOptions = document.createElement('ul');
    let householdOption1 = document.createElement('li');
    let householdOption2 = document.createElement('li');
    let senior = document.createElement('input');
    let seniorLabel = document.createElement('label');
    let notSenior = document.createElement('input');
    let notSeniorLabel = document.createElement('label');
    // Add attributes to elements
    householdLegend.innerText = 'Is the head of household 62 year or older?';
    senior.type = 'radio';
    senior.setAttribute('id', 'senior');
    senior.setAttribute('name','senior-deduction');
    senior.value = 'senior';
    seniorLabel.setAttribute('for', 'senior'); 
    seniorLabel.innerText = 'Yes'; 
    notSenior.type = 'radio';
    notSenior.setAttribute('id', 'not-senior');
    notSenior.setAttribute('name','senior-deduction');
    notSenior.value = 'not-senior';
    notSenior.checked = true;
    notSeniorLabel.setAttribute('for', 'not-senior'); 
    notSeniorLabel.innerText = 'No'; 
    // Build DOM for household section
    householdOption1.appendChild(senior);
    householdOption1.appendChild(seniorLabel);
    householdOption2.appendChild(notSenior);
    householdOption2.appendChild(notSeniorLabel);
    householdOptions.appendChild(householdOption2);
    householdOptions.appendChild(householdOption1);
    household.appendChild(householdLegend);
    household.appendChild(householdOptions);

    // Create child-exp section elemets
    let childExp = document.createElement('section');
    let childExpValue = document.createElement('input');
    let childExpLabel = document.createElement('label');
    // Add attributes to elements
    childExpValue.type = 'number';
    childExpValue.setAttribute('id', 'child-exp');
    childExpValue.value = 0;
    childExpLabel.setAttribute('for', 'child-exp'); 
    childExpLabel.innerText = 'Childcare expenses per year:'; 
    // Build DOM for child-exp section
    childExp.appendChild(childExpLabel);
    childExp.appendChild(childExpValue);

    // Create medical-exp section elemets
    let medicalExp = document.createElement('section');
    let medicalExpValue = document.createElement('input');
    let medicalExpLabel = document.createElement('label');
    // Add attributes to elements
    medicalExpValue.type = 'number';
    medicalExpValue.setAttribute('id', 'medical-exp');
    medicalExpValue.value = 0;
    medicalExpLabel.setAttribute('for', 'medical-exp'); 
    medicalExpLabel.innerText = 'Medical expenses per year:'; 
    // Build DOM for medical-exp section
    medicalExp.appendChild(medicalExpLabel);
    medicalExp.appendChild(medicalExpValue);

    // Create people-household section elemets
    let peopleHousehold = document.createElement('section');
    let peopleHouseholdValue = document.createElement('input');
    let peopleHouseholdLabel = document.createElement('label');
    // Add attributes to elements
    peopleHouseholdValue.type = 'number';
    peopleHouseholdValue.setAttribute('id', 'people-household');
    peopleHouseholdValue.value = 0;
    peopleHouseholdLabel.setAttribute('for', 'people-household'); 
    peopleHouseholdLabel.innerText = 'How many people are in your household?'; 
    // Build DOM for people-household section
    peopleHousehold.appendChild(peopleHouseholdLabel);
    peopleHousehold.appendChild(peopleHouseholdValue);

    let buttonGroup = document.createElement('article');
    let submit = document.createElement('button');
    submit.innerText = 'CALCULATE';
    submit.setAttribute('id', 'submit-btn');
    let cancel = document.createElement('button');
    cancel.innerText = 'CANCEL';
    cancel.setAttribute('id', 'cancel-btn');
    buttonGroup.appendChild(submit);
    buttonGroup.appendChild(cancel);

    _calculator.form.appendChild(salaryHourly);
    _calculator.form.appendChild(salary);
    _calculator.form.appendChild(hourly);
    _calculator.form.appendChild(addIncome);
    _calculator.form.appendChild(dependents);
    _calculator.form.appendChild(household);
    _calculator.form.appendChild(childExp);
    _calculator.form.appendChild(medicalExp);
    _calculator.form.appendChild(peopleHousehold);
    _calculator.form.appendChild(buttonGroup);
    _calculator.form.addEventListener('submit', (ev) => {
        this.submit(ev, _calculator);
    });
    container.appendChild(_calculator.form);
  }

  submit(ev, _calculator){
    ev.preventDefault();
    console.log(ev);
    (ev.explicitOriginalTarget.id == 'cancel-btn') ? _calculator.cancelIncomeFilter(_calculator) : _calculator.computeIncomeRange(_calculator);
  }

  updateForm(type, value, _calculator){
    console.log(value);
  }

  cancelIncomeFilter(_calculator){
    document.querySelector('.calculator.active').className = 'calculator';
    document.querySelector('#calculator-btn').className = 'off';
    document.querySelector('#calculator-btn span').innerText = 'OFF';
  }

  computeIncomeRange(_calculator){
    console.log(_calculator.form);
    let AMI = 0;
    let income = 0;
    let addIncome = _calculator.form[6].valueAsNumber;
    let dependents = _calculator.form[7].valueAsNumber;
    let seniorDeduction = 0;
    let childcare = _calculator.form[11].valueAsNumber;
    let medical = _calculator.form[12].valueAsNumber;
    let householdSize = _calculator.form[13].valueAsNumber;
    if(_calculator.form[1].checked){
        income = _calculator.form[3].valueAsNumber;
    }else{
        let rate = _calculator.form[4].valueAsNumber;
        let hours = _calculator.form[5].valueAsNumber;
        income = rate * hours * 52;
    }
    (_calculator.form[9].checked) ? seniorDeduction = 0 : seniorDeduction = 400;
    let annualAdjustedGrossIncome = (income + (12 * addIncome) - (480 * dependents) - seniorDeduction - childcare - medical);
    let monthlyAdjustedGrossIncome = (income - (480 * dependents) - seniorDeduction - childcare - medical)/12 + addIncome;
    switch (true) {
        case annualAdjustedGrossIncome >= 0 && annualAdjustedGrossIncome < 17725:
            AMI = 20;
            break;

        case annualAdjustedGrossIncome >= 17725  && annualAdjustedGrossIncome < 21270:
            AMI = 25;
            break;

        case annualAdjustedGrossIncome >= 21270  && annualAdjustedGrossIncome < 24815:
            AMI = 30;
            break;

        case annualAdjustedGrossIncome >= 24815  && annualAdjustedGrossIncome < 28360:
            AMI = 35;
            break;
        
        case annualAdjustedGrossIncome >= 28360  && annualAdjustedGrossIncome < 31905:
            AMI = 40;
            break;

        case annualAdjustedGrossIncome >= 31905  && annualAdjustedGrossIncome < 35450:
            AMI = 45;
            break;

        case annualAdjustedGrossIncome >= 35450  && annualAdjustedGrossIncome < 38995:
            AMI = 50;
            break;

        case annualAdjustedGrossIncome >= 38995  && annualAdjustedGrossIncome < 42540:
            AMI = 55;
            break;

        case annualAdjustedGrossIncome >= 42540  && annualAdjustedGrossIncome < 56720:
            AMI = 60;
            break;

        case annualAdjustedGrossIncome >= 56720  && annualAdjustedGrossIncome < 70900:
            AMI = 80;
            break;

        case annualAdjustedGrossIncome >= 70900  && annualAdjustedGrossIncome < 85080:
            AMI = 100
            break;
    
        default:
            AMI = 120;
            break;
    }
    // document.getElementById('results').innerHTML = `
    // <p><strong>Annual Adjusted Gross Income:</strong> ${annualAdjustedGrossIncome}</p>
    // <p><strong>Monthly Adjusted Gross Income:</strong> ${monthlyAdjustedGrossIncome}</p>
    // <p><strong>%AMI:</strong> ${AMI}</p>
    // `;
    document.querySelector('.calculator.active').className = 'calculator';
    document.querySelector('#calculator-btn').className = 'on';
    document.querySelector('#calculator-btn span').innerText = 'ON';
  }
}
