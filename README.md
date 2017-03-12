# SizeMe React

A [React](https://facebook.github.io/react/)-app, build and packaged with [yarn](https://yarnpkg.com) and [webpack](https://webpack.js.org/) (or npm, that should work also):

1. `yarn install`
2. `yarn start` to build dev version once, or `yarn watch` to automatically build on file change
3. `yarn build` to build prod version

File _index.html_ is a test file, containing a static copy of a product page at https://www.sizemedemo.com/magento19/t-shirt-db.html. You can open it to the browser from the local disc, but for better React-support serve it through a http server, like [this](https://www.npmjs.com/package/http-server) (install it: `yarn global add http-server`)
## Proposed UI model

![UI model](Sizeme%20UI%20model.png "UI model")

