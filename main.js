'use strict';
// вызов модального окна
const modal = (text, test) => {
   let value = prompt(text);

   // если value true и число
   if (test) {
      if (test(value) && !!parseFloat(value)) {
         console.log('value число: ', value);
         return +value;
         // если value true и строка
      } else if (test(value) && !parseFloat(value)) {
         console.log('value строка: ', value);
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
   // console.log('приходит', value);
   console.log('!isNaN число: ', !isNaN(parseFloat(value) && isFinite(value)));
   return !isNaN(parseFloat(value) && isFinite(value));
};

// Проверка ввода строки
const stringHandler = (value) => {
   if (value === null || value === '' || value === undefined) {
      console.log('value 1: ', value);
      return false;
   } else if (!Number.isNaN(parseFloat(value))) {
      console.log('value 2: ', value);
      return false;
   } else {
      console.log('value 3: ', value);
      return true;
   }

};
let money,
   start = function () {
      do {
         money = modal('Ваш месячный доход?');
         console.log('money: ', money);
      } while (!numberHandler(money));
   };

start();

let appData = {
   // Дополнительные расходы
   income: {},
   addIncome: [],
   // статьи обязательных расходов
   expenses: {},
   addExpenses: [],
   // есть ли депозит?
   deposit: false,
   // deposit: function isDeposit() {
   //    let value = prompt('Есть ли у вас депозит в банке? (Введите Да или Нет)');

   //    if (value === null || value === '') {
   //       confirm('Введите значение');
   //       return isDeposit();
   //    } else if (!Number.isNaN(parseFloat(value))) {
   //       confirm('Пожалуйста введите верное значение');
   //       return isDeposit();
   //    } else if (value.toLowerCase() === 'нет') {
   //       value = false;
   //       return value;
   //    }
   //    else if (value.toLowerCase() === 'да') {
   //       value = true;
   //       return value;
   //    } else {
   //       confirm('Пожалуйста введите верное значение');
   //       return isDeposit();
   //    }
   // },
   mission: 2200000,
   period: 12,
   asking: function () {
      // дополнительные расходы
      appData.addExpenses = modal(`
         Перечислите возможные расходы за рассчитываемый период
         через запятую. (пример: "Квартплата, проездной, кредит")
         `, stringHandler).toLocaleLowerCase().split(',');

      // есть ли депозит?
      appData.deposit = () => {
         let value = prompt('Есть ли у вас депозит в банке? (Введите Да или Нет)');

         if (value === null || value === '') {
            confirm('Введите значение');
            return this();
         } else if (!Number.isNaN(parseFloat(value))) {
            confirm('Пожалуйста введите верное значение');
            return this();
         } else if (value.toLowerCase() === 'нет') {
            value = false;
            return value;
         }
         else if (value.toLowerCase() === 'да') {
            value = true;
            return value;
         } else {
            confirm('Пожалуйста введите верное значение');
            return this();
         }
      };
   }
};

// определение статуса клиента
const getStatusIncome = () => {
   if (budgetDay > 1200) {
      return ('У вас высокий уровень дохода');
   } else if (budgetDay > 600 && budgetDay < 1200) {
      return ('У вас средний уровень дохода');
   } else if (budgetDay < 600 && budgetDay > 0) {
      return ('К сожалению у вас уровень дохода ниже среднего');
   } else if (budgetDay < 0) {
      return ('Что то пошло не так');
   }
};





// расчет обязательные расходы (итого:)
let getExpensesMonth = function () {
   let sum = 0;

   for (let i = 0; i < 2; i++) {
      appData.expenses[i] = modal('Введите обязательную статью расходов?', stringHandler);
      sum += modal('Во сколько это обойдется?', numberHandler);
   }
   console.log('sum: ', sum);
   return sum;
};

// расходы за месяц
let expensesAmount = getExpensesMonth();

// расчет накопления за месяц
const getAccumulatedMonth = () => {
   return money - expensesAmount;
};

// чистая прибыль
let accumulatedMonth = getAccumulatedMonth();
// чистая прибыль в день
let budgetDay = Math.floor(accumulatedMonth / 30);

// период достижения цели
const getTargetMonth = () => {
   let result = appData.mission / accumulatedMonth;

   if (result > 0) {
      return console.log(`Цель будет достигнута через ${Math.floor(result)} месяца`);
   } else {
      return console.log('Цель не будет достигнута');
   }
};
getTargetMonth();





console.log('Статьи расходов :', appData.expenses);
console.log('Итого доходы за месяц: ', money);
console.log('Итого расходы за месяц: ', expensesAmount);
console.log('Итого чистой прибыли за месяц: ', accumulatedMonth);
console.log('Вывод возможных расходов в виде массива: ', appData.addExpenses);
console.log('Бюджет на день: ', budgetDay);
console.log('Статус дохода: ', getStatusIncome());

