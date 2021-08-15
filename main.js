'use strict';
// *********получение элементов со страницы
let start = document.getElementById('start'),
 cancel = document.getElementById('cancel'),
   BtnPlus = document.querySelectorAll('button'),
   incomePlus = BtnPlus[0],
   expensesPlus = BtnPlus[1],
   additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
   depositCheck = document.querySelector('#deposit-check'),
   budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
   budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
   additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
   additionalExpensesItem = document.querySelector('.additional_expenses-item'),
   incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
   targetMonthValue = document.getElementsByClassName('target_month-value')[0],
   incomeValue = document.querySelectorAll('.additional_income-item'),
   expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
   salaryAmount = document.querySelector('.salary-amount'),
   incomeTitle = document.querySelector('.income-title'),
   incomeItems = document.querySelectorAll('.income-items'),
   incomeAmount = document.querySelector('.income-amount'),
   expensesTitle = document.querySelector('.expenses-title'),
   expensesAmount = document.querySelector('.expenses-amount'),
   expensesItems = document.querySelectorAll('.expenses-items'),
   additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
   periodSelect = document.querySelector('.period-select'),
   targetAmount = document.querySelector('.target-amount'),
   periodAmount = document.querySelector('.period-amount'),
   inputs = document.querySelectorAll('input'),
   iputsGroupData = document.querySelector('.data').querySelectorAll('input');

// ************доп функции
// вызов модального окна
const modal = (text, test) => {
   let value = prompt(text);
   // если value true и число
   if (test) {
      if (test(value) && !!parseFloat(value)) {
         return +value;
         // если value true и строка
      } else if (test(value) && !parseFloat(value)) {
         return value;
      } else {
         confirm('Введите верное значение');
         return modal(text, test);
      }
   } else {
      return value;
   }
};

// Проверка ввода числа
const numberHandler = (value) => {
   if (!isNaN(parseFloat(value)) && isFinite(value) ) {
      return true;
   } else {
      console.error('Пожалуйста вводите цифры');
      return false;
   }
};

// Проверка ввода строки
const stringHandler = (value) => {
   if (value === null || value === '' || value === undefined) {
      return false;
   } else if (!Number.isNaN(parseFloat(value[0]))) {
      console.error('Внимание, значение не может начинаться с цифры только буквы!');
      return false;
   } else if (value !== value.replace(/[^А-я 0-9]/, '')) {
      console.error('Внимание, только русские символы!');
      return false;
   } else {
      return true;
   }
};

// проверка на соответствие символов
const inputHadler = () => {
   inputs = document.querySelectorAll('input');
   inputs.forEach((i) => {
      i.addEventListener('input', () => {
         if (i.placeholder === 'Наименование') {
            if (!stringHandler(i.value)) {
               i.value = '';
            }
         } else if (i.placeholder === 'Сумма') {
            if (!numberHandler(i.value)) {
               i.value = '';
               return;
            }
         }
      });
   });
};


// Создаем AppData
const AppData = function (){
   this.budget = 0;          // Доход
   this.budgetDay = 0;      // чистая прибыль в день
   this.budgetMonth = 0;    // чистая прибыль в месяц
   this.expensesMonth = 0;  // основные расходы за месяц
   this.income = {};        // Возможный заработок
   this.incomeMonth = 0;    // Итого Дополнительный заработок
   this.addIncome = [];     //  Дополнительный заработок
   this.expenses = {};      // статьи обязательных расходов
   this.addExpenses = [];   // статьи дополнительных расходов
   this.deposit = false;    // депозит?
   this.percentDeposit = 0;
   this.moneyDeposit = 0;
   this.buttonsEnabled = true;
};

const appData = new AppData();

// *****************методы AppData
AppData.prototype.start = function() {
   if (salaryAmount.value === '') {
      return console.error('Поле "Месячный доход" не может быть пустым');
   } else {
   // Блокировка UI
   iputsGroupData.forEach(i => i.disabled = true);
   start.style.display = 'none';
   cancel.style.display = 'block';
   expensesPlus.setAttribute('disabled', true);
   incomePlus.setAttribute('disabled', true);
   // получение Месячного дохода
   this.budget = +salaryAmount.value;

   // вызов функций
   this.getExpenses();
   this.getIncome();
   this.getBudget();
   this.getExpensesMonth();
   this.getAddExpenses();
   this.getAddIncome();

   this.showResult();
   // this.getInfoDeposit();
}
};

