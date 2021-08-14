'use strict';
// получение элементов со страницы
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

let docNull = document;

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

const blockResult = () => {
   let iputsGroupData = document.querySelector('.data').querySelectorAll('input');
   iputsGroupData.forEach(i=>i.disabled = true);
   start.style.display = 'none';
   cancel.style.display = 'block';
};

let appData = {
   budget: 0,          // Доход
   budgetDay: 0,      // чистая прибыль в день
   budgetMonth: 0,    // чистая прибыль в месяц
   expensesMonth: 0,  // основные расходы за месяц
   income: {},        // Возможный заработок
   incomeMonth: 0,    // Итого Дополнительный заработок
   addIncome: [],     //  Дополнительный заработок
   expenses: {},      // статьи обязательных расходов
   addExpenses: [],   // статьи дополнительных расходов
   deposit: false,    // депозит?
   percentDeposit: 0,
   moneyDeposit: 0,
   start:function() {
      // получение Месячного дохода
      this.budget = +salaryAmount.value;
      // console.log(this);

      // вызов функций
      // this.resetValues();
      this.getExpenses();
      this.getIncome();
      this.getExpensesMonth();
      this.getAddExpenses();
      this.getAddIncome();
      this.getBudget();

      this.showResult();
      // this.getInfoDeposit();
   },
   reset(){
      start.style.display = 'block';
      cancel.style.display = 'none';
      
      iputsGroupData.forEach(i=>{
         i.disabled = false;
         if (i.type === 'text'|| i.type === 'checkbox'){
            i.value = '';
         } else if(i.type === 'range'){ 
            i.value = 1;
         }
      });

      appData = Object.assign({}, copyAppData);
      appData.showResult();
      targetMonthValue.value = '';

   },
   // вывод результатов на страницу
   showResult() {
      budgetMonthValue.value = this.budgetMonth;
      budgetDayValue.value = this.budgetDay;
      expensesMonthValue.value = this.expensesMonth;
      additionalExpensesValue.value = this.addExpenses.join(', ');
      additionalIncomeValue.value = this.addIncome.join(', ');
      targetMonthValue.value = this.getTargetMonth();
      incomePeriodValue.value = this.calcSavedMoney();
      periodSelect.addEventListener('change', () => incomePeriodValue.value = this.calcSavedMoney());
      periodAmount.textContent = periodSelect.value;
   },
   // Дополнительные расходы
   getExpenses() {
      expensesItems.forEach((item) => {
         let itemExpenses = item.querySelector('.expenses-title').value;
         let cachExpenses = +item.querySelector('.expenses-amount').value;
         // проверка валидности
         if (stringHandler(itemExpenses) && numberHandler(cachExpenses) && cachExpenses !== 0) {
            this.expenses[itemExpenses] = cachExpenses;
         } else {
            console.error('Значения "Обязательных расходов" не верно!');
         }
      });
   },
   // Дополнительные расходы добавить
   addExpensesBlock() {
      let cloneExpensesItem = expensesItems[0].cloneNode(true);

      let newGroup = expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
      newGroup.querySelectorAll('input').forEach((i) => {
         i.value = '';
      });

      expensesItems = document.querySelectorAll('.expenses-items');
      if (expensesItems.length === 3) {
         expensesPlus.style.display = 'none';
      }
   },
   // Дополнительные доходы
   getIncome() {
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
   },
   // Дополнительные доходы добавить
   addIncomeBlock() {
      let cloneIncomeItem = incomeItems[0].cloneNode(true);

      let newGroup = incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
      newGroup.querySelectorAll('input').forEach((i) => {
         i.value = '';
      });

      incomeItems = document.querySelectorAll('.income-items');
      if (incomeItems.length === 3) {
         incomePlus.style.display = 'none';
      }
   },
   // Возможные расходы
   getAddExpenses() {
      let addExpenses = additionalExpensesItem.value.split(',');
      addExpenses.forEach((item) => {
         item = item.trim();
         if (item !== '' && stringHandler(item)) {
            this.addExpenses.push(item);
         } else {
            console.error('Введите возможные расходы, если их нет напишите нет!');
         }
      });
   },
   // Возможный доход
   getAddIncome() {
      additionalIncomeItem.forEach((item) => {
         let itemValue = item.value.trim();
         if (itemValue !== '' && stringHandler(itemValue)) {
            this.addIncome.push(itemValue);
         } else {
            console.error('Введите возможные доходы, если их нет напишите нет!');
         }
      });
   },
   // расчет обязательные расходы (итого:)
   getExpensesMonth: function () {
      let sum = 0;
      for (let key in this.expenses) {
         sum += this.expenses[key];
      }

      this.expensesMonth = sum;
   },
   // расчет накопления за месяц
   getBudget: function () {
      this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
      this.budgetDay = Math.floor(+this.budgetMonth / 30);
   },
   // расчет достижения цели
   getTargetMonth: function () {
      return Math.ceil(targetAmount.value / this.budgetMonth);
   },
   getInfoDeposit() {
      if (this.deposit) {
         this.percentDeposit = modal('Какой годовой процент?', numberHandler);
         this.moneyDeposit = modal('Какая сумма заложенна?', numberHandler);
      }
   },
   // расчет накопления за период
   calcSavedMoney() {
      return this.budgetMonth * periodSelect.value;
   },
   // обнуляем значения обьекта
   // resetValues() {
   //    this.income = {};
   //    this.incomeMonth = 0;
   //    this.addIncome = [];
   //    this.addExpenses = [];
   // }
};


// **************************
// делаем копию начальных значений
let copyAppData = Object.assign({}, appData);


// *******************************

inputHadler();

// проверка введено ли поле месячный доход
start.addEventListener('mouseover', () => {
   if (salaryAmount.value === '') {
      start.style.cursor = 'not-allowed';
   } else {
      start.style.cursor = '';
   }
});
start.addEventListener('click', () => {
   if (salaryAmount.value === '') {
      return console.error('Поле "Месячный доход" не может быть пустым');
   } else {
      blockResult();
      return appData.start.apply(appData);
   }
});

expensesPlus.addEventListener('click', () => {
   appData.addExpensesBlock();
   inputHadler();
});

incomePlus.addEventListener('click', () => {
   appData.addIncomeBlock();
   inputHadler();
});

periodSelect.addEventListener('change', () => periodAmount.textContent = periodSelect.value);

cancel.addEventListener('click' , appData.reset );