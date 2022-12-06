import { getLoopedIndex, isSrcsetSupported } from './utils.js';

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
