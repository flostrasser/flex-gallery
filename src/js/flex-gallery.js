import {
  getLoopedIndex,
  loadThumbnail,
  removeChildren,
  createElement,
  fadeIn,
  fadeOut,
  mapRange,
} from './utils.js';

import { loadImage } from './helpers.js';

// options
const DEFAULT_OPTIONS = {
  swipingThreshold: 5,
  transitionDuration: 400,
  slideChangeThreshold: 150,
};

let options = {};

// lightbox variables
let lightbox;
let lightboxWrapper;
let images = [];
let currentIndex = 0;
let wasSwiping = false;

// slides variables
let currentSlide;
let prevSlide;
let nextSlide;
let distance = 0;
let startPos = 0;
let slideWidth = 0;

function showInitialImage(index) {
  prevSlide = lightbox.querySelector('.lightbox-slide[data-state="prev"]');
  currentSlide = lightbox.querySelector('.lightbox-slide[data-state="current"]');
  nextSlide = lightbox.querySelector('.lightbox-slide[data-state="next"]');
  const currentImage = currentSlide.querySelector('.lightbox-image');

  loadImage(images, currentSlide, index);

  const imageLoadHandler = () => {
    loadImage(images, prevSlide, index - 1);
    loadImage(images, nextSlide, index + 1);
    currentImage.removeEventListener('load', imageLoadHandler);
  };

  currentImage.addEventListener('load', imageLoadHandler);
}

// slide 'mousemove' and 'touchmove' event handler
function handleSlideMove(event) {
  const currentPos = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
  distance = currentPos - startPos;

  if (distance < -options.swipingThreshold || distance > options.swipingThreshold)
    wasSwiping = true;

  // move current slide and adjust opacity
  currentSlide.style.transform = `translateX(${distance}px)`;
  // eslint-disable-next-line prettier/prettier
  currentSlide.style.opacity = mapRange(Math.abs(distance), 0, slideWidth, 1, 0);

  // TODO: reset slide if (currentPos > slideWidth || currentPos < 0)   (not sure if necessary)

  if (distance < 0) {
    // move next slide and adjust opacity
    nextSlide.style.transform = `translateX(${slideWidth + distance}px)`;
    nextSlide.style.opacity = mapRange(Math.abs(distance), 0, slideWidth, 0, 1);
  } else {
    // move previous slide and adjust opacity
    prevSlide.style.transform = `translateX(${distance - slideWidth}px)`;
    prevSlide.style.opacity = mapRange(Math.abs(distance), 0, slideWidth, 0, 1);
  }
}

function transformSlide(slide, translateX, opacity) {
  slide.style.transform = `translateX(${translateX})`;
  slide.style.opacity = opacity;
  slide.style.transitionDuration = `${options.transitionDuration}ms`;
  slide.removeEventListener('mousemove', handleSlideMove);
  slide.removeEventListener('touchmove', handleSlideMove);
  distance = 0;
}

function showNextSlide() {
  transformSlide(prevSlide, '100%', 0);
  transformSlide(currentSlide, '-100%', 0);
  transformSlide(nextSlide, '0px', 1);
}

function showPrevSlide() {
  transformSlide(prevSlide, '0px', 1);
  transformSlide(currentSlide, '100%', 0);
  transformSlide(nextSlide, '-100%', 0);
}

function resetSlide() {
  transformSlide(prevSlide, '-100%', 0);
  transformSlide(currentSlide, '0px', 1);
  transformSlide(nextSlide, '100%', 0);
}

function closeLightbox() {
  const lightboxImages = lightbox.querySelectorAll('.lightbox-image');
  // fade out
  fadeOut(lightboxWrapper).then(() => {
    lightboxImages.forEach(image => {
      image.src = '';
    });
    lightboxImages.forEach(image => {
      image.srcset = '';
    });
  });
}

// lightbox 'keydown' event handler
function handleLightboxKeyDown(event) {
  if (event.key === 'ArrowLeft') {
    showPrevSlide();
    updateLightbox('prev');
  } else if (event.key === 'ArrowRight') {
    showNextSlide();
    updateLightbox('next');
  } else if (event.key === 'Escape') {
    closeLightbox();
    // remove 'keydown' event handler from document element
    document.documentElement.removeEventListener('keydown', handleLightboxKeyDown);
  }
}

