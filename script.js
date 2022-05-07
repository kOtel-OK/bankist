'use strict';

// Data
const account1 = {
  owner: 'Roman Kotelnykov',
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
let currentAccount;

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

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, idx) {
    const movementType = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${movementType}">${
      idx + 1
    } ${movementType}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calculateBalance = function (movements) {
  const balance = movements.reduce((acc, el) => (acc += el));

  labelBalance.textContent = `${balance}€`;
};

const calculateSummary = function (movements) {
  console.log(currentAccount);
  const incomes = movements.reduce((acc, el) => (el > 0 ? acc + el : acc), 0);
  const withdrawal = movements.reduce(
    (acc, el) => (el < 0 ? acc + Math.abs(el) : acc),
    0
  );
  const interest = movements
    .filter(el => el > 0)
    .map(el => (el * currentAccount.interestRate) / 100)
    .filter(el => el > 1)
    .reduce((acc, el) => acc + el);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${withdrawal}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accounts) {
  accounts.forEach(el => {
    el.username = el.owner
      .split(' ') //split a string to an array by ' '
      .map(el => el[0].toLowerCase()) //returning a new array with first letters
      .join(''); //join an array to a string
  });
};

const logOutTimer = function (min = 5, sec = 0) {
  let timeToLogOut = (min * 60 + sec) * 1000; //convert total time to milleseconds

  const counter = setInterval(function () {
    if (sec === 0) {
      min -= 1;
      sec = 59;
    } else {
      sec -= 1;
    }

    timeToLogOut -= 1000;
    labelTimer.textContent = `${String(min).length === 1 ? '0' + min : min}:${
      String(sec).length === 1 ? '0' + sec : sec
    }`;
  }, 1000);

  setTimeout(function () {
    clearInterval(counter);

    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'Log in to get started';
  }, timeToLogOut);
};

const login = function (e) {
  e.preventDefault();
  const user = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  if (pin && user) {
    currentAccount = accounts.find(el => el.username === user);
    if (currentAccount?.pin === pin) {
      //checking with optional chaining if account exist
      containerApp.style.opacity = '1';
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;
      //clearing the input fields
      //assigment sign works from right to left, so we can do this
      inputLoginUsername.value = inputLoginPin.value = '';
      //remove focus
      inputLoginPin.blur();
      inputLoginUsername.blur();

      displayMovements(currentAccount.movements);
      calculateBalance(currentAccount.movements);
      calculateSummary(currentAccount.movements);
      logOutTimer(1, 5); //set minutes and seconds to log out
    }
  }
};

createUserNames(accounts);

btnLogin.addEventListener('click', login);
