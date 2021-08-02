console.warn('Hard code');

const num = 266219;
let numArr = num.toString().split('');

let count = +numArr[0];
for(let i = 1; i < numArr.length; i++){
   count *= +numArr[i];
}
let degree = count ** 3;
console.log('Умноженый массив: ', count);
console.log('Итоговое число в степени 3: ', degree);
// method 1
console.log('Первые 2 цифры полученного числа: ', degree.toString().slice(0, 2));
// method 2
// console.log('Первые 2 цифры полученного числа: ', degree.toString()[0] + degree.toString()[1]);



