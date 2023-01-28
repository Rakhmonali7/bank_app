'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const dispalayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort  ? movements.slice().sort((a,b) => a-b) : movements; // here we used slice() in ordrer to create copy of movements array as we don't want change original array 

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov} €</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest} €`;
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  dispalayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display sumary
  calcDisplaySummary(acc);
};

// LOGIN
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // find account from object list
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and massage
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    } `;
    // Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // Udate UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    currentAccount?.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});
// Loan request
btnLoan.addEventListener('click', function(e){
  e.preventDefault()
  let amount = Number(inputLoanAmount.value).toExponential

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount)

    // update UI
    updateUI(currentAccount)
  }
  inputLoanAmount.value = '' 
})

//Close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && currentAccount?.pin === Number(inputClosePin.value)) {

    const index = accounts.findIndex( acc => acc.username === currentAccount.username)
    accounts.splice(index,1)
    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePin.value = '';
  
});

let sorted = false
btnSort.addEventListener('click', function(e){
  e.preventDefault()
  dispalayMovements(currentAccount.movements, !sorted)
  sorted = !sorted
})
    
/////////////////////////////////////////////////
// LECTURES
// challenge 1

// const Julia = [3, 5, 2, 12, 7];
// const Kate = [4, 1, 15, 8, 3];

// const Julia2 = [9, 16, 6, 8, 3];
// const Kate2 = [10, 5, 6, 1, 4];

// const sortAge = function (julia, kate) {
//   const copyOfJulia = julia.slice(1, -2);
//   const comb = [...copyOfJulia, ...kate];
//   comb.forEach(function (dog, i) {
//     dog >= 3
//       ? console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`)
//
// const convertTitleCase = function(str){
//   let exceptionLIst = ['a', 'an', 'the', 'with', 'on', 'in']
//   let title = str.toLowerCase().split(' ').map( word => exceptionLIst.includes(word) ? word : word[0].toUpperCase() + word.slice(1));
//   return title
// }

// console.log(convertTitleCase('This is a cat'));
// console.log(convertTitleCase('This IS an EXAMPLE'));
// console.log(convertTitleCase('TEST ME'));


// TEST DATA

const dogs =[
  {weight:22, curFood:23, owners:['Alice', 'Bob']},
  {weight:8, curFood:200, owners:['Matilda']},
  {weight:13, curFood:275, owners:['Sarah', 'John']},
  {weight:32, curFood:340, owners:['Michel']}
]

//1.
dogs.forEach(dog => dog.recFood = Math.trunc(dog.weight**0.75*28))


//2.
const dogSarah = dogs.find( dog => dog.owners.includes('Sarah'))
console.log(dogSarah);
console.log(`Sarah's dog eats ${dogSarah.curFood > dogSarah.recFood ? 'too much' : 'too little'}`);

//3.
const ownersEatTooMuch = dogs.filter( dog => dog.curFood > dog.recFood).flatMap( dog => dog.owners)
console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs.filter( dog => dog.curFood < dog.recFood).flatMap( dog => dog.owners)
console.log(ownersEatTooLittle);

//5
const eatProperly = dogs.some(dog => dog.curFood === dog.recFood)
console.log(eatProperly);

//6
const eatProperly2 = dogs.some(dog => dog.curFood > dog.recomFood * 0.9 && dog.curFood < recommended * 1.1)
console.log(eatProperly2);

//8
const checkEatingOkay = dog => dog.curFood > dog.curFood* 0.9 && curFood < dog.recFood* 1.1;

const lastStep = dogs.slice().sort((a,b) => a.recFood-b.recFood)
console.log(lastStep);
