"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = flexGallery;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// options
var options = {
  swipingThreshold: 5,
  transitionDuration: 400,
  slideChangeThreshold: 150
}; // lightbox variables

var lightbox;
var lightboxWrapper;
var images = [];
var currentIndex = 0;
var wasSwiping = false; // slides variables

var currentSlide;
var prevSlide;
var nextSlide;
var distance = 0;
var startPos = 0;
var slideWidth = 0; // feature detection

var isSrcsetSupported = ('srcset' in new Image());

function flexGallery(_options) {
  Object.assign(options, _options);
  createGallery();
  createLightbox();
} // uses progressive image loading


function createGallery() {
  var galleryItems = document.querySelectorAll('.gallery-item');
  var galleryThumbs = document.querySelectorAll('.gallery-item .thumb');

  var loadThumbnail = function loadThumbnail(target) {
    // get the src and srcset from the dataset of the gallery thumb
    var src = target.dataset.src;
    var srcset = target.dataset.srcset; // create a temporary image

    var tempImage = new Image(); // set the src or srcset of the temp img to preload the actual image file

    if (isSrcsetSupported && srcset) {
      tempImage.srcset = srcset;
    } else if (src) {
      tempImage.src = src;
    } // when the temp image is loaded, set the src or srcset to the gallery thumb


    tempImage.onload = function () {
      if (tempImage.srcset) {
        target.srcset = srcset;
      } else if (src) {
        target.src = src;
      }

      target.classList.remove('placeholder');
    };
  };

  if ('IntersectionObserver' in window) {
    var observerOptions = {
      rootMargin: '200px 0px'
    };

    var handleIntersectionObserver = function handleIntersectionObserver(entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadThumbnail(entry.target);
          intersectionObserver.unobserve(entry.target);
        }
      });
    };

    var intersectionObserver = new IntersectionObserver(handleIntersectionObserver, observerOptions);
    galleryThumbs.forEach(function (el) {
      return intersectionObserver.observe(el);
    });
  } else {
    // Fallback for unsupported browsers
    galleryThumbs.forEach(function (el) {
      return loadThumbnail(el);
    });
  }

  galleryItems.forEach(function (item) {
    return item.addEventListener('click', function (e) {
      var currentTarget = e.currentTarget;
      var currentGallery = currentTarget.closest('.gallery');
      var itemIndex = Array.from(galleryItems).indexOf(e.currentTarget);
      openLightbox(currentGallery, itemIndex);
      initSlides();
    });
  });
}

function openLightbox(currentGallery, targetIndex) {
  fadeIn(lightbox.parentNode);
  images = [];
  currentGallery.querySelectorAll('.gallery-item').forEach(function (element) {
    var currentImageEl = element.querySelector('img');
    var currentItem = {
      src: currentImageEl.dataset.image || currentImageEl.dataset.src,
      srcFallback: currentImageEl.dataset.imageFallback,
      srcset: currentImageEl.dataset.imageSrcset,
      title: currentImageEl.dataset.title
    };
    images.push(currentItem);
  });
  currentIndex = targetIndex;
  showInitialImage(targetIndex);
  updateLightboxHeader(targetIndex);
}

function showInitialImage(index) {
  var prevSlide = lightbox.querySelector('.lightbox-slide[data-state="prev"]');
  var currentSlide = lightbox.querySelector('.lightbox-slide[data-state="current"]');
  var nextSlide = lightbox.querySelector('.lightbox-slide[data-state="next"]');
  var currentImage = currentSlide.querySelector('.lightbox-image');
  loadImage(currentSlide, index);

  var imageLoadHandler = function imageLoadHandler(e) {
    loadImage(prevSlide, index - 1);
    loadImage(nextSlide, index + 1);
    currentImage.removeEventListener('load', imageLoadHandler);
  };

  currentImage.addEventListener('load', imageLoadHandler);
} // ------------------------------ //
// Create Lightbox DOM Elements,
// Append Lightbox to Body
// ------------------------------ //


function createLightbox() {
  // lightbox & wrapper
  lightboxWrapper = createElement('div', 'lightbox-wrapper');
  lightbox = createElement('div', 'lightbox'); // Header

  var lightboxHeader = createElement('div', 'lightbox-header');
  var lightboxNumbers = createElement('div', 'lightbox-numbers');
  var lightboxTitle = createElement('div', 'lightbox-title');
  var lightboxClose = createElement('button', 'lightbox-close', {
    type: 'button',
    'aria-label': 'Close'
  });
  lightboxHeader.append(lightboxNumbers, lightboxTitle, lightboxClose);
  lightbox.append(lightboxHeader); // Slides Wrapper

  var slidesWrapper = createElement('div', 'lightbox-slides-wrapper');
  lightbox.append(slidesWrapper); // Slides

  var prevSlide = createElement('div', 'lightbox-slide', {
    'data-state': 'prev'
  });
  var currentSlide = createElement('div', 'lightbox-slide', {
    'data-state': 'current'
  });
  var nextSlide = createElement('div', 'lightbox-slide', {
    'data-state': 'next'
  });
  slidesWrapper.append(prevSlide, currentSlide, nextSlide); // Image

  var lightboxImage = createElement('img', 'lightbox-image', {
    draggable: false
  });
  currentSlide.append(lightboxImage);
  prevSlide.append(lightboxImage.cloneNode());
  nextSlide.append(lightboxImage.cloneNode()); // Loading Spinner

  var spinner = '<div class="spinner spinner-border" role="status"><span class="sr-only">Loading...</span></div>';
  currentSlide.insertAdjacentHTML('beforeend', spinner);
  prevSlide.insertAdjacentHTML('beforeend', spinner);
  nextSlide.insertAdjacentHTML('beforeend', spinner); // Arrows

  lightbox.insertAdjacentHTML('beforeend', '<div class="lightbox-arrow arrow-left"></div>');
  lightbox.insertAdjacentHTML('beforeend', '<div class="lightbox-arrow arrow-right"></div>'); // Footer

  var lightboxFooter = createElement('div', 'lightbox-footer');
  lightbox.append(lightboxFooter); // append lightbox to body

  lightboxWrapper.append(lightbox);
  document.body.append(lightboxWrapper);
}

