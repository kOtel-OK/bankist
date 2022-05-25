'use strict';

const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const featuresImages = document.querySelectorAll('img[data-src]');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

///////////////////////////////////////
// Main navigation

navLinks.addEventListener('click', function (e) {
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
    [...navLinks.children].forEach(el => {
      if (el !== e.target.parentElement) {
        el.style.opacity = this;
        el.style.transition = 'all, 0.5s';
      }
    });
  }
};

navLinks.addEventListener('mouseover', navFadeHandler.bind(0.4));
navLinks.addEventListener('mouseout', navFadeHandler.bind(1));

///////////////////////////////////////
// Scroll to section 1

btnScrollTo.addEventListener('click', function (e) {
  // Scrolling MODERN WAY;))
  allSections[0].scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Sticky Navigation
// Modern and more perfomanced way with Intersection Observer API

const obsCallback = function (entries, observer) {
  const [entry] = entries; // Entries destructuring

  if (!entry.isIntersecting) {
    // isIntersecting - property, described if the target intersects the root
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const obsOptions = {
  root: null, // Null means viewport
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
  threshold: 0, //
};
const observer = new IntersectionObserver(obsCallback, obsOptions);

observer.observe(header); // Target

///////////////////////////////////////
// Sections Revealing with Intersection Observer API

allSections.forEach(el => el.classList.add('section--hidden'));

const sectionObsCallback = function (entries, observer) {
  const [entry] = entries;

  // Guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObsOptions = {
  root: null,
  // delay: 0, // Delaying in milliseconds
  // rootMargin: '0px',
  threshold: 0.2,
};

const sectionObserver = new IntersectionObserver(
  sectionObsCallback,
  sectionObsOptions
);

allSections.forEach(el => {
  sectionObserver.observe(el);
});

///////////////////////////////////////
// Lazy Loading Images
const featuresImgsCallback = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.setAttribute('src', entry.target.dataset.src);

  // Listening when an image has loaded
  entry.target.addEventListener('load', function () {
    this.classList.remove('lazy-img');
    featuresObserver.unobserve(entry.target);
  });
};

const featuresObserver = new IntersectionObserver(featuresImgsCallback, {
  root: null,
  threshold: 0.4,
});

featuresImages.forEach(el => {
  featuresObserver.observe(el);
});

///////////////////////////////////////
// Modal window

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
