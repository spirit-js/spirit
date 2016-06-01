# leaf

A _fast_ simple & modern web framework for node.js

And... it is 99% compatible with Express middleware out of the box.

#### why?

1. Simple. 
   __Routes are just normal functions.__ 
   No more proprietary (req, res, next) functions or generator functions that are hard to read, re-use and test.

   This makes for a better clarity in the separation between your code and http related code. As opposed to everything just being a middleware.
  

2. Modern. Promises and async/await is preferred and recommended over callbacks whenever possible.

3. Compatible with Express's middlewares out of the box.

4. Better error-handling, almost everything is then-able and catch-able.

5. It's fast. (On average, handles twice the requests and therefore half the latency per request compared to Express or Koa)

#### example

```js
const http = require("http")
const {leaf, routes, define, site_defaults} = require("leaf")

const hello = () => {
  return "Hello World"
}

const param_example = (str) => {
  return "Hi, " + str
}

const app = define([
  routes.get("/", [], hello),
  routes.get("/:param", ["param"], param_example)
])

const site = define([
  site_defaults(),
  routes.route(app)
])

http.createServer(leaf(site)).listen(3000)
```
