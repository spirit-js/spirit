# leaf

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
const {leaf, routes, define, site_defaults} = require("leaf")

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

http.createServer(leaf(site)).listen(3000)
```

#### Express compatiblity

Out of the box most Express middleware is supported. Some exceptions being:

- `req.originalUrl`
  This seems to be part of Express's router, and since leaf routes differently (and avoids mutating `req.url`), this is not built-in.
  If your middleware requires this, you would need to wrap the middleware to add this. See routes.resources for an example.
  
- Middleware that needs a router

  Similar to the previous exception. If your middleware needs a router (matching a url) then it isn't actually a middleware.
  It is recommended to instead convert it into a route handler. If that is not possible, see routes.resorces for an example of how to work around this.
  
- Express error handling middleware (err, req, res, next)

  There is no support for this middleware signature. leaf handles errors differently (and in my opinion better). There is no workaround and it is recommended to use leaf's error handling of catching errors.

