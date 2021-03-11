# SizeMe React [![CircleCI](https://circleci.com/gh/SizeMeCom/sizeme-react.svg?style=svg)](https://circleci.com/gh/SizeMeCom/sizeme-react)

## Development

A [React](https://facebook.github.io/react/)-app, build and packaged with [yarn](https://yarnpkg.com) and [webpack](https://webpack.js.org/) (or npm, that should work also):

1. `yarn install`
2. `yarn start` to build dev version once
3. `yarn watch` to serve dev version on http://localhost:8080 and build automatically on file change
3. `yarn build` to build prod version

File [_index.html_](http://localhost:8080) is a test file, containing a static copy of a product page at 
https://www.sizemedemo.com/magento19/t-shirt-db.html.  

## SizeMe Options

Application expects to find an object named `sizeme_options` (TODO: rename to `SizemeOptions`?) with following properties:

```javascript
{
  serviceStatus: "on",
  pluginVersion: "MAG1-0.1.0",
  contextAddress: "https://test.sizeme.com"
  shopType: "magento",
  debugState: false,
  uiOptions: {},
  additionalTranslations: {}
}
```
* [serviceStatus] (_String_): is SizeMe enabled? Default: "on"; other values: "off", "ab".

* [pluginVersion] (_String_): version of the webstore plugin. Optional.

* [contextAddress] (_String_): URL to the SizeMe backend service.

* [shopType] (_String_): webstore provider (magento|printmotor|pupeshop|woocommerce|shopify)

* [debugState] (_Boolean_): write debugging info to console. Default: false

* [uiOptions] (_Object_): Optionally override default UI options. Defaults per shopType are specified in [`uiOptions.js`](src/api/uiOptions.js)
  - [lang] (_String_): language to use (fi, sv, en, en is fallback).
  - [appendContentTo] (_String_):  DOM element where SizeMe is injected.
  - [invokeElement] (_String_): DOM element that handles size changes
  - [disableSizeGuide] (_Boolean_): disable SizeGuide
  - [sizeSelectorType] (_String_): type of the size selector used in the shop. Possible values at the moment: "default" (default, doh) and "swatches"
  - [addToCartElement] (_String_): DOM element to listen to for add-to-cart events
  - [addToCartEvent] (_String_): DOM event for add-to-cart
  - [maxRecommendationDistance] (_Integer_): maximum difference between optimal fit and total fit for SizeMe to consider the size for pre-selection. Default not set, meaning all sizes that are not too small are considered.
  - [skinClasses] (_String_): contents will be appended to the class attribute of SizeMe container element. Empty by default.
  - [toggler] (_Boolean_): enable/disable functionality that can be used to toggle the visibility of SizeMe content
  - [flatMeasurements] (_Boolean_): show product circumference measurements (chest, waist etc) as measured on a flat surface in the size guide.  Default: true
  
* [additionalTranslations] (_Object_): Optionally override translations defined under ['i18n'](src/i18n). Example of how to 
override the Swedish translation for chest:
```javascript
{
  sv: {
    humanMeasurements: {
      chest: "Bröst"
    }
  }
}
```
Similarly override any other key in any other language (en, fi, sv).
