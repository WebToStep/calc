'use strict';
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
   return !isNaN(parseFloat(value) && isFinite(value));
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

let money,
   start = function () {
      do {
         money = modal('Ваш месячный доход?');
         // console.log('money: ', money);
      } while (!numberHandler(money));
   };

start();

let appData = {
   // Доход
   budget: money,
   // чистая прибыль в день
   budgetDay: 0,
   // чистая прибыль в месяц
   budgetMonth: 0,
   // основные расходы за месяц
   expensesMonth: 0,
   // Дополнительные расходы за месяц
   expensesAmount: 0,
   // 
   income: {},
   addIncome: [],
   // статьи обязательных расходов
   expenses: {},
   // статьи дополнительных расходов
   addExpenses: [],
   // есть ли депозит?
   deposit: false,
   mission: 2200000,
   period: 12,
   asking: function () {
      // дополнительные расходы
      appData.addExpenses = 
      modal('Перечислите возможные расходы за рассчитываемый период через запятую. (пример: "Квартплата, проездной, кредит")', stringHandler)
      .toLocaleLowerCase()
      .split(',');

      // есть ли депозит?
      appData.deposit = confirm('Есть ли у вас депозит в банке?');

      appData.expensesAmount = function () {
         let sum = 0;

         for (let i = 0; i < 2; i++) {
            let key = modal(`Введите обязательную статью расходов ${i + 1}?`, stringHandler);
            let value = modal('Во сколько это обойдется?', numberHandler);

            appData.expenses[key] = value;
            sum += value;
         }

         return sum;
      }();
   },
   // расчеты
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
      appData.budgetMonth = appData.budget - appData.expensesAmount;
      appData.budgetDay = Math.floor(+appData.budgetMonth / 30);
   },

   getTargetMonth: function () {
      return Math.floor(appData.mission / appData.budgetMonth);
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
   }
};


// вызов функций
appData.asking();
appData.getExpensesMonth();
appData.getBudget();


let targetEndInfo = function () {
   let target = appData.getTargetMonth();
   if (target > 0) {
      return console.log(`Цель будет достигнута через ${target} месяца`);
   } else {
      return console.log('Цель не будет достигнута');
   }
}();


console.log(appData.getStatusIncome());
console.log('Расходы за месяц: ', appData.expensesAmount);


