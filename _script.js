'use strict';

// Data
const account1 = {
  owner: 'Roman Kotelnykov',
  accountNumber: 5199304798345699,
  movements: [22200, 450, -400, 3000, -650, -130, 70, 1300],
  mo: [{ m: 22200, d: '2019-11-18T21:31:17.178Z' }],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  accountNumber: 5199091874857111,
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

let currentAccount;
let timeCounter;
// let timeTimer;
let accNameMasked;
let accNameVisibled;
//state variables
let accountVisibility;
let sortedMaxToMin;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelAccountNumber = document.querySelector('.account__number');
const labelAccountVisibility = document.querySelector('.acc_visibility__lable');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelSort = document.querySelector('.sort__label');

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

const createAccountNumber = function () {
  if (
    currentAccount.accountNumber &&
    String(currentAccount.accountNumber).length === 16
  ) {
    accNameVisibled = String(currentAccount.accountNumber)
      .split('')
      .map((el, idx) => (idx % 4 === 0 ? ' ' + el : el)) //remainderoperator
      .join('');

    accNameMasked = [];

    for (const [idx, el] of accNameVisibled.split(' ').entries()) {
      if (el) {
        if (idx !== 0 && idx !== accNameVisibled.split(' ').length - 1) {
          accNameMasked.push('XXXX');
        } else {
          accNameMasked.push(el);
        }
      }
    }

    accNameMasked = accNameMasked.join(' ');
    labelAccountNumber.textContent = accNameMasked;
    accountVisibility = false;

    labelAccountVisibility.addEventListener('click', displayAccountNumber);
  } else
    console.error(
      String(currentAccount.accountNumber).length,
      'Check an account number!'
    );
};

const displayAccountNumber = function () {
  if (accountVisibility) {
    labelAccountNumber.textContent = accNameMasked;
    accountVisibility = false;
  } else {
    labelAccountNumber.textContent = accNameVisibled;
    accountVisibility = true;
  }
};

const displayDate = function (date = Date.now(), showHour = false) {
  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // weekday: 'short',
  };

  if (showHour) {
    dateOptions.hour = 'numeric';
    dateOptions.minute = 'numeric';
  }

  return new Intl.DateTimeFormat(currentAccount.locale, dateOptions).format(
    new Date(date)
  );
};

const formatCurrency = function (value, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };

  return Intl.NumberFormat(locale, options).format(value);
};

const displayMovements = function (currentAccount) {
  containerMovements.innerHTML = '';
  currentAccount.movements.forEach(function (mov, idx) {
    const movementDate = currentAccount.movementsDates[idx];
    const movementType = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${movementType}">${
      idx + 1
    } ${movementType}</div>
    <div class="movements__date">${displayDate(movementDate, true)}</div>
    <div class="movements__value">${formatCurrency(
      mov,
      currentAccount.locale,
      currentAccount.currency
    )}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calculateBalance = function (movements) {
  const balance = (currentAccount.balance = movements.reduce(
    (acc, el) => (acc += el)
  ));

  labelBalance.textContent = `${formatCurrency(
    balance,
    currentAccount.locale,
    currentAccount.currency
  )}`;
};

const calculateSummary = function (movements) {
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

  labelSumIn.textContent = `${formatCurrency(
    incomes,
    currentAccount.locale,
    currentAccount.currency
  )}`;
  labelSumOut.textContent = `${formatCurrency(
    withdrawal,
    currentAccount.locale,
    currentAccount.currency
  )}`;
  labelSumInterest.textContent = `${formatCurrency(
    interest,
    currentAccount.locale,
    currentAccount.currency
  )}`;
};

const createUserNames = function (accounts) {
  accounts.forEach(el => {
    el.username = el.owner
      .split(' ') //split a string to an array by ' '
      .map(el => el[0].toLowerCase()) //returning a new array with first letters
      .join(''); //join an array to a string
  });
};

const updateUI = function () {
  displayMovements(currentAccount);
  calculateBalance(currentAccount.movements);
  calculateSummary(currentAccount.movements);
  logOutTimer(0, 30, currentAccount.locale); //set minutes and seconds to reset logout timer
};

const transferMoney = function (e) {
  e.preventDefault();
  const recipient = accounts.find(el => el.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  const transferDate = new Date().toISOString();
  //checking exists and if recipient not the same as a sender
  //checking if sum is positive and if money enought to transfer
  if (
    recipient &&
    recipient !== currentAccount &&
    amount > 0 &&
    currentAccount.balance >= amount
  ) {
    recipient.movements.push(amount);
    recipient.movementsDates.push(transferDate);

    currentAccount.movements.push(-Math.abs(amount));
    currentAccount.movementsDates.push(transferDate);

    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();

    updateUI();
  }
};

const loanRequests = function (e) {
  e.preventDefault();
  const loan = Math.floor(inputLoanAmount.value);
  const transferDate = new Date().toISOString();

  if (
    loan > 0 &&
    currentAccount.movements.some(el => el > loan + (loan / 100) * 10)
  ) {
    setTimeout(() => {
      //simulating banc accteption delaying fot the loan
      currentAccount.movements.push(loan);
      currentAccount.movementsDates.push(transferDate);

      updateUI();
    }, 3000);

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
};

const sortMovements = function () {
  if (!sortedMaxToMin) {
    currentAccount.movements.sort((a, b) => (a < b ? -1 : 1));
    // currentAccount.movementsDates.sort((a, b) => (a < b ? -1 : 1));
    labelSort.textContent = 'arrow_upward';
    sortedMaxToMin = true;
  } else {
    currentAccount.movements.sort((a, b) => (a > b ? -1 : 1));
    // currentAccount.movementsDates.sort((a, b) => (a > b ? -1 : 1));
    labelSort.textContent = 'arrow_downward';
    sortedMaxToMin = false;
  }
  updateUI();
};

const closeAccount = function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (currentAccount.username === user && currentAccount.pin === pin) {
    //using findIndex to find index of account to be removed
    const idx = accounts.findIndex(el => el.owner === currentAccount.owner);
    console.log(idx);
    accounts.splice(idx, 1);
    //set deleted accoun to undefined
    currentAccount = undefined;
    inputClosePin.value = inputCloseUsername.value = '';

    containerApp.style.opacity = '0';
    labelWelcome.textContent = `Log in to get started`;
  }
};

const logOutTimer = function (min = 5, sec = 0, locale) {
  timeCounter && clearInterval(timeCounter);

  const timer = () => {
    //separate function to preventing delaying of timer execution
    const options = {
      minute: 'numeric',
      second: 'numeric',
    };

    labelTimer.textContent = Intl.DateTimeFormat(locale, options).format(time);

    if (time === 0) {
      clearInterval(timeCounter);

      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'Log in to get started';
    }

    time -= 1000;
  };
  let time = (min * 60 + sec) * 1000;
  timer(); //calling function before timer

  timeCounter = setInterval(timer, 1000);
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

      labelDate.textContent = displayDate();

      createAccountNumber();
      // sortMovements();
      //clearing the input fields
      //assigment sign works from right to left, so we can do this
      inputLoginUsername.value = inputLoginPin.value = '';
      //remove focus
      inputLoginPin.blur();
      inputLoginUsername.blur();

      updateUI();
    }
  }
};

createUserNames(accounts);

btnLogin.addEventListener('click', login);
btnTransfer.addEventListener('click', transferMoney);
btnClose.addEventListener('click', closeAccount);
btnLoan.addEventListener('click', loanRequests);
btnSort.addEventListener('click', sortMovements);
