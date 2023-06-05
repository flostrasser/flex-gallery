import { ELEMENTS, GalleryState, SlideType } from './constants.js';
import { createElement, enablePageScroll, fadeOut, lazyLoadImages, loadImage, } from './domUtils.js';
/**
 * Closes the lightbox and resets the lightbox images.
 */
export const closeLightbox = async (galleryElement, lightboxElement, focusTrap, currentGalleryItemIndex) => {
    const lightboxImages = lightboxElement.querySelectorAll(ELEMENTS.lightboxImage.selector);
    // fade out
    await fadeOut(lightboxElement);
    // set closed state on gallery
    galleryElement.dataset.state = GalleryState.closed;
    // reset lightbox images
    lightboxImages.forEach(image => {
        image.src = '';
        image.srcset = '';
        image.dataset.src = '';
        image.dataset.srcset = '';
    });
    // reset focus trap and set focus back to relatedTarget
    focusTrap.reset(galleryElement.querySelectorAll('.gallery-item')[currentGalleryItemIndex]);
    // reset page scroll
    enablePageScroll();
};
/**
 * Updates the lightbox header with the current image title and index.
 */
export const updateLightboxHeader = (lightbox, images, index) => {
    const { title } = images[index];
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxNumbers = lightbox.querySelector('.lightbox-numbers');
    if (lightboxTitle)
        lightboxTitle.textContent = title;
    if (lightboxNumbers)
        lightboxNumbers.textContent = `${index + 1}/${images.length}`;
};
/**
 * Returns the prev, current and next slide of the lightbox.
 */
export const getLightboxSlides = (lightboxElement) => {
    return {
        prev: lightboxElement.querySelector(ELEMENTS.LightboxSlidePrev.selector),
        current: lightboxElement.querySelector(ELEMENTS.LightboxSlideCurrent.selector),
        next: lightboxElement.querySelector(ELEMENTS.LightboxSlideNext.selector),
    };
};
/**
 * Creates the lightbox element with all its children and appends it to the body.
 */
export const createLightbox = () => {
    // return the lightbox element if it already exists
    let lightbox = document.querySelector(ELEMENTS.lightbox.selector);
    if (lightbox)
        return lightbox;
    // create lightbox
    lightbox = createElement('div', ELEMENTS.lightbox.class, { hidden: 'true' });
    // Header
    const lightboxHeader = createElement('div', ELEMENTS.lightboxHeader.class);
    const lightboxNumbers = createElement('div', ELEMENTS.lightboxNumbers.class);
    const lightboxTitle = createElement('div', ELEMENTS.lightboxTitle.class);
    const lightboxClose = createElement('button', ELEMENTS.lightboxClose.class, {
        type: 'button',
        'aria-label': 'Close',
    });
    lightboxHeader.append(lightboxNumbers, lightboxTitle, lightboxClose);
    lightbox.append(lightboxHeader);
    // Slides Wrapper
    const slidesWrapper = createElement('div', 'lightbox-slides-wrapper');
    lightbox.append(slidesWrapper);
    // Slides
    const prevSlide = createElement('div', ELEMENTS.LightboxSlide.class, {
        'data-state': SlideType.prev,
    });
    const currentSlide = createElement('div', ELEMENTS.LightboxSlide.class, {
        'data-state': SlideType.current,
    });
    const nextSlide = createElement('div', ELEMENTS.LightboxSlide.class, {
        'data-state': SlideType.next,
    });
    slidesWrapper.append(prevSlide, currentSlide, nextSlide);
    // Image
    const lightboxImage = createElement('img', ELEMENTS.lightboxImage.class, {
        hidden: 'true',
        draggable: 'false',
    });
    currentSlide.append(lightboxImage);
    prevSlide.append(lightboxImage.cloneNode());
    nextSlide.append(lightboxImage.cloneNode());
    // Loading Spinner
    const spinner = createElement('div', ELEMENTS.lightboxSpinner.class, {
        role: 'status',
        hidden: '',
    });
    currentSlide.append(spinner);
    prevSlide.append(spinner.cloneNode());
    nextSlide.append(spinner.cloneNode());
    // create arrows
    const arrowLeftBtn = createElement('button', [...ELEMENTS.lightboxArrowLeft.class], {
        type: 'button',
        'aria-label': 'Previous Slide',
    });
    const arrowRightBtn = createElement('button', [...ELEMENTS.lightboxArrowRight.class], {
        type: 'button',
        'aria-label': 'Next Slide',
    });
    lightbox.append(arrowLeftBtn);
    lightbox.append(arrowRightBtn);
    // Footer
    const lightboxFooter = createElement('div', 'lightbox-footer');
    lightbox.append(lightboxFooter);
    // append lightbox to body
    document.body.append(lightbox);
    return lightbox;
};
/**
 * Returns the image params of all items in a gallery.
 */
export const getImages = (galleryElement) => {
    // get image params of all items in a gallery
    const getGalleryItemParams = (galleryItems) => {
        return galleryItems.reduce((acc, element) => {
            const currentImageEl = element.querySelector(ELEMENTS.galleryImage.selector);
            return [
                ...acc,
                {
                    src: currentImageEl?.dataset.image || currentImageEl?.dataset.src || '',
                    srcset: currentImageEl?.dataset.imageSrcset || '',
                    title: currentImageEl?.dataset.title || '',
                },
            ];
        }, []);
    };
    // get gallery item elements
    const galleryItemElements = galleryElement.querySelectorAll(ELEMENTS.galleryItem.selector);
    // get image params of all gallery items
    return getGalleryItemParams(Array.from(galleryItemElements));
};
/**
 * Returns the target element of the gallery.
 */
export const getTargetElement = (target) => {
    const targetElement = target instanceof HTMLElement ? target : document.querySelector(target);
    // eslint-disable-next-line no-console
    if (!targetElement)
        console.warn('gallery error: target element not found');
    return targetElement;
};
/**
 * Loads an image from the dataset of the target image.
 */
export const loadSlideImage = (images, targetSlide, index) => {
    const currentImage = targetSlide?.querySelector(ELEMENTS.lightboxImage.selector);
    const spinner = targetSlide?.querySelector(ELEMENTS.lightboxSpinner.selector);
    currentImage?.setAttribute('data-src', images[index].src);
    currentImage?.setAttribute('data-srcset', images[index].srcset);
    if (!currentImage || !spinner)
        return;
    // show spinner instead of image
    spinner.hidden = false;
    currentImage.hidden = true;
    loadImage(currentImage).then(() => {
        // hide spinner and show image
        currentImage.hidden = false;
        spinner.hidden = true;
    });
};
/**
 * Loads gallery images with progressive image loading
 */
export const initGalleryItems = (galleryElement) => {
    const galleryItems = galleryElement.querySelectorAll(ELEMENTS.galleryItem.selector);
    const galleryThumbs = galleryElement.querySelectorAll(ELEMENTS.galleryImage.selector);
    const promises = lazyLoadImages(Array.from(galleryThumbs));
    promises.forEach(({ promise }) => promise.then(image => image.classList.remove('placeholder')));
    return Array.from(galleryItems).map(itemEl => ({
        element: itemEl,
        title: itemEl.querySelector(ELEMENTS.galleryImage.selector)?.dataset.title,
    }));
};
