export enum SlideType {
  prev = 'prev',
  current = 'current',
  next = 'next',
}

export enum Keys {
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Enter = 'Enter',
  Escape = 'Escape',
  Tab = 'Tab',
}

export enum GalleryState {
  open = 'open',
  closed = 'closed',
}

// prettier-ignore
export const ELEMENTS = {
  // Gallery
  gallery:              { selector: '.gallery', class: 'gallery' },
  galleryImage:         { selector: '.gallery-thumb', class: 'gallery-thumb'  },
  galleryItem:          { selector: '.gallery-item', class: 'gallery-item'  },
  // Lightbox
  lightbox:             { selector: '.lightbox', class: 'lightbox' },
  lightboxImage:        { selector: '.lightbox-image' , class: 'lightbox-image' },
  lightboxHeader:       { selector: '.lightbox-header', class: 'lightbox-header' },
  lightboxNumbers:      { selector: '.lightbox-numbers', class: 'lightbox-numbers' },
  lightboxTitle:        { selector: '.lightbox-title', class: 'lightbox-title' },
  lightboxClose:        { selector: '.lightbox-close', class: 'lightbox-close' },
  lightboxArrow:        { selector: '.lightbox-arrow', class: 'lightbox-arrow' },
  lightboxArrowLeft:    { selector: '.lightbox-arrow.arrow-left', class: ['lightbox-arrow', 'arrow-left'] },
  lightboxArrowRight:   { selector: '.lightbox-arrow.arrow-right', class: ['lightbox-arrow', 'arrow-right'] },
  lightboxSpinner:      { selector: '.lightbox-spinner', class: 'lightbox-spinner' },
  LightboxSlide:        { selector: '.lightbox-slide', class: 'lightbox-slide' },
  LightboxSlidePrev:    { selector: '.lightbox-slide[data-state="prev"]' },
  LightboxSlideCurrent: { selector: '.lightbox-slide[data-state="current"]' },
  LightboxSlideNext:    { selector: '.lightbox-slide[data-state="next"]' },
} as const;
