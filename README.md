# flex-gallery

[![npm version](https://badge.fury.io/js/flex-gallery.svg)](https://badge.fury.io/js/flex-gallery)

> A responsive lightbox gallery with flexbox and progressive image loading.

<img src="preview.png" width="498" alt="preview.png">

## Installation

```sh
npm install flex-gallery
```

## Usage

### HTML:

```html
<div class="gallery">
  <div class="gallery-item">
    <img
      class="thumb placeholder"
      src="image-1@placeholder.jpg"
      data-src="image-1.jpg"
      data-srcset="image-1.jpg 1x, image-1@2x.jpg 2x"
      data-image="image-1.jpg"
      data-image-srcset="image-1.jpg 500w, image-1@2x.jpg 1000w, image-1@3x.jpg 2000w"
      data-title="Image 1"
      alt="Image 1"
    />
    <div class="caption" title="Image 1">Image 1</div>
  </div>

  <div class="gallery-item">
    <img
      class="thumb placeholder"
      src="image-2@placeholder.jpg"
      data-src="image-2.jpg"
      data-srcset="image-2.jpg 1x, image-2@2x.jpg 2x"
      data-image="image-2.jpg"
      data-image-srcset="image-2.jpg 500w, image-2@2x.jpg 1000w, image-2@3x.jpg 2000w"
      data-title="Image 2"
      alt="Image 2"
    />
    <div class="caption" title="Image 2">Image 2</div>
  </div>
</div>
```

| Attribute         | Description                                |
| ----------------- | ------------------------------------------ |
| src               | Placeholder until data-src is lazy loaded  |
| data-src          | Gallery item image                         |
| data-srcset       | Gallery item srcset                        |
| data-image        | Lightbox image                             |
| data-image-srcset | Lightbox image srcset                      |
| data-title        | Title for the lightbox header              |

### JS:

```js
import flexGallery from "flex-gallery";

flexGallery();
```

or with options:

```js
flexGallery({
  transitionDuration: 400,
  swipingThreshold: 5,
  slideChangeThreshold: 150,
});
```

| Property             | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| transitionDuration   | Time of a slide transition (in milliseconds)                      |
| swipingThreshold     | Threshold for a swipe gesture to be recognized as swiping (in px) |
| slideChangeThreshold | Threshold for a swipe to trigger a slide change (in px)           |

### CSS:

Import the distributed stylesheet directly:

```js
import "flex-gallery/src/css/flex-gallery.css";
```

or in plain HTML:

```html
<link rel="stylesheet" href="/node_modules/flex-gallery/src/css/flex-gallery.css" />
```

## Customize

Override the CSS custom properties:

```css
:root {
  --fg-gallery-item-height: 250px;
  --fg-gallery-item-overlay-bg-image: url("path/to/your/custom-bg-image.png");
  --fg-lightbox-bg-color: #222;
  --fg-lightbox-header-bg-color: #999;
  --fg-lightbox-header-font-weight: 600;
}
```

Available variables:

```css
:root {
  --fg-gallery-gap: 1em;
  --fg-gallery-item-height: 100px;
  --fg-gallery-item-height-sm: 150px;
  --fg-gallery-item-height-lg: 200px;
  --fg-gallery-item-border-radius: 0;
  --fg-gallery-item-caption-bg-color: rgb(0 0 0 / 60%);
  --fg-gallery-item-thumb-bg-color: #333;
  --fg-gallery-item-overlay-bg-color: rgb(0 0 0 / 40%);
  --fg-gallery-item-overlay-bg-image: url("...");

  --fg-lightbox-bg-color: #2e2e35;
  --fg-lightbox-z-index: 9999;
  --fg-lightbox-text-color: white;
  --fg-lightbox-header-bg-color: rgb(0 0 0 / 30%);
  --fg-lightbox-header-padding: 0.5em;
  --fg-lightbox-header-font-weight: 400;
  --fg-lightbox-arrow-left-bg-image: url("...");
  --fg-lightbox-arrow-right-bg-image: url("...");
  --fg-lightbox-close-bg-image: url("...");
}
```

## TODO

- Provide method for adding gallery items programmatically
- Fire events when opening/closing lightbox and on slide change

## License

MIT
