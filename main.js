'use strict';
// *********получение элементов со страницы
const start = document.getElementById('start'),
   cancel = document.getElementById('cancel'),
   btnPlus = document.querySelectorAll('.btn_plus'),
   incomePlus = btnPlus[0],
   expensesPlus = btnPlus[1],
   additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
   depositCheck = document.querySelector('#deposit-check'),
   budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
   budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
   additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
   additionalExpensesItem = document.querySelector('.additional_expenses-item'),
   incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
   targetMonthValue = document.getElementsByClassName('target_month-value')[0],
   expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
   salaryAmount = document.querySelector('.salary-amount'),
   incomeTitle = document.querySelector('.income-title'),
   incomeAmount = document.querySelector('.income-amount'),
   expensesTitle = document.querySelector('.expenses-title'),
   expensesAmount = document.querySelector('.expenses-amount'),
   additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
   periodSelect = document.querySelector('.period-select'),
   targetAmount = document.querySelector('.target-amount'),
   periodAmount = document.querySelector('.period-amount'),
   inputs = document.querySelectorAll('input'),
   iputsGroupData = document.querySelector('.data').querySelectorAll('input');

let incomeItems = document.querySelectorAll('.income-items'),
   expensesItems = document.querySelectorAll('.expenses-items');
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
   if (!isNaN(parseFloat(value)) && isFinite(value)) {
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
   } else if (value !== value.replace(/[^А-я 0-9 ,]/, '')) {
      console.error('Внимание, только русские символы!');
      return false;
   } else {
      return true;
   }
};

// проверка на соответствие символов
const inputHadler = () => {
   // inputs = document.querySelectorAll('input');
   inputs.forEach((i) => {
      i.addEventListener('input', () => {
         if (i.placeholder === 'Наименование' || i.placeholder === 'название') {
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
class AppData {
   constructor() {
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
   }

   // *****************методы AppData
   start() {
      // проверка на заполненный инпут старт
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
         this.getExpInc();
         this.getExpensesMonth();
         this.getAdedValues();
         this.getBudget();

         this.showResult();
         // this.getInfoDeposit();
      }
   }

   reset() {
      // обрабатываем кнопки
      start.style.display = 'block';
      cancel.style.display = 'none';
      expensesPlus.removeAttribute('disabled');
      incomePlus.removeAttribute('disabled');
      incomePlus.style.display = 'block';
      expensesPlus.style.display = 'block';

      // обнуляем исходные данные
      for (let key in this) {
         switch (typeof (this[key])) {
            case 'string': this[key] = ''; break;
            case 'number': this[key] = 0; break;
            case 'boolean': this[key] = false; break;
            case 'object':
               if (this[key] instanceof Array) {
                  this[key] = [];
               } else {
                  this[key] = {};
               }
         }
      }

      // чистим дом элементы
      iputsGroupData.forEach(i => {
         i.disabled = false;
         if (i.type === 'text' || i.type === 'checkbox') {
            i.value = '';
         } else if (i.type === 'range') {
            i.value = 1;
         }
      });
      this.showResult();
      targetMonthValue.value = '';

      // удаляем лишние инпуты
      expensesItems = document.querySelectorAll('.expenses-items');
      expensesItems.forEach((i, key) => {
         if (key > 0) {
            i.remove();
         }
      });
      incomeItems = document.querySelectorAll('.income-items');
      incomeItems.forEach((i, key) => {
         if (key > 0) {
            i.remove();
         }
      });
   }

   // вывод результатов на страницу
   showResult() {
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
   }
   // Дополнительные доход и расходы запись в обьект
   getExpInc() {
      const count = item => {
         const startStr = item.className.split('-')[0];
         const itemTitle = item.querySelector(`.${startStr}-title`).value;
         const itemAmount = +item.querySelector(`.${startStr}-amount`).value;
         // проверка валидности
         if (stringHandler(itemTitle) && numberHandler(itemAmount)) {
            this[startStr][itemTitle] = itemAmount;
         }
      };

      incomeItems = document.querySelectorAll('.income-items');
      expensesItems = document.querySelectorAll('.expenses-items');

      incomeItems.forEach(count);
      expensesItems.forEach(count);

      for (const key in this.income) {
         this.incomeMonth += +this.income[key];
      }
   }
   // Дополнительные доходы и расходы добавить
   addInputsGroup(e) {
      const startStr = e.target.className.split(' ')[1].slice(0, -4);
      const PlusBtn = document.querySelector(`.${startStr}_add`);
      const inputItems = document.querySelectorAll(`.${startStr}-items`);
      const cloneExpensesItem = inputItems[0].cloneNode(true);
      const newGroup = inputItems[0].parentNode.insertBefore(cloneExpensesItem, PlusBtn);

      newGroup.querySelectorAll('input').forEach((i) => {
         i.value = '';
      });

      if (inputItems.length >= 2) {
         PlusBtn.style.display = 'none';
      }

      inputHadler();
   }
   // Возможный доход и расход
   getAdedValues() {
      // Формируем массив расходы
      additionalExpensesItem.value.split(',').forEach((item) => {
         console.log(additionalExpensesItem.className.slice(11, -5));
         item = item.trim();
         if (item !== '' && stringHandler(item)) {
            this.addExpenses.push(item);
         }
      });
      // формируем массив доходы
      additionalIncomeItem.forEach((item) => {
         item = item.value.trim();
         if (item !== '' && stringHandler(item)) {
            this.addIncome.push(item);
         }
      });
   }
   // расчет обязательные расходы (итого:)
   getExpensesMonth() {
      let sum = 0;
      for (let key in this.expenses) {
         sum += this.expenses[key];
      }

      this.expensesMonth = sum;
   }
   // расчет накопления за месяц
   getBudget() {
      this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
      this.budgetDay = Math.floor(+this.budgetMonth / 30);
   }
   // расчет достижения цели
   getTargetMonth() {
      return Math.ceil(targetAmount.value / this.budgetMonth);
   }
   // getInfoDeposit() {
   //    if (this.deposit) {
   //       this.percentDeposit = modal('Какой годовой процент?', numberHandler);
   //       this.moneyDeposit = modal('Какая сумма заложенна?', numberHandler);
   //    }
   // }
   // расчет накопления за период
   calcSavedMoney() {
      return this.budgetMonth * periodSelect.value;
   }
   // ****************Обработка событий
   eventsListeners() {
      // проверка введено ли поле месячный доход
      start.addEventListener('mouseover', () => {
         if (salaryAmount.value === '') {
            start.style.cursor = 'not-allowed';
         } else {
            start.style.cursor = '';
         }
      });

      document.addEventListener('keypress', (e) => {
         if (e.key === 'Enter') {
            this.start();
         }
      });
      start.addEventListener('click', () => this.start());
      cancel.addEventListener('click', () => this.reset());
      btnPlus.forEach(i => i.addEventListener('click', (e) => this.addInputsGroup(e)));
      periodSelect.addEventListener('change', () => periodAmount.textContent = periodSelect.value);
   }
}

const appData = new AppData();
appData.eventsListeners();
inputHadler();