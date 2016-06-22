# spirit
A modern low level web library that provides extensible abstractions for building web middleware, applications & frameworks.

It is similar to Rack in Ruby, or Ring in Clojure. And meant as a different approach to Connect / Express way of doing things.

It is written from scratch, with goals to be:
- more extensible and modular with better abstractions
- modern, embracing modern javascript features
- flexible & isomorphic

[![Build Status](https://travis-ci.org/spirit-js/spirit.svg?branch=master)](https://travis-ci.org/spirit-js/spirit)
[![Coverage Status](https://coveralls.io/repos/github/spirit-js/spirit/badge.svg?branch=master)](https://coveralls.io/github/spirit-js/spirit?branch=master)

## Why
The landscape for what a web application looks like has changed. Javascript has changed. But we are still tied to a legacy and brittle way of doing things.

Newer alternatives like Koa do not provide much change from the old way of doing things, or other projects just wrap or hack around Express.

## Features & Key Differences
- Middlewares are not tied to node http `req` & `res` objects. spirit middlewares just take an input and __return__ an output. This makes them easier to test, re-use, and isomorphic.

- Middlewares __flow both ways__ and are bidirectional. (Unlike with Express middleware, where they only move one way). This makes response based middlewares possible.

- __Environment agnostic / Isomorphic__. In spirit, there are _adapters_, they allow spirit to interface with a different environment. For example, there is a node.js http adapter. Their can be a browser adapter that hooks into DOM events.

- Promises over callbacks

## Install & Usage
`npm install spirit`

## Extending
There are 3 core abstractions which allow you to extend spirit: adapters, middlewares, and handlers.

#### Adapters
A adapter is a function that describes how to interface with an environment or another library.

For example, spirit comes with a node.js http adapter. It describes how to handle a `req` object from node.js, and how to write back to `res`. As well as providing abstractions for them.

Is it possible to write other adapters, for instance a DOM event adapter for the browser, so spirit. Or if another http server was written for node.js, all that needs to happen is write a new adapter and all existing middleware and handlers will work.

#### Middlewares
Middlewares in spirit are just functions that take a input and return an output (Promise).

#### Handlers
A handler is a function that describes what to do with the incoming data after it's gone through middlewares. And returns back data that will flow back through the middlewares to the adapter.

An example of a handler is [spirit-router](https://github.com/spirit-js/spirit-router).

There are plans to write a handler for react-router (coming soon).

## Credits
spirit is heavily influenced by the design of [Ring](https://github.com/ring-clojure/ring)
