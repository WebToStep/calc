'use strict';

let money = numberHandler('Ваш месячный доход?'),
income = 'фриланс',
addExpenses = stringHandler('Перечислите возможные расходы за рассчитываемый период через запятую. (пример: "Квартплата, проездной, кредит")'),
deposit = isDeposit(), 
mission = 2200000, 
period = 12,
expenses1 = stringHandler('Введите обязательную статью расходов?'),
amount1 = numberHandler('Во сколько это обойдется?'),
expenses2 = stringHandler('Введите обязательную статью расходов?'),
amount2 = numberHandler('Во сколько это обойдется?'),
budgetMonth = money - amount1 - amount2,
budgetDay = Math.floor(budgetMonth/30);


console.log('Месячный бюджет budgetMonth: ', budgetMonth);
console.log('Цель будет достигнута через: ', Math.ceil( mission/budgetMonth));
console.log('Дневной бюджет с учетом расходов budgetDay: ', budgetDay);


if(budgetDay > 1200){
   alert('У вас высокий уровень дохода');
}else if(budgetDay > 600 && budgetDay < 1200){
   alert('У вас средний уровень дохода');
} else if(budgetDay < 600 && budgetDay > 0){
   alert('К сожалению у вас уровень дохода ниже среднего');
} else if(budgetDay < 0){
   alert('Что то пошло не так');
}


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

console.log('income: ', typeof income);
console.log('deposit: ', typeof deposit);


console.log('addExpenses: ', addExpenses.length);

console.log('“Период равен ' + period + ' месяцев”');
console.log('“Цель заработать ' + mission + ' рублей/долларов/гривен/юани”');

console.log('addExpenses: ', addExpenses.toLocaleLowerCase().split(','));

console.log('budgetDay: ', budgetDay);