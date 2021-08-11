'use strict';
// получение элементов со страницы
let start = document.getElementById('start'),
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
   periodAmount = document.querySelector('.period-amount');

   
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
   
   return !isNaN(parseFloat(value) && isFinite(value) && value === '');
};

// Проверка ввода строки
const stringHandler = (value) => {
   if (value === null || value === '' || value === undefined) {
      return false;
   } else if (!Number.isNaN(parseFloat(value))) {
      return false;
   } else {
      return true;
   }
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
   start () {
      // получение Месячного дохода
      appData.budget = +salaryAmount.value;

      // вызов функций
      appData.resetValues();
      // appData.isEmptyCheck();
      appData.getExpenses();
      appData.getIncome();
      appData.getExpensesMonth();
      appData.getAddExpenses();
      appData.getAddIncome();
      appData.getBudget();

      appData.showResult();
      // appData.getInfoDeposit();
   },
   // вывод результатов на страницу
   showResult(){
      budgetMonthValue.value = appData.budgetMonth;      
      budgetDayValue.value = appData.budgetDay;
      expensesMonthValue.value = appData.expensesMonth;
      additionalExpensesValue.value = appData.addExpenses.join(', ');
      additionalIncomeValue.value = appData.addIncome.join(', ');
      targetMonthValue.value = appData.getTargetMonth();
      incomePeriodValue.value = appData.calcSavedMoney();
      periodSelect.addEventListener('change', ()=>incomePeriodValue.value = appData.calcSavedMoney());
   },
   // Дополнительные расходы
   getExpenses(){
      expensesItems.forEach((item)=>{
         let itemExpenses = item.querySelector('.expenses-title').value;
         let cachExpenses = +item.querySelector('.expenses-amount').value;
         // проверка валидности
         if(stringHandler(itemExpenses) && numberHandler(cachExpenses) && cachExpenses !== 0){
            appData.expenses[itemExpenses] = cachExpenses;
         }else{
            console.error('Значения "Обязательных расходов" не верно!');
         }
      });
   },
   // Дополнительные расходы добавить
   addExpensesBlock(){
      let cloneExpensesItem = expensesItems[0].cloneNode(true);
      expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
      expensesItems = document.querySelectorAll('.expenses-items');
      if (expensesItems.length === 3){
         expensesPlus.style.display = 'none';
      }
   },
   // Дополнительные доходы
   getIncome(){
      incomeItems.forEach((item)=>{
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = +item.querySelector('.income-amount').value;
              // проверка валидности
            if(stringHandler(itemIncome) && numberHandler(cashIncome)){
                  appData.income[itemIncome] = +cashIncome;
            }else{
               console.error('Значения "Дополнительных доходов" не верно!');
            }        
      });
      for(let key in appData.income){
         appData.incomeMonth += +appData.income[key];
      }
   },
   // Дополнительные доходы добавить
   addIncomeBlock(){
      let cloneIncomeItem = incomeItems[0].cloneNode(true);
      incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
      incomeItems = document.querySelectorAll('.income-items');
      if (incomeItems.length === 3){
         incomePlus.style.display = 'none';
      }
   },
   // Возможные расходы
   getAddExpenses(){
      let addExpenses = additionalExpensesItem.value.split(',');
      addExpenses.forEach((item)=>{
         item = item.trim();
         if(item !== '' && stringHandler(item)){
            appData.addExpenses.push(item);
         }else{
            console.error('Введите возможные расходы, если их нет напишите нет!');
         }
      });
   },
   // Возможный доход
   getAddIncome(){
      additionalIncomeItem.forEach((item)=>{
         let itemValue = item.value.trim();
         if(itemValue !== '' && stringHandler(itemValue)){
            appData.addIncome.push(itemValue);
         }else{
            console.error('Введите возможные доходы, если их нет напишите нет!');
         }
      });
   },
   // расчет обязательные расходы (итого:)
   getExpensesMonth: function () {
      let sum = 0;
      for (let key in appData.expenses) {
         sum += appData.expenses[key];
      }

      appData.expensesMonth = sum;
   },
   // расчет накопления за месяц
   getBudget: function () {
      appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
      appData.budgetDay = Math.floor(+appData.budgetMonth / 30);
   },
   // расчет достижения цели
   getTargetMonth: function () {
      return Math.ceil(targetAmount.value / appData.budgetMonth);
   },
   // определение статуса клиента
   getStatusIncome: function () {
      if (appData.budgetDay > 1200) {
         return ('У вас высокий уровень дохода');
      } else if (appData.budgetDay > 600 && appData.budgetDay < 1200) {
         return ('У вас средний уровень дохода');
      } else if (appData.budgetDay < 600 && appData.budgetDay > 0) {
         return ('К сожалению у вас уровень дохода ниже среднего');
      } else if (appData.budgetDay < 0) {
         return ('Что то пошло не так');
      }
   },
   getInfoDeposit() {
      if (appData.deposit) {
         appData.percentDeposit = modal('Какой годовой процент?', numberHandler);
         appData.moneyDeposit = modal('Какая сумма заложенна?', numberHandler);
      }
   },
   // расчет накопления за период
   calcSavedMoney() {
      return appData.budgetMonth * periodSelect.value;
   },
   // обнуляем значения обьекта
   resetValues(){
      appData.income = {};
      appData.incomeMonth = 0;
      appData.addIncome = [];
      appData.addExpenses = [];
   }
};


   start.addEventListener('click', ()=>{
      if(salaryAmount.value === ''){
         return console.error('Поле "Месячный доход" не может быть пустым');
      }else{
         return appData.start();
      }
      
   } );


expensesPlus.addEventListener('click', appData.addExpensesBlock);
incomePlus.addEventListener('click', appData.addIncomeBlock);
periodSelect.addEventListener('change', ()=>periodAmount.textContent = periodSelect.value);
