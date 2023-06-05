export var SlideType;
(function (SlideType) {
    SlideType["prev"] = "prev";
    SlideType["current"] = "current";
    SlideType["next"] = "next";
})(SlideType || (SlideType = {}));
export var Keys;
(function (Keys) {
    Keys["ArrowLeft"] = "ArrowLeft";
    Keys["ArrowRight"] = "ArrowRight";
    Keys["Enter"] = "Enter";
    Keys["Escape"] = "Escape";
    Keys["Tab"] = "Tab";
})(Keys || (Keys = {}));
export var GalleryState;
(function (GalleryState) {
    GalleryState["open"] = "open";
    GalleryState["closed"] = "closed";
})(GalleryState || (GalleryState = {}));
// prettier-ignore
export const ELEMENTS = {
    // Gallery
    gallery: { selector: '.gallery', class: 'gallery' },
    galleryImage: { selector: '.gallery-thumb', class: 'gallery-thumb' },
    galleryItem: { selector: '.gallery-item', class: 'gallery-item' },
    // Lightbox
    lightbox: { selector: '.lightbox', class: 'lightbox' },
    lightboxImage: { selector: '.lightbox-image', class: 'lightbox-image' },
    lightboxHeader: { selector: '.lightbox-header', class: 'lightbox-header' },
    lightboxNumbers: { selector: '.lightbox-numbers', class: 'lightbox-numbers' },
    lightboxTitle: { selector: '.lightbox-title', class: 'lightbox-title' },
    lightboxClose: { selector: '.lightbox-close', class: 'lightbox-close' },
    lightboxArrow: { selector: '.lightbox-arrow', class: 'lightbox-arrow' },
    lightboxArrowLeft: { selector: '.lightbox-arrow.arrow-left', class: ['lightbox-arrow', 'arrow-left'] },
    lightboxArrowRight: { selector: '.lightbox-arrow.arrow-right', class: ['lightbox-arrow', 'arrow-right'] },
    lightboxSpinner: { selector: '.lightbox-spinner', class: 'lightbox-spinner' },
    LightboxSlide: { selector: '.lightbox-slide', class: 'lightbox-slide' },
    LightboxSlidePrev: { selector: '.lightbox-slide[data-state="prev"]' },
    LightboxSlideCurrent: { selector: '.lightbox-slide[data-state="current"]' },
    LightboxSlideNext: { selector: '.lightbox-slide[data-state="next"]' },
};