function addLightboxEventListeners() {
  // close lightbox when clicking on background
  lightbox.querySelectorAll('.lightbox-slide').forEach(function (slide) {
    slide.addEventListener('click', handleSlideClick);
  }); // close lightbox when clicking on close button

  var closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.addEventListener('click', closeLightbox);
}

function closeLightbox() {
  var lightboxImages = lightbox.querySelectorAll('.lightbox-image'); // fade out

  fadeOut(lightboxWrapper).then(function () {
    lightboxImages.forEach(function (image) {
      return image.src = '';
    });
    lightboxImages.forEach(function (image) {
      return image.srcset = '';
    });
  }); // remove 'keydown' event handler from document element

  document.documentElement.removeEventListener('keydown', handleLightboxKeyDown);
} // slide 'click' event handler


function handleSlideClick(event) {
  if (event.currentTarget == event.target && !wasSwiping) closeLightbox();
} // slide 'mousemove' and 'touchmove' event handler


function handleSlideMove(event) {
  var currentPos = event.type == 'touchmove' ? event.touches[0].clientX : event.clientX;
  distance = currentPos - startPos;
  if (distance < -options.swipingThreshold || distance > options.swipingThreshold) wasSwiping = true; // move current slide and adjust opacity

  currentSlide.style.transform = "translateX(".concat(distance, "px)");
  currentSlide.style.opacity = mapRange(Math.abs(distance), 0, slideWidth, 1, 0); // TODO: reset slide if (currentPos > slideWidth || currentPos < 0)   (not sure if necessary)

  if (distance < 0) {
    // move next slide and adjust opacity
    nextSlide.style.transform = "translateX(".concat(slideWidth + distance, "px)");
    nextSlide.style.opacity = mapRange(Math.abs(distance), 0, slideWidth, 0, 1);
  } else {
    // move previous slide and adjust opacity
    prevSlide.style.transform = "translateX(".concat(distance - slideWidth, "px)");
    prevSlide.style.opacity = mapRange(Math.abs(distance), 0, slideWidth, 0, 1);
  }
} // slide 'mousedown' and 'touchstart' event handler


function handleMouseDownOrTouchStart(event) {
  startPos = event.type == 'touchstart' ? event.touches[0].clientX : event.clientX;
  slideWidth = currentSlide.offsetWidth;
  wasSwiping = false;
  currentSlide.style.transitionDuration = '0ms';
  currentSlide.addEventListener('mousemove', handleSlideMove);
  currentSlide.addEventListener('touchmove', handleSlideMove);
} // slide 'mouseup' and 'touchend' event handler


function handleMouseUpOrTouchEnd(event) {
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
} // lightbox 'keydown' event handler


function handleLightboxKeyDown(event) {
  if (event.key == 'ArrowLeft') {
    showPrevSlide();
    updateLightbox('prev');
  } else if (event.key == 'ArrowRight') {
    showNextSlide();
    updateLightbox('next');
  } else if (event.key == 'Escape') {
    closeLightbox();
  }
} // left arrow 'click' event handler


function handleClickLeftArrow(event) {
  showPrevSlide();
  updateLightbox('prev');
} // right arrow 'click' event handler


function handleClickRightArrow(event) {
  showNextSlide();
  updateLightbox('next');
}

