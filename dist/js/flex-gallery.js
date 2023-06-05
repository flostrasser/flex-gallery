import { getLoopedIndex, mapRange } from './lib/utils.js';
import { fadeIn, trapFocus, disablePageScroll } from './lib/domUtils.js';
import { closeLightbox, createLightbox, getImages, getLightboxSlides, getTargetElement, initGalleryItems, loadSlideImage, updateLightboxHeader, } from './lib/helpers.js';
import { ELEMENTS, GalleryState, Keys, SlideType } from './lib/constants.js';
export const flexGallery = (target, customOptions = {}) => {
    // options
    const DEFAULT_OPTIONS = {
        swipingThreshold: 5,
        transitionDuration: 400,
        slideChangeThreshold: 150,
    };
    // global variables
    let focusTrap;
    let currentGalleryItemIndex;
    let wasSwiping = false;
    const options = { ...DEFAULT_OPTIONS, ...customOptions };
    // slide 'mousemove' and 'touchmove' event handler
    function handleSlideMove(event) {
        const currentPos = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
        distance = currentPos - startPos;
        if (distance < -options.swipingThreshold || distance > options.swipingThreshold)
            wasSwiping = true;
        // move current slide and adjust opacity
        currentSlide.style.transform = `translateX(${distance}px)`;
        currentSlide.style.opacity = mapRange(Math.abs(distance), 0, slideWidth, 1, 0);
        // TODO: reset slide if (currentPos > slideWidth || currentPos < 0)   (not sure if necessary)
        if (distance < 0) {
            // move next slide and adjust opacity
            nextSlide.style.transform = `translateX(${slideWidth + distance}px)`;
            nextSlide.style.opacity = mapRange(Math.abs(distance), 0, slideWidth, 0, 1);
        }
        else {
            // move previous slide and adjust opacity
            prevSlide.style.transform = `translateX(${distance - slideWidth}px)`;
            prevSlide.style.opacity = mapRange(Math.abs(distance), 0, slideWidth, 0, 1);
        }
    }
    function transformSlide(slide, translateX, opacity) {
        if (!slide)
            return;
        slide.style.transform = `translateX(${translateX})`;
        slide.style.opacity = opacity.toString();
        slide.style.transitionDuration = `${options.transitionDuration}ms`;
        // slide.removeEventListener('mousemove', handleSlideMove);
        // slide.removeEventListener('touchmove', handleSlideMove);
        // distance = 0;
    }
    function showNextSlide(lightboxElement) {
        const slides = getLightboxSlides(lightboxElement);
        transformSlide(slides.prev, '100%', 0);
        transformSlide(slides.current, '-100%', 0);
        transformSlide(slides.next, '0px', 1);
    }
    function showPrevSlide(lightboxElement) {
        const slides = getLightboxSlides(lightboxElement);
        transformSlide(slides.prev, '0px', 1);
        transformSlide(slides.current, '100%', 0);
        transformSlide(slides.next, '-100%', 0);
    }
    function resetSlide() {
        transformSlide(prevSlide, '-100%', 0);
        transformSlide(currentSlide, '0px', 1);
        transformSlide(nextSlide, '100%', 0);
    }
    // lightbox 'keydown' event handler
    // function handleLightboxKeyDown(event: KeyboardEvent) {
    //   if (event.key === Keys.ArrowLeft) {
    //     showPrevSlide();
    //     updateLightbox('prev');
    //   } else if (event.key === Keys.ArrowRight) {
    //     showNextSlide();
    //     updateLightbox('next');
    //   } else if (event.key === Keys.Escape) {
    //     closeLightbox();
    //   }
    // }
    // function removeSlideEventListeners() {
    //   // keyboard event listener
    //   document.documentElement.removeEventListener('keydown', handleLightboxKeyDown);
    //   // arrow buttons event listener
    //   lightbox
    //     .querySelector('.lightbox-arrow.arrow-left')
    //     .removeEventListener('click', handleClickLeftArrow);
    //   lightbox
    //     .querySelector('.lightbox-arrow.arrow-right')
    //     .removeEventListener('click', handleClickRightArrow);
    // }
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
        }
        else if (distance > options.slideChangeThreshold) {
            showPrevSlide();
            updateLightbox('prev');
        }
        else {
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
        // lightbox
        //   .querySelector('.lightbox-arrow.arrow-left')
        //   .addEventListener('click', handleClickLeftArrow);
        // lightbox
        //   .querySelector('.lightbox-arrow.arrow-right')
        //   .addEventListener('click', handleClickRightArrow);
    }
    function updateLightbox(lightboxElement, newSlide, images) {
        // if (newSlide !== 'current') removeSlideEventListeners();
        const slides = getLightboxSlides(lightboxElement);
        setTimeout(() => {
            // reset transition duration
            Object.values(slides).forEach(element => {
                if (element)
                    element.style.transitionDuration = '0ms';
            });
            let index;
            if (newSlide === SlideType.next) {
                if (slides.prev)
                    slides.prev.dataset.state = 'next';
                if (slides.next)
                    slides.next.dataset.state = 'current';
                if (slides.current)
                    slides.current.dataset.state = 'prev';
                index = getLoopedIndex(images, currentGalleryItemIndex + 1);
                loadSlideImage(images, slides.prev, getLoopedIndex(images, currentGalleryItemIndex + 1));
            }
            else if (newSlide === SlideType.prev) {
                if (slides.prev)
                    slides.prev.dataset.state = 'current';
                if (slides.current)
                    slides.current.dataset.state = 'next';
                if (slides.next)
                    slides.next.dataset.state = 'prev';
                index = getLoopedIndex(images, currentGalleryItemIndex - 1);
                loadSlideImage(images, slides.next, getLoopedIndex(images, index - 1));
            }
            else {
                return;
            }
            // addSlideEventListeners();
            updateLightboxHeader(lightboxElement, images, index);
            currentGalleryItemIndex = index;
        }, options.transitionDuration);
    }
    // left arrow 'click' event handler
    // function handleClickLeftArrow() {
    //   showPrevSlide();
    //   updateLightbox('prev');
    // }
    // right arrow 'click' event handler
    // function handleClickRightArrow() {
    //   showNextSlide();
    //   updateLightbox('next');
    // }
    // get gallery open state
    const isGalleryOpen = (galleryElement) => {
        return galleryElement.dataset.state === GalleryState.open;
    };
    const initLightBoxEvents = (galleryElement, lightboxElement, images) => {
        // close lightbox when clicking on background
        const lightboxSlides = lightboxElement.querySelectorAll(ELEMENTS.LightboxSlide.selector);
        lightboxSlides.forEach(slide => {
            slide.addEventListener('click', event => {
                if (!isGalleryOpen(galleryElement))
                    return;
                const isClickOnSlide = event.currentTarget === event.target && !wasSwiping;
                if (!isClickOnSlide)
                    return;
                closeLightbox(galleryElement, lightboxElement, focusTrap, currentGalleryItemIndex);
            });
        });
        // close lightbox when clicking on close button
        const closeBtn = lightboxElement.querySelector(ELEMENTS.lightboxClose.selector);
        closeBtn?.addEventListener('click', () => {
            if (!isGalleryOpen(galleryElement))
                return;
            closeLightbox(galleryElement, lightboxElement, focusTrap, currentGalleryItemIndex);
        });
        // close lightbox when pressing escape key
        lightboxElement.addEventListener('keydown', event => {
            if (!isGalleryOpen(galleryElement))
                return;
            if (event.key === Keys.Escape) {
                event.preventDefault();
                closeLightbox(galleryElement, lightboxElement, focusTrap, currentGalleryItemIndex);
            }
        });
        // show prev/next slide when pressing arrow right key
        lightboxElement.addEventListener('keydown', event => {
            if (!isGalleryOpen(galleryElement))
                return;
            if (event.key === Keys.ArrowRight) {
                showNextSlide(lightboxElement);
                updateLightbox(lightboxElement, SlideType.next, images);
            }
            else if (event.key === Keys.ArrowLeft) {
                showPrevSlide(lightboxElement);
                updateLightbox(lightboxElement, SlideType.prev, images);
            }
        });
        // show prev slide when clicking on left arrow button
        const arrowLeft = lightboxElement.querySelector(ELEMENTS.lightboxArrowLeft.selector);
        arrowLeft?.addEventListener('click', () => {
            if (!isGalleryOpen(galleryElement))
                return;
            showPrevSlide(lightboxElement);
            updateLightbox(lightboxElement, SlideType.prev, images);
        });
        // show next slide when clicking on right arrow button
        const arrowRight = lightboxElement.querySelector(ELEMENTS.lightboxArrowRight.selector);
        arrowRight?.addEventListener('click', () => {
            if (!isGalleryOpen(galleryElement))
                return;
            showNextSlide(lightboxElement);
            updateLightbox(lightboxElement, SlideType.next, images);
        });
    };
    const showInitialImage = (lightbox, images, index) => {
        const slides = getLightboxSlides(lightbox);
        const currentImage = slides.current?.querySelector(ELEMENTS.lightboxImage.selector);
        loadSlideImage(images, slides.current, index);
        currentImage?.addEventListener('load', () => {
            loadSlideImage(images, slides.prev, getLoopedIndex(images, index - 1));
            loadSlideImage(images, slides.next, getLoopedIndex(images, index + 1));
        }, { once: true });
    };
    const openLightbox = (targetItem, lightbox, images, index) => {
        const targetGallery = targetItem?.closest(ELEMENTS.gallery.selector);
        if (!targetGallery)
            return;
        fadeIn(lightbox);
        disablePageScroll();
        // set open state on gallery
        targetGallery.dataset.state = GalleryState.open;
        // get close button
        const closeButton = lightbox.querySelector(ELEMENTS.lightboxClose.selector);
        // trap focus in lightbox and set focus on close button
        focusTrap = trapFocus(lightbox, closeButton);
        updateLightboxHeader(lightbox, images, index);
        showInitialImage(lightbox, images, index);
    };
    const initGalleryItemEvents = (galleryItems, lightboxElement, images) => {
        galleryItems.forEach((item, index) => {
            // set tab index to make gallery item focusable
            item.element.tabIndex = 0;
            // open lightbox when clicking on the gallery item
            item.element.addEventListener('click', event => {
                currentGalleryItemIndex = index;
                openLightbox(event.currentTarget, lightboxElement, images, index);
            });
            // open lightbox when pressing enter on the gallery item
            item.element.addEventListener('keydown', event => {
                if (event.key === Keys.Enter) {
                    event.preventDefault();
                    currentGalleryItemIndex = index;
                    openLightbox(event.currentTarget, lightboxElement, images, index);
                }
            });
        });
    };
    const galleryElement = getTargetElement(target);
    if (!galleryElement)
        return;
    const lightboxElement = createLightbox();
    const galleryItems = initGalleryItems(galleryElement);
    const images = getImages(galleryElement);
    initGalleryItemEvents(galleryItems, lightboxElement, images);
    initLightBoxEvents(galleryElement, lightboxElement, images);
};
export default flexGallery;
