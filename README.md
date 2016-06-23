# spirit
Modern architecture for building modular web applications and frameworks.

Similar to Rack in Ruby and Connect / Express. Except it takes a dramatically different approach to be much more modular and flexible.

To see an example of what's possible with spirit, check out [spirit-router](https://github.com/spirit-js/spirit-router) and other [notable extensions](#notable-extensions).

[![Build Status](https://travis-ci.org/spirit-js/spirit.svg?branch=master)](https://travis-ci.org/spirit-js/spirit)
[![Coverage Status](https://coveralls.io/repos/github/spirit-js/spirit/badge.svg?branch=master)](https://coveralls.io/github/spirit-js/spirit?branch=master)

## Key Differences
- It is Promise based and compatible with ES7 (async/await).

- __Environment agnostic__. Middlewares are not tied to anything like a `req` or `res`. They are simply javascript functions. This allows for them to be easily re-used and tested in different environments (browser & nodejs).

- Middlewares __flow both ways__ and are bidirectional. This is a contrast to Express where it goes one way only.

- Separation of concerns, middlewares are just middlewares. They transform / reduce data, returning new data. This differs from Express where middlewares also double as handlers. Which makes them sort of magical and a black box.

- Compatible with Express middlewares. Since spirit middlewares are not tied to any implementation, this makes it possible to wrap Express middlewares and use them.

When combined together it makes for truly "plug and play" modular architecture that is easy to test, reason about, and re-use.

## The architecture, how spirit works
In spirit, there are 3 extensible parts, adapters, middlewares, handlers.

###### Adapters
An adapter describe how to interface spirit with another environment / API. For instance there is node-http adapter for spirit. Or you can write an adapter for anything, even an adapter to hook into DOM events in the browser.

##### Middlewares
Middlewares are simply reducers or transformer functions on the input and output of data flowing through spirit.

##### Handlers
A handler are simply a function that handles the input after it's flowed through all the middlewares and returns an output (which 'rewinds' and flows back through the system).

The following chart shows how data flows:

[![spirit flow chart](https://raw.githubusercontent.com/spirit-js/spirit/master/docs/flow-chart.png)](https://github.com/spirit-js/spirit)

## Install & Usage
`npm install spirit`

For usage, please see [API Docs](docs/api)

If you have questions, come
[![Join the chat at https://gitter.im/spirit-js/spirit](https://badges.gitter.im/spirit-js/spirit.svg)](https://gitter.im/spirit-js/spirit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Notable Extensions
###### Adapters
node-http-adapter: Interfaces with node's http, https, and http2 module. Optionally bundled with spirit. See the [Doc](docs/api/node-adapter.md) for usage.

###### Middlewares

###### Handlers
[spirit-router](https://github.com/spirit-js/spirit-router):
A URL routing library

###### Misc
[spirit-express](https://github.com/spirit-js/spirit-express):
A wrapper for Express API & middleware to get them to work as spirit middleware.

## Credits
spirit is heavily influenced by the design of [Ring](https://github.com/ring-clojure/ring)
