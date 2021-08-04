'use strict';

// статьи обязательных расходов
const expenses = [],
income = 'фриланс',
// deposit = isDeposit(), 
mission = 2200000, 
period = 12;


// определение статуса клиента
const getStatusIncome = () => {
   if(budgetDay > 1200){
      return('У вас высокий уровень дохода');
   }else if(budgetDay > 600 && budgetDay < 1200){
      return('У вас средний уровень дохода');
   } else if(budgetDay < 600 && budgetDay > 0){
      return('К сожалению у вас уровень дохода ниже среднего');
   } else if(budgetDay < 0){
      return('Что то пошло не так');
   }
};

// const showTypeOf = function(data){
//    console.log(data, typeof(data));
// };

// вызов модального окна
const modal = (text, test) => {
   let value = prompt(text);

   // если value true и число
   if(test(value) && !!parseFloat(value)){
      console.log('value число: ', value);
      return +value;
   // если value true и строка
   }else if(test(value) && !parseFloat(value)){
      console.log('value строка: ', value);
      return value;
   }else{
      confirm('Введите верное значение');
      modal(text, test);
   }
};


// Проверка ввода числа
const numberHandler = (value) => {
   // console.log('приходит', value);
   console.log('!isNaN число: ', !isNaN( parseFloat(value) && isFinite(value) ));
   return !isNaN( parseFloat(value) && isFinite(value) );
};

// Проверка ввода строки
const stringHandler = (value) => {
   if(value === null || value === ''){
      return false;
   }else if(!Number.isNaN(parseFloat(value))){
      return false;
   }else{
      return true;
   }

};

// есть ли депозит?
const isDeposit = () => {
   let value = prompt('Есть ли у вас депозит в банке? (Введите Да или Нет)');

   if(value === null || value === ''){
      confirm('Введите значение');
      return isDeposit();
   }else if(!Number.isNaN(parseFloat(value))){
      confirm('Пожалуйста введите верное значение');
      return isDeposit();
   }else if(value.toLowerCase() === 'нет'){
      value = false;
      return value;
   }
   else if(value.toLowerCase() === 'да'){
      value = true;
      return value;
   }else{
      confirm('Пожалуйста введите верное значение');
      return isDeposit();
   }
};

// расчет обязательные расходы (итого:)
let getExpensesMonth = function(){
   let sum = 0;
   
   for(let i = 0; i < 2; i++) {
      expenses[i] = modal('Введите обязательную статью расходов?', stringHandler);
      sum += modal('Во сколько это обойдется?', numberHandler);
   }
   console.log('sum: ', sum);
   return sum;
};


// доходы за месяц (через callback проверяем на цифры)
let money = modal('Ваш месячный доход?', numberHandler),
// расходы за месяц
expensesAmount = getExpensesMonth();

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
   let result = mission / accumulatedMonth;
   return Math.floor(result);
};

// Строка слишком длинная незнаю как перенести так как это значение передается в функцию
const addExpenses = modal(`
   Перечислите возможные расходы за рассчитываемый период
   через запятую. (пример: "Квартплата, проездной, кредит")
   `, stringHandler).toLocaleLowerCase().split(',');

// showTypeOf(money);
// showTypeOf(income);
// showTypeOf(deposit);
console.log('Статьи расходов :', expenses);
console.log('Итого доходы за месяц: ', money);
console.log('Итого расходы за месяц: ', expensesAmount);
console.log('Итого чистой прибыли за месяц: ', accumulatedMonth);
console.log('Вывод возможных расходов в виде массива: ', addExpenses);
console.log('Cрок достижения цели в месяцах: ', getTargetMonth());
console.log('Бюджет на день: ', budgetDay);
console.log('Статус дохода: ', getStatusIncome());

