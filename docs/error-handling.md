Since spirit makes heavy use of Promises, errors in spirit aren't a burden. In fact provide meaningful context for different handling in your web application.

Errors can be handled on multiple levels, depending on how far you want to bubble the error up.

We recover from errors using `.catch` and returning a response.

### Locally
We can handle errors locally within our function:

```js
const lookup = (title) => {
  return Books.findOne({ name: title })
    .catch((err) => response("Book doesn't exist").status_(404))
}

const app = route.define([
  route.get("/:title", ["title"], lookup)
])
```

### Catch All
We can catch all errors with a simple middleware passed to `spirit.node.adapter`:

```js
const app = route.define([
  route.get("/", () => { throw new Error("Oops") })
])

const middleware = [
  (handler) => (request) => handler(request)
      .catch((err) => {
        return response("Internal error: " + err.toString()).status_(500)
      })
]

http.createServer(adapter(app, middleware))
```

All errors _not handled_ from our routes would eventually bubble up to this middleware and be caught and produce a generic 500 response.


### Specific Routes
A catch all middleware that applies to all errors is great for keeping things DRY, but it can be too generic. We can still be DRY by handling specific routes differently.

For example, showing a JSON error for API specific routes, and showing a 500 page for others:

```js
let api = route.define("/api", [
  route.get("/book", ...),
  route.post("/book", ...)
  ... // etc
])

api = route.wrap(api, (handler) => (request) => handler(request).catch((err) => {
  // handle different errors depending on the err from our api routes
  let msg
  if (err === ...) msg = "Book has been deleted"
  if (err === ...) msg = "Book doesn't exist"
  return response(msg).status_(404)
})
  
const app = route.define([
  ...,  // other routes
  api
])

// our catch-all middleware for other non-api routes
const middleware = [
  (handler) => (request) => handler(request)
      .catch((err) => {
        return response("Internal error: " + err.toString()).status_(500)
      })
]

http.createServer(adapter(app, middleware))
```

In this way, we can handle errors more gracefully for different routes that have different contexts.

We can do so endlessly if we had multiple groups of routes that all do different things.