AppData.prototype.reset = function (){
   // обрабатываем кнопки
   start.style.display = 'block';
   cancel.style.display = 'none';
   expensesPlus.removeAttribute('disabled');
   incomePlus.removeAttribute('disabled');
   incomePlus.style.display = 'block';
   expensesPlus.style.display = 'block';

   // обнуляем исходные данные
   for(let key in this){
      switch(typeof(this[key])){
         case 'string': this[key] = ''; break;
         case 'number': this[key] = 0; break;
         case 'boolean': this[key] = false; break;
         case 'object': 
            if(this[key] instanceof Array){
               this[key] = [];
            }else{
               this[key] = {};
            }
      }
   }

   // чистим дом элементы
   iputsGroupData.forEach(i=>{
      i.disabled = false;
      if (i.type === 'text'|| i.type === 'checkbox'){
         i.value = '';
      } else if(i.type === 'range'){ 
         i.value = 1;
      }
   });
   this.showResult();
   targetMonthValue.value = '';

   // удаляем лишние инпуты
   expensesItems.forEach((i, key)=>{
      if(key > 0){
         i.remove();
      }
   });
   incomeItems.forEach((i, key)=>{
      if(key > 0){
         i.remove();
      }
   });
};
// вывод результатов на страницу
AppData.prototype.showResult = function () {
   let _this = this;
   budgetMonthValue.value = this.budgetMonth;
   budgetDayValue.value = this.budgetDay;
   expensesMonthValue.value = this.expensesMonth;
   additionalExpensesValue.value = this.addExpenses.join(', ');
   additionalIncomeValue.value = this.addIncome.join(', ');
   targetMonthValue.value = this.getTargetMonth();
   incomePeriodValue.value = this.calcSavedMoney();
   periodSelect.addEventListener('change', () => incomePeriodValue.value = _this.calcSavedMoney());
   periodAmount.textContent = periodSelect.value;
};
// Дополнительные расходы
AppData.prototype.getExpenses = function () {
   let _this = this;
   expensesItems.forEach((item) => {
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cachExpenses = +item.querySelector('.expenses-amount').value;
      // проверка валидности
      if (stringHandler(itemExpenses) && numberHandler(cachExpenses) && cachExpenses !== 0) {
         _this.expenses[itemExpenses] = cachExpenses;
      } else {
         console.error('Значения "Обязательных расходов" не верно!');
      }
   });
};
// Дополнительные расходы добавить
AppData.prototype.addExpensesBlock = function () {
   let cloneExpensesItem = expensesItems[0].cloneNode(true);

   let newGroup = expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
   newGroup.querySelectorAll('input').forEach((i) => {
      i.value = '';
   });

   expensesItems = document.querySelectorAll('.expenses-items');
   if (expensesItems.length >= 3) {
      expensesPlus.style.display = 'none';
   }
};
// Дополнительные доходы
AppData.prototype.getIncome = function () {
   incomeItems.forEach((item) => {
      let itemIncome = item.querySelector('.income-title').value;
      let cashIncome = +item.querySelector('.income-amount').value;
      // проверка валидности
      if (stringHandler(itemIncome) && numberHandler(cashIncome)) {
         this.income[itemIncome] = +cashIncome;
      } else {
         console.error('Значения "Дополнительных доходов" не верно!');
      }
   });
   for (let key in this.income) {
      this.incomeMonth += +this.income[key];
   }
};
// Дополнительные доходы добавить
AppData.prototype.addIncomeBlock = function () {
   let cloneIncomeItem = incomeItems[0].cloneNode(true);

   let newGroup = incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
   newGroup.querySelectorAll('input').forEach((i) => {
      i.value = '';
   });

   incomeItems = document.querySelectorAll('.income-items');
   if (incomeItems.length >= 3) {
      incomePlus.style.display = 'none';
   }
};
// Возможные расходы
AppData.prototype.getAddExpenses = function () {
   let addExpenses = additionalExpensesItem.value.split(',');
   addExpenses.forEach((item) => {
      item = item.trim();
      if (item !== '' && stringHandler(item)) {
         this.addExpenses.push(item);
      } else {
         console.error('Введите возможные расходы, если их нет напишите нет!');
      }
   });
};
// Возможный доход
AppData.prototype.getAddIncome = function () {
   additionalIncomeItem.forEach((item) => {
      let itemValue = item.value.trim();
      if (itemValue !== '' && stringHandler(itemValue)) {
         this.addIncome.push(itemValue);
      } else {
         console.error('Введите возможные доходы, если их нет напишите нет!');
      }
   });
};
// расчет обязательные расходы (итого:)
AppData.prototype.getExpensesMonth = function () {
   let sum = 0;
   for (let key in this.expenses) {
      sum += this.expenses[key];
   }

   this.expensesMonth = sum;
};
// расчет накопления за месяц
AppData.prototype.getBudget = function () {
   this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
   this.budgetDay = Math.floor(+this.budgetMonth / 30);
};
// расчет достижения цели
AppData.prototype.getTargetMonth = function () {
   return Math.ceil(targetAmount.value / this.budgetMonth);
};
AppData.prototype.getInfoDeposit = function() {
   if (this.deposit) {
      this.percentDeposit = modal('Какой годовой процент?', numberHandler);
      this.moneyDeposit = modal('Какая сумма заложенна?', numberHandler);
   }
};
// расчет накопления за период
AppData.prototype.calcSavedMoney = function() {
   return this.budgetMonth * periodSelect.value;
};

// ****************Обработка событий
AppData.prototype.eventsListeners = function(){
   // проверка введено ли поле месячный доход
   start.addEventListener('mouseover', () => {
      if (salaryAmount.value === '') {
         start.style.cursor = 'not-allowed';
      } else {
         start.style.cursor = '';
      }
   });

   start.addEventListener('click', () => this.start());

   cancel.addEventListener('click' , () => this.reset());


   expensesPlus.addEventListener('click', () => {
      this.addExpensesBlock();
      inputHadler();
   });

   incomePlus.addEventListener('click', () => {
      this.addIncomeBlock();
      inputHadler();
   });

   periodSelect.addEventListener('change', () => periodAmount.textContent = periodSelect.value);
};


appData.eventsListeners();
inputHadler();


