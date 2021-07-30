const money = 30000,
income = 'фриланс',
addExpenses = 'интернет, такси, коммуналка',
deposit = true, 
mission = 2200000, 
period = 12,
budgetDay = money/30;

console.log('money: ', typeof money);
console.log('income: ', typeof income);
console.log('deposit: ', typeof deposit);

console.log('addExpenses: ', addExpenses.length);

console.log('“Период равен ' + period + ' месяцев”');
console.log('“Цель заработать ' + mission + ' рублей/долларов/гривен/юани”');

console.log('addExpenses: ', addExpenses.toLocaleLowerCase().split(','));

console.log('budgetDay: ', budgetDay);