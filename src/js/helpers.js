import { getLoopedIndex } from './utils.js';

export const loadImage = (images, targetSlide, index) => {
  index = getLoopedIndex(images, index);

  const currentImage = targetSlide.querySelector('.lightbox-image');
  const spinner = targetSlide.querySelector('.lightbox-spinner');
  const { src } = images[index];
  const { srcset } = images[index];
  const tempImage = new Image();

  currentImage.setAttribute('src', '');
  currentImage.setAttribute('srcset', '');

  currentImage.hidden = true;
  spinner.hidden = false;

  tempImage.srcset = srcset;
  tempImage.src = src;

  const loadImageHandler = () => {
    currentImage.setAttribute('srcset', srcset);
    currentImage.setAttribute('src', src);

    spinner.hidden = true;
    currentImage.hidden = false;
    currentImage.removeEventListener('load', loadImageHandler);
  };

  tempImage.addEventListener('load', loadImageHandler);
};
