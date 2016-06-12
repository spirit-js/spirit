[![Build Status](https://travis-ci.org/hnry/spirit.svg?branch=master)](https://travis-ci.org/hnry/spirit)
[![Coverage Status](https://coveralls.io/repos/github/hnry/spirit/badge.svg?branch=master)](https://coveralls.io/github/hnry/spirit?branch=master)

## spirit

A _fast_ simple & modern web framework for node.js

It emphasizes clear separation of code between HTTP and your own code. Routes are normal javascript functions. That means a route can be as simple as:
```js
function() { return "Hello World"} // or () => { return "Hello World" }
```

It is mostly compatible with Express middlewares. It can be thought of as a mixture of Express and Compojure.

#### why?

1. Simple. 
   __Routes are just normal functions that return something.__ 
   No more proprietary (req, res, next) functions that are hard to read, re-use and test.

   This makes for a clarity in the separation between your code and http related code. As opposed to everything just being a http middleware.
  
2. Modern. Promises and async/await is preferred and recommended over callbacks whenever possible.

3. Compatible with Express's middleware signature (req, res, next) with mostly complete support for Express's specific helpers.

4. Better error-handling, almost everything is then-able and catch-able.

5. It's fast. 

#### example in es6

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

const site = define([site_defaults(), routes.route(app)])
http.createServer(spirit(site)).listen(3000)
```

#### Status

I'm actively working on this, it is considered working but "alpha". I try to keep master in a working state, but I also pull in new changes regularly so it might sometimes break (bug).

The remaining work:

1. Docs, docs, docs, oh my gerd there are no docs!
2. Just overall use and testing to try out every possible edge case.
3. Filling out remaining Express compatibility.

__I need your help!__ If the project interests you, I would love for someone to write docs or just as simple as using it, writing web apps with it, etc.
