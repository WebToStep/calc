'use strict';
const isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const start = document.getElementById('start'),
      cancel = document.getElementById('cancel'),
      incomeAddButton = document.getElementsByTagName('button')[0],
      expensesAddButton = document.getElementsByTagName('button')[1],
      depositCheckbox = document.querySelector('#deposit-check'),
      additionIncomeInput = document.querySelectorAll('.additional_income-item'),
      budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
      budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
      expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
      additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
      additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
      incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
      targetMonthValue = document.getElementsByClassName('target_month-value')[0],
      salaryAmount = document.querySelector('.salary-amount'),
      incomeTitle = document.querySelector('.income-title'),
      incomeAmount = document.querySelector('.income-amount'),
      expensesTitle = document.querySelector('.expenses-title'),
      expensesAmount = document.querySelector('.expenses-amount'),
      additionalExpensesItem = document.querySelector('.additional_expenses-item'),
      depositAmount = document.querySelector('.deposit-amount'),
      depositPercent = document.querySelector('.deposit-percent'),
      periodSelect = document.querySelector('.period-select'),
      periodAmount = document.querySelector('.period-amount'),
      targetAmount = document.querySelector('.target-amount'),
      depositCheck = document.getElementById('deposit-check'),
      depositBank = document.querySelector('.deposit-bank');
  
      
