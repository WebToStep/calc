'use strict';

let money = numberHandler('Ваш месячный доход?'),
income = 'фриланс',
addExpenses = stringHandler('Перечислите возможные расходы за рассчитываемый период через запятую. (пример: "Квартплата, проездной, кредит")'),
deposit = isDeposit(), 
mission = 2200000, 
period = 12,
// обязательные расходы
expenses1 = stringHandler('Введите обязательную статью расходов?'),
amount1 = numberHandler('Во сколько это обойдется?'),
expenses2 = stringHandler('Введите обязательную статью расходов?'),
amount2 = numberHandler('Во сколько это обойдется?'),

// чистая прибыль
accumulatedMonth = getAccumulatedMonth(),
// чистая прибыль в день
budgetDay = Math.floor(accumulatedMonth/30),
// определение статуса клиента
getStatusIncome = function(){
   if(budgetDay > 1200){
      return('У вас высокий уровень дохода');
   }else if(budgetDay > 600 && budgetDay < 1200){
      return('У вас средний уровень дохода');
   } else if(budgetDay < 600 && budgetDay > 0){
      return('К сожалению у вас уровень дохода ниже среднего');
   } else if(budgetDay < 0){
      return('Что то пошло не так');
   }
},
showTypeOf = function(data){
   console.log(data, typeof(data));
};

// Обработчик ввода числа
function numberHandler(text){
   let value = +prompt(text);

   if(null || value === 0){
      confirm('Введите значение');
      return numberHandler();
   }else if(isNaN(parseFloat(value))){
      confirm('Пожалуйста введите только цифры');
      return numberHandler();
   }else{
      return value;
   }

}
// обработчик ввода строки
function stringHandler(text){
   let Value = prompt(text);

   if(Value === null || Value === ''){
      confirm('Введите значение');
      return stringHandler();
   }else if(!Number.isNaN(parseFloat(Value))){
      confirm('Введите верное значение');
      return stringHandler();
   }else{
      return Value;
   }

}
// есть ли депозит?
function isDeposit(){
   let Value = prompt('Есть ли у вас депозит в банке? (Введите Да или Нет)');

   if(Value === null || Value === ''){
      confirm('Введите значение');
      return isDeposit();
   }else if(!Number.isNaN(parseFloat(Value))){
      confirm('Пожалуйста введите верное значение');
      return isDeposit();
   }else if(Value.toLowerCase() === 'нет'){
      Value = false;
      return Value;
   }
   else if(Value.toLowerCase() === 'да'){
      Value = true;
      return Value;
   }else{
      confirm('Пожалуйста введите верное значение');
      return isDeposit();
   }


}
// обязательные расходы
function getExpensesMonth(){
   return amount1 + amount2;
}
// накопления за месяц
function getAccumulatedMonth(){
   return money - getExpensesMonth();
}
// период достижения цели
function getTargetMonth(){
   let result = mission / accumulatedMonth;
   return Math.floor(result);
}

showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);

console.log('Расходы за месяц вызов: ', getExpensesMonth());
console.log('Вывод возможных расходов в виде массива: ', addExpenses.toLocaleLowerCase().split(','));
console.log('Cрок достижения цели в месяцах: ', getTargetMonth());
console.log('Бюджет на день: ', budgetDay);
console.log('getStatusIncome(): ', getStatusIncome());

