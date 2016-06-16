# spirit
A _fast_ simple & modern web framework for node.js, built from the ground up. 

It is a _low level_ framework (it is _not_ a full stack framework or a boilerplate or web platform). It is meant as an alternative to Express, Koa, Hapi, etc.

[![Build Status](https://travis-ci.org/hnry/spirit.svg?branch=master)](https://travis-ci.org/hnry/spirit)
[![Coverage Status](https://coveralls.io/repos/github/hnry/spirit/badge.svg?branch=master)](https://coveralls.io/github/hnry/spirit?branch=master)

It __emphasizes clear separation of code between HTTP and your own code__. Routes are normal javascript functions. That means a route can be as simple as:
```js
function() { return "Hello World" }
```

This makes testing, re-using, and reading your code much easier, as _"it's just javascript"_.

## Features
* __Routes are just normal functions that return something__. No more proprietary (req, res, next) functions. This makes it easier to test, re-use, read your routes.

* __Compatible with Express middleware__. Re-using existing code is important.

* Error handling with then & catch. __Promises are "first class"__.

* __Fast, very fast__. It outperforms other web frameworks (Express, Koa).

## Example (in ES6)
```js
const {spirit, routes, define, site_defaults} = require("./index")

const hi = (str) => { // routes are just normal functions
  return "Hi, " + str
}

const home = () => {  // routes can throw errors normally too
  throw "oops"        // if the error can't be handled here, it's ok to throw
}

const app = define([
  routes.get("/home", [], home)
  routes.get("/:param", ["param"], hi)
]).catch((err) => {
  return "recovered!" // can recover from route errors here
})

const site = spirit([site_defaults(), routes.route(app)])
http.createServer(site).listen(3000)
```
More examples can be found in the [example dir](https://github.com/hnry/spirit/tree/master/examples).

## Getting Started
To install:
`npm install spirit`

Some resources for getting started: (Not all written yet)

[Guide](https://github.com/hnry/spirit/tree/master/docs/guide) and [API Docs](https://github.com/hnry/spirit/tree/master/docs/api)

For a long read about the different designs, check out [spirit's design philosophy compared to Express](https://github.com/hnry/spirit/wiki/spirit's-design-philosophy-compared-to-express).

## Development Status
I'm actively working on this, it is considered working but should be considered beta. I try to keep master in a working state, but I also pull in new changes regularly so it might sometimes break.

When spirit v0.1.0 is released, the existing API will be frozen until the first major release (1.0.0).

The remaining work:

1. Docs, docs, docs!
2. Some proper response headers are still missing for certain sitatuions
3. Filling out remaining Express compatibility (specifically Express's res api)
4. http2 support
5. A logging implementation
6. Handling request headers for Not modified, if-not-modified
7. prettier and informative 500 errors while developing (relies on 5. being done)

__I need your help!__ If the project interests you, I would love help. Especially for doc contributions or just as simple as using it, writing web apps with it, reporting feedback / bugs, etc.


## FAQ
#### How about isomorphic support?
It supports it as far as how other similar projects like Express support it. That is, it provides you the tools and the means to get what you need done. But it is not meant to be a full, batteries included framework. You can however use spirit to build your own isomorphic framework, like other projects have done with Express, or it should be easy to port those projects to use spirit since spirit understands Express middleware.
