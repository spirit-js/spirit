# leaf

a simple & modern web framework for node.js

(it is compatible to Express and it's middlewares, but simplifies and modernizes the way you normally work in Express)

#### why?

1. Less is more, in leaf there are no route specific middleware, only top-level.
  - No more "proprietary" functions or tangled up in middleware after middleware. (You never needed it anyway)

  - Separation of concerns makes it easier to reason about. Code dealing with http should be separate (at least on an abstract level).

     
2. Which means routes are just normal functions that __return__ something!
  - They can be re-used across projects and libraries as they are just normal functions.

  - They can be re-used across different routes or composed like normal functions. 

3. Promises and async/await is preferred and recommended over callbacks whenever possible.

#### example, hello world in async

```js
const leaf = require("leaf")
const define = leaf.define
const routes = leaf.routes

const hello = () => {
  return "Hello World"
}

const param_example = (str) => {
  return "Hi, " + str
}

const app = define([
  routes.get("/", [], hello),
  routes.get("/:param", ["param"], param_example),
])

const server = define([
  leaf.site_defaults(),
  routes.route(app),
], 3000)
```