function removeSlideEventListeners() {
  // keyboard event listener
  document.documentElement.removeEventListener('keydown', handleLightboxKeyDown);

  // arrow buttons event listener
  lightbox
    .querySelector('.lightbox-arrow.arrow-left')
    .removeEventListener('click', handleClickLeftArrow);
  lightbox
    .querySelector('.lightbox-arrow.arrow-right')
    .removeEventListener('click', handleClickRightArrow);
}

function updateSlideVariables() {
  currentSlide = document.querySelector('.lightbox-slide[data-state="current"]');
  prevSlide = document.querySelector('.lightbox-slide[data-state="prev"]');
  nextSlide = document.querySelector('.lightbox-slide[data-state="next"]');
}

function updateLightboxHeader(index) {
  index = getLoopedIndex(images, index);
  const { title } = images[index];

  lightbox.querySelector('.lightbox-title').textContent = title;
  lightbox.querySelector('.lightbox-numbers').textContent = `${index + 1}/${images.length}`;
}

// slide 'mousedown' and 'touchstart' event handler
function handleMouseDownOrTouchStart(event) {
  startPos = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
  slideWidth = currentSlide.offsetWidth;
  wasSwiping = false;

  currentSlide.style.transitionDuration = '0ms';
  currentSlide.addEventListener('mousemove', handleSlideMove);
  currentSlide.addEventListener('touchmove', handleSlideMove);
}

// slide 'mouseup' and 'touchend' event handler
function handleMouseUpOrTouchEnd() {
  if (distance < -options.slideChangeThreshold) {
    showNextSlide();
    updateLightbox('next');
  } else if (distance > options.slideChangeThreshold) {
    showPrevSlide();
    updateLightbox('prev');
  } else {
    resetSlide();
    updateLightbox('current');
  }
}

function addSlideEventListeners() {
  // mouse & touch event listener
  currentSlide.addEventListener('mousedown', handleMouseDownOrTouchStart);
  currentSlide.addEventListener('touchstart', handleMouseDownOrTouchStart);
  currentSlide.addEventListener('mouseup', handleMouseUpOrTouchEnd);
  currentSlide.addEventListener('touchend', handleMouseUpOrTouchEnd);
  currentSlide.addEventListener('touchcancel', handleMouseUpOrTouchEnd);

  // keyboard event listener
  document.documentElement.addEventListener('keydown', handleLightboxKeyDown);

  // click on arrow
  lightbox
    .querySelector('.lightbox-arrow.arrow-left')
    .addEventListener('click', handleClickLeftArrow);
  lightbox
    .querySelector('.lightbox-arrow.arrow-right')
    .addEventListener('click', handleClickRightArrow);
}

function updateLightbox(newSlide) {
  if (newSlide !== 'current') removeSlideEventListeners();

  setTimeout(() => {
    // reset transition duration
    [currentSlide, nextSlide, prevSlide].forEach(element => {
      element.style.transitionDuration = '0ms';
    });

    let index;

    if (newSlide === 'next') {
      prevSlide.dataset.state = 'next';
      nextSlide.dataset.state = 'current';
      currentSlide.dataset.state = 'prev';

      index = getLoopedIndex(images, currentIndex + 1);
      loadImage(images, prevSlide, index + 1);
    } else if (newSlide === 'prev') {
      prevSlide.dataset.state = 'current';
      currentSlide.dataset.state = 'next';
      nextSlide.dataset.state = 'prev';

      index = getLoopedIndex(images, currentIndex - 1);
      loadImage(images, nextSlide, index - 1);
    } else {
      return;
    }

    updateSlideVariables();
    addSlideEventListeners();
    updateLightboxHeader(index);

    currentIndex = index;
  }, options.transitionDuration);
}

// slide 'click' event handler
function handleSlideClick(event) {
  if (event.currentTarget === event.target && !wasSwiping) {
    closeLightbox();
    document.documentElement.removeEventListener('keydown', handleLightboxKeyDown);
  }
}

function addLightboxEventListeners() {
  // close lightbox when clicking on background
  lightbox.querySelectorAll('.lightbox-slide').forEach(slide => {
    slide.addEventListener('click', handleSlideClick);
  });

  // close lightbox when clicking on close button
  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.addEventListener('click', closeLightbox);
}

// left arrow 'click' event handler
function handleClickLeftArrow() {
  showPrevSlide();
  updateLightbox('prev');
}

// right arrow 'click' event handler
function handleClickRightArrow() {
  showNextSlide();
  updateLightbox('next');
}

