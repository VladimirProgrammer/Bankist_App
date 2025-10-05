'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, -306.5, 25000, -642.21, 125],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2025-09-03T10:17:24.185Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
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
const account3 = {
  owner: 'Valdemar Tau',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

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
  currency: 'RUB',
  locale: 'ru-RU',
};

const accounts = [account1, account2, account3];

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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const formatCurrency = function (value, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};
const formatMovementDates = function (date, locale) {
  const now = new Date();
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dateGap = calcDaysPassed(now, date);

  /*
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
*/
  // Using date internalization
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const internal = new Intl.DateTimeFormat(locale, options).format(date);

  if (dateGap === 0) return 'Today';
  if (dateGap <= 7) return `${dateGap} days ago`;
  else return internal; //return `${day}/${month}/${year}`;
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]);

    const dispDateFull = formatMovementDates(date, acc.locale);
    const movData = formatCurrency(mov, acc.locale, acc.currency);
    //const dispDateFull = `${labelDates}/${labelMonth}/${labelYear}`;

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${dispDateFull}</div>

        <div class="movements__value">${movData}</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);

  labelBalance.innerHTML = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcPrintSummary = function (acc) {
  const incomes = acc.movements
    .filter((mov, i, arr) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  //console.log(incomes);

  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = formatCurrency(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

//console.log(accounts);
/*
const deposits = movements.filter(mov => mov < 0);

const withdrawals = movements.filter(mov => mov > 0);

const el = movements.find(el => el < 0);
console.log(el);

const ourEl = accounts.find(el => el.owner === 'Jonas Schmedtmann');
console.log(ourEl);

for (const el of accounts) {
  if (el.owner === 'Jonas Schmedtmann') {
    console.log(el);
  }
}
*/

accounts.map(
  acc =>
    (acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(el => el.slice(0, 1))
      .join(''))
);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcPrintBalance(acc);
  // Display summary
  calcPrintSummary(acc);
};
// Event handlers

let currentAccount, timer;
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    //Print the time to UI
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  //Set timer to 5 minutes

  let time = 300;

  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
  //0 seconds -> exit
};
// Fake always currentaccount 1
/*currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;
*/

btnLogin.addEventListener('click', function (e) {
  // По умолчанию для html принажатии кнопки Submit страница перезагружается, чтобы этого избежать используем
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  //console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 100;

    // Creating current date label and time
    const now = new Date();
    /*
    const labelYear = now.getFullYear();
    const labelDates = `${now.getDate()}`.padStart(2, 0);
    const labelMonth = `${now.getMonth() + 1}`.padStart(2, 0);
    const labelHour = `${now.getHours()}`.padStart(2, 0);
    const labelMin = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${labelDates}/${labelMonth}/${labelYear}, ${labelHour}:${labelMin}`;
    */

    // Using date interanalization
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const internal = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    labelDate.textContent = internal;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const reciever = accounts.find(acc => acc.userName === inputTransferTo.value);
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    reciever &&
    currentAccount.balance >= amount &&
    reciever?.userName !== currentAccount.userName
  ) {
    // Transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    reciever.movementsDates.push(new Date().toISOString());
    reciever.movements.push(amount);
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  setTimeout(() => {
    const amount = Math.floor(inputLoanAmount.value);
    if (
      amount > 0 &&
      currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      inputLoanAmount.value = '';
    }
  }, 2500);
  clearInterval(timer);
  timer = startLogOutTimer();
});
// close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    //console.log(index);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

const now = new Date();

const internal = new Intl.DateTimeFormat('ru-US').format(now);
//console.log(internal);

// Для показа времин, нужен объект options

const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
};
// month : "numeric", "long", "2-digit"
// week: "long", "short", "narrow"
const internal2 = new Intl.DateTimeFormat('ru-US', options).format(now);
//console.log(internal2);
// iso language code table
// https://gist.github.com/eddieoz/63d839c8a20ef508cfa4fa9562632a21

// определение своего места
const local = navigator.language;
//console.log(local);

// Интарнализация цифр
// Бфзовый спосособ
const num = 39234234.23;

//console.log('US', new Intl.NumberFormat('en-US').format(num));
//console.log('Rus', new Intl.NumberFormat('ru-RU').format(num));
//console.log('Germany', new Intl.NumberFormat('de-DE').format(num));
//console.log('Syria', new Intl.NumberFormat('ar-SY').format(num));
/*console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language).format(num)
);*/

// С опциями
const options2 = {
  style: 'unit',
  unit: 'mile-per-hour',
};
//console.log('US', new Intl.NumberFormat('en-US', options2).format(num));
const options3 = {
  style: 'percent',
  unit: 'mile-per-hour',
};
//console.log('Rus', new Intl.NumberFormat('ru-RU', options3).format(num));
const options4 = {
  style: 'currency',
  unit: 'mile-per-hour',
  currency: 'EUR',
};
//console.log('Rus', new Intl.NumberFormat('ru-RU', options4).format(num));
// Отмена группировки
const options5 = {
  style: 'currency',
  unit: 'mile-per-hour',
  currency: 'RUB',
  useGrouping: 'false',
};

//console.log('Russia', new Intl.NumberFormat('ru-RU', options5).format(num));

// SetTimeout - выполняется один раз после определения времени в миллисекундах
// SetUnterval - выполняется бесконечно до тех пор пока мы не остановим его

// SetTimeout - включает в себя callback функцию, которыую высывает SetTimeOut в будущем в соотвесвтии с указанным временем

//setTimeout(() => console.log('Here is your pizza'), 3000);
// ... 3 секунды... Here is your pizza

// Указывая аргументы

/*setTimeout(
  (ing1, ing2, ing3) => console.log(`Pizza with ${ing1}, ${ing2}, ${ing3}`),
  3000,
  'cheeze',
  'sausage',
  'butter'
);*/

// Аргументы можно поместить в массив и использовать spread
// Это ассинхронная работа и SetTimeout будет выполнятся строго в отведенное время, а другой код выполнится
//console.log('Waiting...');
const ingredients = ['cheeze', 'sausage', 'butter'];
setTimeout(
  (ing1, ing2, ing3) => console.log(`Pizza with ${ing1}, ${ing2}, ${ing3}`),
  5000,
  ...ingredients
);

// Отмена выполнения
const ingredients2 = ['One', 'Two', 'Three'];
const pizza = setTimeout(
  (ing1, ing2, ing3) => {
    //console.log(`Pizza with ${ing1}, ${ing2}, ${ing3}`);
  },
  3000,
  ...ingredients2
);
if (ingredients.includes('cheeze')) clearTimeout(pizza); /// -> nothing

// setInterval
// Если нам нужно запускать функцию снова и снова, мы используем setInterval

setInterval(function () {
  const now = new Intl.DateTimeFormat('ru-RU', {
    timeStyle: 'long',
    timeZone: 'Europe/Moscow',
  }).format(new Date());
  //console.log(now);
}, 1000);
