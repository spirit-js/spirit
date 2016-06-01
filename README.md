# leaf

A _fast_ simple & modern web framework for node.js

And... it is 99% compatible with Express middleware out of the box.

#### why?

1. Simple. 
   __Routes are just normal functions.__ 
   No more proprietary (req, res, next) functions that are hard to read, re-use and test.

   This makes for a clarity in the separation between your code and http related code. As opposed to everything just being a http middleware.
  
2. Modern. Promises and async/await is preferred and recommended over callbacks whenever possible.

3. Compatible with Express's middlewares out of the box.

4. Better error-handling, almost everything is then-able and catch-able.

5. It's fast. (Faster than other frameworks such as Express or Koa)

#### example

```js
const http = require("http")
const {leaf, routes, define, site_defaults} = require("leaf")

// routes are just normal functions
const hi = (str) => {
  return "Hi, " + str
}

// they can throw errors as normal
const errhandling = () => {
  // we can of course handle errors here, but we can also
  // throw and make it bubble up
  throw "oops"
}

const app = define([
  routes.get("/error", [], errhandling)
  routes.get("/:param", ["param"], hi)
]).catch((err) => {
  // handle errors from the above routes here
  return "recovered!"
})

const site = define([
  site_defaults(),
  routes.route(app)
])

http.createServer(leaf(site)).listen(3000)
```

#### Express compatiblity

Out of the box most Express middleware is supported. The exceptions being:

- `req.originalUrl`
  This seems to be part of Express's router, and since leaf routes differently (and avoids mutating `req.url`), this is not built-in.
  If your middleware requires this, you would need to wrap the middleware to add this. See routes.resources for an example.
  
- Middleware that needs a router
  Similar to the previous exception. If your middleware needs a router (matching a url) then it isn't actually a middleware.
  It is recommended to instead convert it into a route handler. If that is not possible, see routes.resorces for an example of how to work around this.
  
- Express error handling middleware (err, req, res, next)
  There is no support for this middleware signature. leaf handles errors differently (and in my opinion better). There is no workaround and it is recommended to use leaf's error handling of catching errors.

