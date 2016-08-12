# spirit
Modern architecture for building modular web applications and frameworks.

Similar to Rack in Ruby and Connect with Express. However it takes a dramatically different approach to be much more modular and flexible.

To see an complete example, see [spirit-router](https://github.com/spirit-js/spirit-router/) or, see the [introduction video](https://www.youtube.com/watch?v=YvxLBd12ZX8&list=PLHw25bReXDKvHd-5mCjMxVkgDvWrx5IFY).

[![Build Status](https://travis-ci.org/spirit-js/spirit.svg?branch=master)](https://travis-ci.org/spirit-js/spirit)
[![Coverage Status](https://coveralls.io/repos/github/spirit-js/spirit/badge.svg?branch=master)](https://coveralls.io/github/spirit-js/spirit?branch=master)
[![Join the chat at https://gitter.im/spirit-js/spirit](https://badges.gitter.im/spirit-js/spirit.svg)](https://gitter.im/spirit-js/spirit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Key Differences
- It is Promise based and compatible with ES7 (async/await).

- __Environment agnostic__. Middlewares are not tied to anything like a `req` or `res`. They are simply javascript functions. This allows for them to be easily re-used and tested in different environments (browser & nodejs).

- Middlewares __flow both ways__ and are bidirectional. This is a contrast to Express where it goes one way only.

- Separation of concerns, middlewares are just middlewares. They transform / reduce data, returning new data. This differs from Express where middlewares also double as handlers. Which makes them sort of magical and a black box.

- Works with Express middlewares via an adapter. Since spirit middlewares are not tied to node.js (req, res) implementation and are just arbitrary functions that take a input and return an output, this makes it possible with an adapter that simply wraps over Express middleware.

When combined together it makes for truly "plug and play" modular architecture that is easy to test, reason about, and re-use.

There is also a article on [why I created spirit](https://medium.com/@hnry/why-spirit-2990a65ff89f)

As well as a article on the [performance](https://medium.com/p/node-js-web-frameworks-are-slow-3b7dfb5e204d) compared to other web libraries and frameworks.

## How spirit works
spirit is a library that defines a architecture that has three extensible parts, adapters, middlewares, handlers.

##### Adapter
An adapter describe how to interface spirit with another environment / API. For instance there is node-http adapter that comes with spirit. Or you can write an adapter for anything, even an adapter that hooks into DOM events in the browser.

##### Middleware(s)
Middlewares are just reducers or transformer functions on the input and output of data flowing through spirit.

##### Handler
A handler is a function that handles the input after it's flowed through all the middlewares and returns an output (which 'rewinds' and flows back through the system).

The following chart shows how data flows:

[![spirit flow chart](https://raw.githubusercontent.com/spirit-js/spirit/master/docs/flow-chart.png)](https://github.com/spirit-js/spirit)

## Usage
To install `npm install spirit`

Most likely, you will want to use [spirit-router](https://github.com/spirit-js/spirit-router) as a handler for spirit. (Unless you are interested in writing one yourself, or using another handler).

- [collection of Examples](https://github.com/spirit-js/examples)
- [spirit API Docs](docs/api)
- [spirit + spirit-router Guide](https://github.com/spirit-js/spirit-router/tree/master/docs/Guide.md)


## Notable Extensions
###### Adapters
[node-adapter](https://github.com/spirit-js/spirit/blob/master/docs/api/node.md#adapter): Interfaces with node's http, https, and http2 module. It's optionally bundled with spirit.

###### Middlewares
[spirit-express](https://github.com/spirit-js/spirit-express): A wrapper for Express API & middleware to get them to work as spirit middleware.

###### Handlers
[spirit-router](https://github.com/spirit-js/spirit-router):
A http URL routing library


## Contributing
All contributions are appreciated and welcomed.

For backwards incompatible changes, or large changes, it would be best if you opened an issue before hand to outline your plans (to avoid conflict later on).

The code style omits ending semi-colons. It also does not use camel case. And one-liners should be avoided unless it's very clear.

To run tests, use `make test`. This will also build changes to src/*, if you do not have "make" installed, you can look at the Makefile to see the steps to accomplish the task.

## Credits
spirit is heavily influenced by the design of [Ring](https://github.com/ring-clojure/ring)
