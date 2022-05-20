'use strict';

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

// // returns all html document
// document.documentElement;

// // returns special parts of html
// document.head;
// document.body;

// // returns the first matches element
// document.querySelector('.header');

// // returns Nodelist of all matches elements
// document.querySelectorAll('.section');

// // returns element by ID
// document.getElementById('section--1');

// // returns HTMLCollection of all elements by element name
// document.getElementsByTagName('button'); // returns all buttons

// // returns HTMLCollection of all elements by class name
// document.getElementsByClassName('btn');

// creates and returns DOM element
// can be uses only ones - becose it is a 'live' element of HTMLCollection
const message = document.createElement('div'); // not yet in the DOM
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for impoved functuanality and analytics';
message.innerHTML = `We use cookies for impoved functuanality and analytics. <button class=" btn--close--cookie">Got it!</button>`;

// prepend - inserts created element as a first child of a parent element
// document.querySelector('.header').prepend(message);
// append - inserts created element as a last child of a parent element
// document.querySelector('.header').append(message);
// before - inserts created element before of a parent element
// document.querySelector('.header').before(message);
// after - inserts created element after of a parent element
// document.querySelector('.header').after(message);
// if we want use element multiple times, we must create a copy of this element
// .cloneNode - makes copy of element

// insertAdjacentElement - unserts an element - 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
document.querySelector('.header').insertAdjacentElement('beforebegin', message);

// remove() - removse the element from the DOM
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', () => message.remove());
