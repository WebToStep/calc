const money = 3000,
      income = 'руб.',
      addExpenses = ['майка', 'футболка', 'рубашка'],
      deposit = 2, 
      mission = money * deposit, 
      period = '24 часа';

      function EndPlus(){
         if(deposit === 1){
            return 'у';
         }else if(deposit >= 2 && deposit <= 4){
            return 'и';
         }else{
            return ' и т.д.';
         }
      }

let endStr = EndPlus();

alert('Внимание!!! Акция действует ' + period);
console.log('Hello World!');
console.log(`
купи ${deposit + ' ' + addExpenses[1].slice(0, -1)}${endStr} всего за ${money + income} 
`);
console.warn('Спасибо за урок "!"');