function initSlides() {
  updateSlideVariables();
  addSlideEventListeners();
  addLightboxEventListeners();
}

function openLightbox(currentGallery, targetIndex) {
  fadeIn(lightbox.parentNode);

  images = [];
  currentGallery.querySelectorAll('.gallery-item').forEach(element => {
    const currentImageEl = element.querySelector('img');

    const currentItem = {
      src: currentImageEl.dataset.image || currentImageEl.dataset.src,
      srcFallback: currentImageEl.dataset.imageFallback,
      srcset: currentImageEl.dataset.imageSrcset,
      title: currentImageEl.dataset.title,
    };

    images.push(currentItem);
  });

  currentIndex = targetIndex;
  showInitialImage(targetIndex);
  updateLightboxHeader(targetIndex);
}

// ------------------------------ //
// Create Lightbox DOM Elements,
// Append Lightbox to Body
// ------------------------------ //
function createLightbox() {
  // lightbox & wrapper
  lightboxWrapper =
    document.querySelector('.lightbox-wrapper') || createElement('div', 'lightbox-wrapper');
  removeChildren(lightboxWrapper);
  lightbox = createElement('div', 'lightbox');

  // Header
  const lightboxHeader = createElement('div', 'lightbox-header');
  const lightboxNumbers = createElement('div', 'lightbox-numbers');
  const lightboxTitle = createElement('div', 'lightbox-title');
  const lightboxClose = createElement('button', 'lightbox-close', {
    type: 'button',
    'aria-label': 'Close',
  });
  lightboxHeader.append(lightboxNumbers, lightboxTitle, lightboxClose);
  lightbox.append(lightboxHeader);

  // Slides Wrapper
  const slidesWrapper = createElement('div', 'lightbox-slides-wrapper');
  lightbox.append(slidesWrapper);

  // Slides
  prevSlide = createElement('div', 'lightbox-slide', {
    'data-state': 'prev',
  });
  currentSlide = createElement('div', 'lightbox-slide', {
    'data-state': 'current',
  });
  nextSlide = createElement('div', 'lightbox-slide', {
    'data-state': 'next',
  });
  slidesWrapper.append(prevSlide, currentSlide, nextSlide);

  // Image
  const lightboxImage = createElement('img', 'lightbox-image', {
    hidden: true,
    draggable: false,
  });
  currentSlide.append(lightboxImage);
  prevSlide.append(lightboxImage.cloneNode());
  nextSlide.append(lightboxImage.cloneNode());

  // Loading Spinner
  const spinner =
    '<div class="lightbox-spinner" role="status" hidden><span>Loading...</span></div>';
  currentSlide.insertAdjacentHTML('beforeend', spinner);
  prevSlide.insertAdjacentHTML('beforeend', spinner);
  nextSlide.insertAdjacentHTML('beforeend', spinner);

  // Arrows
  lightbox.insertAdjacentHTML('beforeend', '<div class="lightbox-arrow arrow-left"></div>');
  lightbox.insertAdjacentHTML('beforeend', '<div class="lightbox-arrow arrow-right"></div>');

  // Footer
  const lightboxFooter = createElement('div', 'lightbox-footer');
  lightbox.append(lightboxFooter);

  // append lightbox to body
  lightboxWrapper.append(lightbox);
  document.body.append(lightboxWrapper);
}

// uses progressive image loading
const createGallery = () => {
  const galleryThumbs = document.querySelectorAll('.gallery-item .thumb');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      rootMargin: '200px 0px',
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadThumbnail(entry.target);
          observer.unobserve(entry.target);
        }
      });
    };

    const intersectionObserver = new IntersectionObserver(handleIntersection, observerOptions);

    galleryThumbs.forEach(el => intersectionObserver.observe(el));
  } else {
    // Fallback for unsupported browsers
    galleryThumbs.forEach(el => loadThumbnail(el));
  }

  const galleries = document.querySelectorAll('.gallery');

  galleries.forEach(gallery => {
    const currentGalleryItems = gallery.querySelectorAll('.gallery-item');

    currentGalleryItems.forEach(item =>
      item.addEventListener('click', e => {
        const itemIndex = Array.from(currentGalleryItems).indexOf(e.currentTarget);
        openLightbox(gallery, itemIndex);
        initSlides();
      })
    );
  });
};

export const flexGallery = customOptions => {
  options = { ...DEFAULT_OPTIONS, ...customOptions };
  createLightbox();
  createGallery();
};

export default flexGallery;
