# spirit
Modern and functional approach to building web applications.

[![Build Status](https://travis-ci.org/spirit-js/spirit.svg?branch=master)](https://travis-ci.org/spirit-js/spirit)
[![Coverage Status](https://coveralls.io/repos/github/spirit-js/spirit/badge.svg?branch=master)](https://coveralls.io/github/spirit-js/spirit?branch=master)
[![Join the chat at https://gitter.im/spirit-js/spirit](https://badges.gitter.im/spirit-js/spirit.svg)](https://gitter.im/spirit-js/spirit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Why?
```js
const {adapter} = require("spirit").node
const route = require("spirit-router")

const hello = () => "Hello World!"

const greet = (name) => "Hello, " + name

const app = route.define([
  route.get("/", hello),
  route.get("/:name", ["name"], greet),
])

http.createServer(adapter(app))
```

If we think about a web request in it's simplest form, it's basically a function, it takes a input (request) and _returns_ an output (response). So why not write web applications this way?

No more `req`, `res`. spirit simplifies everything by abstracting away the complexity of `req` and `res` that normally resulted in impure and complex functions.

Middleware in spirit can also transform the _returned_ response and not just the request. This is in contrast to other web libraries that can only transform the request. This is a simple idea but having this feature allows for much more DRY and expressive code.

Given the above, it's much more easier to re-use, test, and reason about your code in spirit.

Oh yea, most Express middleware work in spirit too!

## Getting Started

[The Handbook](http://spirit.function.run/)

- [collection of Examples](https://github.com/spirit-js/examples)
- [spirit API Docs](docs/api)
- [spirit + spirit-router Guide](https://github.com/spirit-js/spirit-router/tree/master/docs/Guide.md)
- [Introduction Video](https://www.youtube.com/watch?v=YvxLBd12ZX8&list=PLHw25bReXDKvHd-5mCjMxVkgDvWrx5IFY).

## Notable Components

- `spirit` is a small library for composing functions and creating abstractions. Abstractions are defined in a "spirit adapter". Currently it comes with 1 builtin, the node adapter (`spirit.node`) for use with node.js's http modules. Eventually there will be another one written for spirit to run in the browser.

- `spirit-router` is a library for routing and creating routes.

- `spirit-common` is a library that provides many common http related middleware. It's purpose is to make bootstrapping a multitude of middleware that everyone will need easier.

- `spirit-express`, is a library for converting most Express middleware to work in spirit.

## Contributing
All contributions are appreciated and welcomed.

For backwards incompatible changes, or large changes, it would be best if you opened an issue before hand to outline your plans (to avoid conflict later on).

The code style omits ending semi-colons. It also does not use camel case. And one-liners should be avoided unless it's very clear.

To run tests, use `make test`. This will also build changes to src/*, if you do not have "make" installed, you can look at the Makefile to see the steps to accomplish the task.

## Credits
spirit is heavily influenced by the design of [Ring](https://github.com/ring-clojure/ring)
