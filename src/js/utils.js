// feature detection
export const isSrcsetSupported = 'srcset' in new Image();

export const createElement = (type, className, attributesObj) => {
  const element = document.createElement(type);
  if (Array.isArray(className)) {
    className.forEach(name => element.classList.add(name));
  } else if (className) {
    element.classList.add(className);
  }
  if (attributesObj) {
    Object.entries(attributesObj).forEach(([attrName, attrValue]) =>
      element.setAttribute(attrName, attrValue)
    );
  }
  return element;
};

export const removeChildren = parentEl => {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.lastChild);
  }
};

export const getLoopedIndex = (array, index) => {
  if (index > array.length - 1) return 0;
  if (index < 0) return array.length - 1;
  return index;
};

export const loadImage = (images, targetSlide, index) => {
  index = getLoopedIndex(images, index);

  const currentImage = targetSlide.querySelector('.lightbox-image');
  const spinner = targetSlide.querySelector('.lightbox-spinner');
  const src = isSrcsetSupported ? images[index].src : images[index].srcFallback;
  const { srcset } = images[index];
  const tempImage = new Image();

  currentImage.setAttribute('src', '');
  currentImage.setAttribute('srcset', '');
  currentImage.hidden = true;
  spinner.hidden = false;

  if (isSrcsetSupported && srcset) {
    tempImage.srcset = srcset;
  } else {
    tempImage.src = src;
  }

  const loadImageHandler = () => {
    if (isSrcsetSupported && srcset) {
      currentImage.setAttribute('srcset', srcset);
    } else {
      currentImage.setAttribute('src', src);
    }

    spinner.hidden = true;
    currentImage.hidden = false;
    currentImage.removeEventListener('load', loadImageHandler);
  };

  tempImage.addEventListener('load', loadImageHandler);
};

export const loadThumbnail = target => {
  // get the src and srcset from the dataset of the gallery thumb
  const {
    dataset: { src, srcset },
  } = target;

  // create a temporary image
  const tempImage = new Image();

  // set the src or srcset of the temp img to preload the actual image file
  if (isSrcsetSupported && srcset) {
    tempImage.srcset = srcset;
  } else if (src) {
    tempImage.src = src;
  }

  // when the temp image is loaded, set the src or srcset to the gallery thumb
  tempImage.onload = () => {
    if (tempImage.srcset) {
      target.srcset = srcset;
    } else if (src) {
      target.src = src;
    }

    target.classList.remove('placeholder');
  };
};

export const fadeIn = (element, display = 'block', ms = 200) => {
  return new Promise(resolve => {
    element.style.display = display;
    element.style.opacity = 0;

    let opacity = 0;
    const timer = setInterval(() => {
      opacity += 50 / ms;
      if (opacity >= 1) {
        clearInterval(timer);
        opacity = 1;
        resolve();
      }
      element.style.opacity = opacity;
    }, 50);
  });
};

export const fadeOut = (element, ms = 200) => {
  return new Promise(resolve => {
    let opacity = 1;
    const timer = setInterval(() => {
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
};

// Re-maps a number from one range to another.
export const mapRange = (value, fromIn, toIn, fromOut, toOut) => {
  return fromOut + ((toOut - fromOut) * (value - fromIn)) / (toIn - fromIn);
};
