'use strict';

///////////////////////////////////////
// Main navigation

const nav = document.querySelector('.nav__links');

nav.addEventListener('click', function (e) {
  const target = e.target.getAttribute('href');

  if (e.target.hasAttribute('href') && !!target.slice(1)) {
    e.preventDefault();
    document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Nav fading effect

const navFadeHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    [...nav.children].forEach(el => {
      if (el !== e.target.parentElement) {
        el.style.opacity = this;
      }
    });
  }
};

nav.addEventListener('mouseover', navFadeHandler.bind(0.5));
nav.addEventListener('mouseout', navFadeHandler.bind(1));

///////////////////////////////////////
// Scroll to section 1

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

btnScrollTo.addEventListener('click', function (e) {
  // properties x, y of BoundingClientRect relative to viewport - distance from element to top or left border of the page`s visible part
  const s1coords = section1.getBoundingClientRect();

  // Scrolling MODERN WAY;))
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//the nodelist has forEach method
btnsOpenModal.forEach(el => el.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Tabbed component

document
  .querySelector('.operations__tab-container')
  .addEventListener('click', function (e) {
    const tabBtn = e.target.closest('button');

    // Guard clause
    // Prevents of code execution if condition false
    if (!tabBtn) return;

    const content = document.querySelector(
      `.operations__content--${tabBtn.dataset.tab}`
    );

    document
      .querySelectorAll('.operations__content')
      .forEach(el => el.classList.remove('operations__content--active'));

    document
      .querySelectorAll('.operations__tab')
      .forEach(el => el.classList.remove('operations__tab--active'));

    content.classList.add('operations__content--active');
    tabBtn.classList.add('operations__tab--active');
  });

///////////////////////////////////////
// Cookies window

// creates and returns DOM element
// can be uses only ones - becose it is a 'live' element of HTMLCollection
const message = document.createElement('div'); // not yet in the DOM
message.classList.add('cookie-message');
message.style.top = `${this.document.documentElement.clientHeight - 40}px`;

// message.textContent = 'We use cookies for impoved functuanality and analytics';
message.innerHTML = `We use cookies for impoved functuanality and analytics. <button class=" btn--close--cookie">Got it!</button>`;

// insertAdjacentElement - inserts an element - 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
document.querySelector('.header').insertAdjacentElement('beforebegin', message);

window.addEventListener('resize', function () {
  message.style.top = `${this.document.documentElement.clientHeight - 40}px`;
});

// remove() - removse the element from the DOM
document.querySelector('.btn--close--cookie').onclick = () => message.remove();
