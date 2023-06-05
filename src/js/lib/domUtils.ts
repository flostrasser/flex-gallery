/**
 * Fades out an element and resolves a promise when the transition is done
 * and sets the 'hidden' attribute on the element
 *
 * @param element Target element
 * @param duration Transition duration in milliseconds
 * @param transitionTimingFunction CSS transition timing function
 * @returns Promise resolving when the transition is done
 */
export const fadeOut = <T extends HTMLElement>(
  element: T | null,
  duration = 200,
  transitionTimingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)'
) => {
  return new Promise<T>((resolve, reject) => {
    if (!element) {
      reject();
      return;
    }

    element.style.transition = `opacity ${duration}ms ${transitionTimingFunction}`;
    element.style.opacity = '0';

    window.setTimeout(() => {
      element.hidden = true;
      element.style.opacity = '';
      element.style.transition = '';
      resolve(element);
    }, duration);
  });
};

/**
 * Fades in an element and resolves a promise when the transition is done,
 * assumes that the element initially has the 'hidden' attribute
 *
 * @param element Target element
 * @param duration Transition duration in milliseconds
 * @param transitionTimingFunction CSS transition timing function
 * @returns Promise resolving when the transition is done
 */
export const fadeIn = <T extends HTMLElement>(
  element: T | null,
  duration = 200,
  transitionTimingFunction = 'cubic-bezier(0.4, 0.0, 0.2, 1)'
) => {
  return new Promise<T>((resolve, reject) => {
    if (!element) {
      reject();
      return;
    }

    element.hidden = false;
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ${transitionTimingFunction}`;

    // slightly delay updating the opacity, otherwise the element will be visible immediately
    window.setTimeout(() => {
      element.style.opacity = '1';
    }, 1);

    window.setTimeout(() => {
      element.style.opacity = '';
      element.style.transition = '';
      resolve(element);
    }, duration);
  });
};

/**
 * Creates a new html element
 *
 * @param type Element type
 * @param classNames A class name or array of class names
 * @param attributesObj Html attributes
 * @param html html string to be inserted
 */
export const createElement = <T extends keyof HTMLElementTagNameMap>(
  type: T,
  className?: string | string[],
  attributesObj: Record<string, string> = {},
  html?: string
) => {
  const element = document.createElement<T>(type);
  if (Array.isArray(className)) {
    className.forEach(name => element.classList.add(name));
  } else if (className) {
    element.classList.add(className);
  }
  Object.entries(attributesObj).forEach(([attrName, attrValue]) =>
    element.setAttribute(attrName, attrValue)
  );
  if (html) element.append(html);
  return element;
};

/**
 * Disables scrolling for the page
 */
export const disablePageScroll = () => {
  const scrollbarWidth = document.body.offsetWidth - document.body.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth) document.body.style.paddingRight = `${scrollbarWidth}px`;
};

/**
 * Re-enables scrolling for the page
 */
export const enablePageScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

/**
 * Traps focus inside a target element to cycle through focusable elements within the target.
 * @returns Object with reset function to reset the trap and set the focus on a new element.
 */
export const trapFocus = (targetEl: HTMLElement, initialFocusEl: HTMLElement | null) => {
  const selectors = [
    // form elements
    'button:not([tabindex^="-"]:not([disabled]):not([inert])',
    'textarea:not([tabindex^="-"]:not([disabled]):not([inert])',
    'input:not([tabindex^="-"]:not([disabled]):not([inert])',
    'select:not([tabindex^="-"]:not([disabled]):not([inert])',
    // other elements
    'a[href]:not([tabindex^="-"]:not([inert])',
    'area:not([tabindex^="-"]:not([inert])',
    '[tabindex]:not([tabindex^="-"]:not([inert])',
  ];

  const focusableEls = targetEl.querySelectorAll<HTMLElement>(selectors.join(', '));
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];

  if (initialFocusEl instanceof HTMLElement) {
    initialFocusEl.focus();
  }

  const tabKeyHandler = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // shift + tab
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        event.preventDefault();
      }
    } else if (document.activeElement === lastFocusableEl) {
      firstFocusableEl.focus();
      event.preventDefault();
    }
  };

  targetEl.addEventListener('keydown', tabKeyHandler);

  return {
    reset: (newFocusTarget: HTMLElement) => {
      targetEl.removeEventListener('keydown', tabKeyHandler);

      if (newFocusTarget instanceof HTMLElement) {
        newFocusTarget.focus();
      }
    },
  };
};

/**
 * Loads an image from the dataset of the target image.
 * To avoid the loading to be visible, the image will be updated when it finished loading in the background.
 *
 * @param targetImage Image element with src and/or srcset for new image saved as dataset
 * @returns Promise resolving when the new image is loaded
 *
 * @example
 * // Example targetImage:
 * <img src="placeholder.webp" data-src="image.webp" data-srcset="image.webp 1x, image@2x.webp 2x"/>
 * // Will result in:
 * <img src="image.webp" srcset="image.webp 1x, image@2x.webp 2x"/>
 */
export const loadImage = <T extends HTMLImageElement>(targetImage: T) => {
  return new Promise<T>(resolve => {
    // get the src and srcset from the dataset of the gallery thumb
    const { src, srcset } = targetImage.dataset;

    // create a temporary image
    const tempImage = new Image();

    // set the src and srcset of the temp img to preload the actual image file
    tempImage.srcset = srcset || '';
    tempImage.src = src || '';

    // when the temp image is loaded, set the src and srcset to the gallery thumb
    tempImage.onload = () => {
      targetImage.srcset = tempImage.srcset;
      targetImage.src = tempImage.src;
      resolve(targetImage);
    };
  });
};

const deferredPromise = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return Object.assign(promise, { resolve, reject });
};

/**
 * Lazy loads an array of images
 * @param targetImages Array of image element to be loaded
 * @param observerOptions IntersectionObserver options
 */
export const lazyLoadImages = (
  targetImages: HTMLImageElement[],
  observerOptions?: IntersectionObserverInit
) => {
  const promises: Array<{
    image: HTMLImageElement;
    promise: ReturnType<typeof deferredPromise<HTMLImageElement>>;
  }> = [];

  const intersectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // load the image when it is intersecting and resolve the corresponding promise
      loadImage(entry.target as HTMLImageElement).then(() => {
        const promiseIndex = promises.findIndex(promise => {
          return promise.image === entry.target;
        });
        promises[promiseIndex].promise.resolve(entry.target as HTMLImageElement);
      });
      observer.unobserve(entry.target);
    });
  }, observerOptions);

  // Observe each image and add a corresponding promise to the array
  targetImages.forEach(image => {
    intersectionObserver.observe(image);
    promises.push({ image, promise: deferredPromise<HTMLImageElement>() });
  });

  return promises;
};