function transformSlide(slide, translateX, opacity) {
  slide.style.transform = "translateX(".concat(translateX, ")");
  slide.style.opacity = opacity;
  slide.style.transitionDuration = "".concat(options.transitionDuration, "ms");
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

function updateLightbox(newSlide) {
  if (newSlide != 'current') removeSlideEventListeners();
  setTimeout(function () {
    // reset transition duration
    [currentSlide, nextSlide, prevSlide].forEach(function (element) {
      element.style.transitionDuration = '0ms';
    });
    var index;

    if (newSlide == 'next') {
      prevSlide.dataset.state = 'next';
      nextSlide.dataset.state = 'current';
      currentSlide.dataset.state = 'prev';
      index = getLoopedIndex(currentIndex + 1);
      loadImage(prevSlide, index + 1);
    } else if (newSlide == 'prev') {
      prevSlide.dataset.state = 'current';
      currentSlide.dataset.state = 'next';
      nextSlide.dataset.state = 'prev';
      index = getLoopedIndex(currentIndex - 1);
      loadImage(nextSlide, index - 1);
    } else {
      return;
    }

    updateSlideVariables();
    addSlideEventListeners();
    updateLightboxHeader(index);
    currentIndex = index;
  }, options.transitionDuration);
}

function removeSlideEventListeners() {
  // keyboard event listener
  document.documentElement.removeEventListener('keydown', handleLightboxKeyDown); // arrow buttons event listener

  lightbox.querySelector('.lightbox-arrow.arrow-left').removeEventListener('click', handleClickLeftArrow);
  lightbox.querySelector('.lightbox-arrow.arrow-right').removeEventListener('click', handleClickRightArrow);
}

function updateSlideVariables() {
  currentSlide = document.querySelector('.lightbox-slide[data-state="current"]');
  prevSlide = document.querySelector('.lightbox-slide[data-state="prev"]');
  nextSlide = document.querySelector('.lightbox-slide[data-state="next"]');
}

function addSlideEventListeners() {
  // mouse & touch event listener
  currentSlide.addEventListener('mousedown', handleMouseDownOrTouchStart);
  currentSlide.addEventListener('touchstart', handleMouseDownOrTouchStart);
  currentSlide.addEventListener('mouseup', handleMouseUpOrTouchEnd);
  currentSlide.addEventListener('touchend', handleMouseUpOrTouchEnd);
  currentSlide.addEventListener('touchcancel', handleMouseUpOrTouchEnd); // keyboard event listener

  document.documentElement.addEventListener('keydown', handleLightboxKeyDown); // click on arrow

  lightbox.querySelector('.lightbox-arrow.arrow-left').addEventListener('click', handleClickLeftArrow);
  lightbox.querySelector('.lightbox-arrow.arrow-right').addEventListener('click', handleClickRightArrow);
}

function initSlides() {
  updateSlideVariables();
  addSlideEventListeners();
  addLightboxEventListeners();
}

function updateLightboxHeader(index) {
  index = getLoopedIndex(index);
  var title = images[index].title;
  lightbox.querySelector('.lightbox-title').textContent = title;
  lightbox.querySelector('.lightbox-numbers').textContent = index + 1 + '/' + images.length;
}

function loadImage(targetSlide, index) {
  index = getLoopedIndex(index);
  var currentImage = targetSlide.querySelector('.lightbox-image');
  var spinner = targetSlide.querySelector('.spinner');
  var src = isSrcsetSupported ? images[index].src : images[index].srcFallback;
  var srcset = images[index].srcset;
  var tempImage = new Image();
  currentImage.setAttribute('src', '');
  currentImage.setAttribute('srcset', '');
  hide(currentImage);
  show(spinner);

  if (isSrcsetSupported && srcset) {
    tempImage.srcset = srcset;
  } else {
    tempImage.src = src;
  }

  var loadImageHandler = function loadImageHandler(e) {
    if (isSrcsetSupported && srcset) {
      currentImage.setAttribute('srcset', srcset);
    } else {
      currentImage.setAttribute('src', src);
    }

    hide(spinner);
    show(currentImage);
    currentImage.removeEventListener('load', loadImageHandler);
  };

  tempImage.addEventListener('load', loadImageHandler);
}

function getLoopedIndex(index) {
  if (index > images.length - 1) return 0;
  if (index < 0) return images.length - 1;
  return index;
} // ------------------------------ //
// Utility Functions
// ------------------------------ //


function fadeIn(element) {
  var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';
  var ms = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  return new Promise(function (resolve) {
    element.style.display = display;
    element.style.opacity = 0;
    var opacity = 0;
    var timer = setInterval(function () {
      opacity += 50 / ms;

      if (opacity >= 1) {
        clearInterval(timer);
        opacity = 1;
        resolve();
      }

      element.style.opacity = opacity;
    }, 50);
  });
}

function fadeOut(element) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
  return new Promise(function (resolve) {
    var opacity = 1;
    var timer = setInterval(function () {
      opacity -= 50 / ms;

      if (opacity <= 0) {
        clearInterval(timer);
        element.style.opacity = 0;
        element.style.display = 'none';
        resolve();
      } else {
        element.style.opacity = opacity;
      }
    }, 50);
  });
}

function show(element) {
  var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';
  element.style.display = display;
}

function hide(element) {
  element.style.display = 'none';
}

function createElement(type, className, attributesObj) {
  var element = document.createElement(type);

  if (Array.isArray(className)) {
    var _iterator = _createForOfIteratorHelper(className),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var name = _step.value;
        element.classList.add(name);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else if (className) {
    element.classList.add(className);
  }

  for (var attrName in attributesObj) {
    element.setAttribute(attrName, attributesObj[attrName]);
  }

  return element;
} // Re-maps a number from one range to another.


function mapRange(value, fromIn, toIn, fromOut, toOut) {
  return fromOut + (toOut - fromOut) * (value - fromIn) / (toIn - fromIn);
}