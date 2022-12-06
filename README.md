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

### SCSS:

```scss
@use "flex-gallery";
```

## Customize

Example for overriding variables:

```scss
@use "flex-gallery" with (
  $gallery-item-height: 250px,
  $gallery-item-overlay-bg: url("path/to/your/custom-bg-image.png"),
  $lightbox-bg-color: #222,
  $lightbox-header-bg-color: #999,
  $lightbox-header-font-weight: 600
);
```

All default variables:

```scss
// --------------------------------
// SVG Icons
// --------------------------------
$icon-enlarge-color: white !default;
$icon-chevron-color: white !default;
$icon-close-color: white !default;
$icons-stroke-width: 2 !default;
$icon-enlarge-svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path stroke="#{$icon-enlarge-color}" stroke-width="#{$icons-stroke-width}" d="M27.2083 27.2267C28.9329 25.5068 30 23.128 30 20.5C30 15.2533 25.7467 11 20.5 11C15.2533 11 11 15.2533 11 20.5C11 25.7467 15.2533 30 20.5 30C23.1187 30 25.4899 28.9405 27.2083 27.2267ZM27.2083 27.2267L37 37.0183"/></svg>' !default;
$icon-chevron-left-svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path stroke="#{$icon-chevron-color}" stroke-width="#{$icons-stroke-width}" d="M32 43L16 24L32 5"/></svg>' !default;
$icon-chevron-right-svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path stroke="#{$icon-chevron-color}" stroke-width="#{$icons-stroke-width}" d="M16 43L32 24L16 5"/></svg>' !default;
$icon-close-svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><path stroke="#{$icon-close-color}" stroke-width="#{$icons-stroke-width}" d="M14 14L34 34M34 14L14 34"/></svg>' !default;

// --------------------------------
// Gallery Settings
// --------------------------------
$gallery-gap: 1em !default;
$gallery-item-height: 100px !default;
$gallery-item-height-sm: 150px !default;
$gallery-item-height-lg: 200px !default;
$gallery-item-border-radius: 0 !default;
$gallery-item-overlay-bg-color: rgba(#000, 0.4) !default;
$gallery-item-overlay-bg-image: url(utils.svg-encode($icon-enlarge-svg)) !default;
$gallery-item-overlay-bg: $gallery-item-overlay-bg-color $gallery-item-overlay-bg-image center / 3rem no-repeat !default;
$gallery-item-caption-bg-color: rgba(#000, 0.6) !default;
$gallery-item-thumb-bg-color: #333 !default;

// --------------------------------
// Lightbox Settings
// --------------------------------
$lightbox-bg-color: #2e2e35 !default;
$lightbox-z-index: 9999 !default;
$lightbox-text-color: white !default;
$lightbox-close-color: white !default;
$lightbox-header-bg-color: rgba(#000, 0.3) !default;
$lightbox-header-padding: 0.5em !default;
$lightbox-header-font-weight: 400 !default;
$lightbox-arrow-left-bg-image: url(utils.svg-encode($icon-chevron-left-svg)) !default;
$lightbox-arrow-right-bg-image: url(utils.svg-encode($icon-chevron-right-svg)) !default;
$lightbox-close-bg-image: url(utils.svg-encode($icon-close-svg)) !default;
```

## TODO

- Provide method for adding gallery items programmatically
- Fire events when opening/closing lightbox and on slide change

## License

MIT