let incomeItems = document.querySelectorAll('.income-items'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    allInput = document.querySelectorAll('input');

class AppData {
  constructor() {
    this.income = {};
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;  
    this.percentDeposit = 0;
    this.moneyDeposit = 0; 
    this.period = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0; 
  }

  checkInput() {   
    let allInput = document.querySelectorAll('input');
    allInput.forEach((item)=>{
        item.addEventListener('input', () => {
            if (item.getAttribute('placeholder') === 'Наименование') {
                item.value = item.value.replace(/[^а-я \s !?,. ]/, '');
            }
            if (item.getAttribute('placeholder') === 'Сумма') {
                item.value = item.value.replace(/[^0-9]/, '');
            }
        });
    });
  }
  
  start() {
    this.budget = salaryAmount.value;  
    this.getExpInc();
    this.getAddExpInc(additionalExpensesItem, true);
    this.getAddExpInc(additionIncomeInput, false);
    this.getInfoDeposit();
    this.getBudget();  
    this.showResult();
      allInput.forEach((input) => {
          input.disabled = true;
          if (input === periodSelect) { input.disabled = false; }
      });
    start.style.display = 'none';
    cancel.style.display = 'block';    
  }

  addExpIncBlock(items, button) {    
    let cloneItem = items[0].cloneNode(true);
    items[0].parentNode.insertBefore(cloneItem, button);
      cloneItem.querySelectorAll('input').forEach((input) => {
          input.value = '';
      });
    incomeItems = document.querySelectorAll('.income-items');
    expensesItems = document.querySelectorAll('.expenses-items');
      if (incomeItems.length === 3) { incomeAddButton.style.display = 'none'; }
    if (expensesItems.length === 3){ expensesAddButton.style.display = 'none';}
    this.checkInput();
  }

  getExpInc() {
      const count = item => {
          const startStr = item.className.split('-')[0];
          const itemTitle = item.querySelector(`.${startStr}-title`).value;
          const itemAmount = item.querySelector(`.${startStr}-amount`).value;
          if (itemTitle !== '' && itemAmount !== '') {
              this[startStr][itemTitle] = itemAmount;
          }
      };
    incomeItems.forEach(count);
    expensesItems.forEach(count);
  }

  getIncomeMonth() {
    let sum = 0;
    for (let key in this.income ) {
    sum += +this.income[key];    
    }     
    return sum;
  }

  getExpensesMonth() {    
    for (let key in this.expenses ) {
    this.expensesMonth += +this.expenses[key];    
    }     
    return this.expensesMonth;
  }

  getAddExpInc(addPlace, bool) {
    let addPlaceItem;
    if (bool) {
      addPlaceItem = additionalExpensesItem.value.split(',');    
    } else {      
      addPlaceItem = additionIncomeInput;    
    }
    addPlaceItem.forEach((item) => {
      let itemValue;
      if (bool) {
        itemValue = item.trim();
        addPlace = this.addExpenses;
      } else {
        itemValue = item.value.trim();
        addPlace = this.addIncome;
      }
      if (itemValue !== '') {
        addPlace.push(itemValue);
      }
    });
  }

  getBudget() {   
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = +this.budget + this.getIncomeMonth() - this.getExpensesMonth() + monthDeposit;    
    this.budgetDay = this.budgetMonth / 30; 
  }

  getTargetMonth() {
    return targetAmount.value / this.budgetMonth; 
  }

  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }

 saveStorage() {
    budgetMonthValue.value = localStorage.budgetMonth;  
    budgetDayValue.value = localStorage.budgetDay;
    expensesMonthValue.value = localStorage.expensesMonth;
    additionalExpensesValue.value = localStorage.addExpenses;
    additionalIncomeValue.value = localStorage.addIncome;
    targetMonthValue.value = localStorage.targetMonth;
    incomePeriodValue.value = localStorage.incomePeriod;
 }
 

  showResult() {
    localStorage.budgetMonth = this.budgetMonth;
    localStorage.budgetDay =  Math.floor(this.budgetDay);
    localStorage.expensesMonth = this.expensesMonth;
    localStorage.addExpenses = this.addExpenses.join(', ');
    localStorage.addIncome = this.addIncome.join(', ');
    localStorage.targetMonth = Math.ceil(this.getTargetMonth());
    localStorage.incomePeriod = this.calcSavedMoney();
    document.cookie = 'budgetMonth=' + this.budgetMonth;
    document.cookie = 'budgetDay=' +  Math.floor(this.budgetDay);
    document.cookie = 'expensesMonth=' + this.expensesMonth;
    document.cookie = 'addExpenses=' + this.addExpenses.join(', ');
    document.cookie = 'addIncome=' + this.addIncome.join(', ');
    document.cookie = 'targetMonth=' + Math.ceil(this.getTargetMonth());
    document.cookie = 'incomePeriod=' + this.calcSavedMoney();
    document.cookie = 'isLoad=true';
    this.saveStorage();
   
      periodSelect.addEventListener('input', () => {
          localStorage.incomePeriod = this.calcSavedMoney();
          incomePeriodValue.value = localStorage.incomePeriod;
      });
  }
   
  reset() {
    this.income = {};
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;  
    this.percentDeposit = 0;
    this.moneyDeposit = 0; 
    this.period = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0; 
    allInput = document.querySelectorAll('input');
      allInput.forEach((input) => {
          input.removeAttribute('disabled');
          input.value = '';
          periodSelect.value = '1';
          periodAmount.textContent = '1';
      });
    incomeItems.forEach((item, index) => {
        if (index !== 0) { item.remove(); }
    });
    expensesItems.forEach((item, index) => {
      if (index !== 0) {item.remove();}
    });
    start.style.display = 'block';
    cancel.style.display = 'none';    
    start.disabled = true;   
    incomeAddButton.style.display = 'block';
    expensesAddButton.style.display = 'block';
    depositCheck.checked = false;
    depositBank.value = '';
    depositBank.style.display = 'none';
    depositAmount.style.display = 'none';
    depositPercent.style.display = 'none';
    localStorage.clear();     
  }

  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }

  changePercent () {
    const valueSelect = this.value;
    if (valueSelect === 'other') {
      depositPercent.value = '';
      depositPercent.style.display = 'inline-block';
        depositPercent.addEventListener('input', () => {
            if (depositPercent.value > 0 && depositPercent.value < 100 && isNumber(depositPercent.value)) {
                start.disabled = false;
            } else {
                alert('Введите корректное значение в поле проценты');
                depositPercent.value = '';
                start.disabled = true;
            }
        });
    } else {
      depositPercent.style.display = 'none';
      depositPercent.value = valueSelect;
    }
  }

  depositHandler() {
    if(depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent);
    }
    else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositPercent.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent);

    }
  }
    eventListeners() {
    const _this = this;
    start.disabled = true;   
    salaryAmount.addEventListener('input', () => {
      if (salaryAmount.value !== '') {
        start.disabled = false;
      } else {
        start.disabled = true;
      }
    });  
    
    this.checkInput();
    start.addEventListener('click',  this.start.bind(this));
    cancel.addEventListener('click', this.reset.bind(this));

    incomeAddButton.addEventListener('click', function() {
      _this.addExpIncBlock(incomeItems, incomeAddButton);
    });
    expensesAddButton.addEventListener('click', function() {
      _this.addExpIncBlock(expensesItems, expensesAddButton);
    });
    periodSelect.addEventListener('input', ()=> {
      periodAmount.textContent = periodSelect.value;  
    });
    depositCheck.addEventListener('change', this.depositHandler.bind(this));
    document.addEventListener('DOMContentLoaded', () => {
      if (localStorage.length !== 0){ 
        this.saveStorage();
          allInput.forEach((input) => {
              input.disabled = true;
              if (input === periodSelect) { input.disabled = false; }
          });
        start.style.display = 'none';
        cancel.style.display = 'block';  
      } else {
          allInput.forEach((item) => {
              item.value = '';
              periodSelect.value = '1';
              periodAmount.textContent = '1';
          });
      }  
    });
  }
}
const appData = new AppData();
appData.eventListeners();