# flex-gallery

A responsive lightbox gallery with flexbox and progressive image loading.

> Note: This is an experimental project. Don't use it in production. A better documentation and a stable version is coming soon.

## Installation

```sh
npm install flex-gallery
```

## Usage

HTML:

```html
<div class="gallery">
    <div class="gallery-item">
        <img
            class="thumb placeholder border-radius"
            src="image-1@placeholder.jpg"
            data-src="image-1.jpg"
            data-srcset="image-1.jpg 1x, image-1@2x.jpg 2x"
            data-image="image-1.jpg"
            data-image-srcset="image-1.jpg 500w, image-1@2x.jpg 1000w, image-1@3x.jpg 2000w"
            data-image-fallback="image-1@2x.jpg"
            data-title="Image 1"
            alt="Image 1"
        />
        <div class="caption" title="Image 1"><span>Image 1</span></div>
    </div>

    <div class="gallery-item">
        <img
            class="thumb placeholder border-radius"
            src="image-2@placeholder.jpg"
            data-src="image-2.jpg"
            data-srcset="image-2.jpg 1x, image-2@2x.jpg 2x"
            data-image="image-2.jpg"
            data-image-srcset="image-2.jpg 500w, image-2@2x.jpg 1000w, image-2@3x.jpg 2000w"
            data-image-fallback="image-2@2x.jpg"
            data-title="Image 2"
            alt="Image 2"
        />
        <div class="caption" title="Image 2"><span>Image 2</span></div>
    </div>
</div>
```

JS:

```js
import { flexGallery } from 'flex-gallery';

flexGallery();
```

SCSS:

```scss
@import 'flex-gallery';
```
