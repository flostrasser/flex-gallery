import { ELEMENTS } from './lib/constants.js';
import { loadImage } from './lib/domUtils.js';
export const getLoopedIndex = (array, index) => {
    if (index > array.length - 1)
        return 0;
    if (index < 0)
        return array.length - 1;
    return index;
};
export const getTargetElement = (target) => {
    const targetElement = target instanceof HTMLElement ? target : document.querySelector(target);
    // eslint-disable-next-line no-console
    if (!targetElement)
        console.warn('gallery error: target element not found');
    return targetElement;
};
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
