// Gallery
export type GalleryImage = HTMLImageElement;
export type GalleryItemElement = HTMLDivElement;
export type GalleryElement = HTMLDivElement;
export type GalleryItemParams = {
  element: HTMLDivElement;
  title: string | undefined;
};

// Lightbox
export type LightBoxElement = HTMLDivElement;
export type LightBoxImage = HTMLImageElement;
export type LightBoxSpinner = HTMLDivElement;
export type LightboxSlideElement = HTMLDivElement;
export type LightBoxCloseButton = HTMLButtonElement;
export type LightBoxArrow = HTMLButtonElement;
export type LightboxImageParams = {
  src: string;
  srcset: string;
  title: string;
};

export type Options = {
  swipingThreshold?: number;
  transitionDuration?: number;
  slideChangeThreshold?: number;
};
