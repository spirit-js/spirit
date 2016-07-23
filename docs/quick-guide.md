This is a quick tutorial (in the style of a Learn X in Y minutes guide) to using spirit.

Code examples use ES6 syntax, and async/await. The style omits ending in semi-colons, which you do not have to follow.

# Getting Started with spirit & spirit-router

spirit's purpose is to provide a minimal set of abstractions that make building a web application easier.
Some of it's goals to achieve:
- being more modular, almost everything in spirit can be replaced and other parts should be expected to still work
- separating HTTP related ideas and code from user code
- being more functional and modern (support for Promise & async/await)

spirit-router is just a router to route requests to your own code.

To get started, first install spirit and spirit-router:
`npm install spirit spirit-router`

## Creating Routes

A simple Hello World web app would look like this:

```js
const {adapter} = require("spirit").node
const route = require("spirit-router")

const app = route.define([
  route.get("/", "Hello World")
])

const http = require("http")
http.createServer(adapter(app)).listen(3000)
```

A route is created with `route.get("/", "Hello World")` which returns a 200 response with "Hello World" for any GET requests on /.
`spirit-router` exports a lot of common http methods for creating routes, so `route.post`, `route.delete`, etc. all work.

Routes are always wrapped with `route.define` which takes an array of routes and creates a group.
Even though in this example there is only 1 route (`route.get("/", "Hello World")`), it is still needed to wrap it with `route.define`.

We can take any group of routes (what is returned by `route.define` which is `app` in this example) and pass it to `adapter` which creates a handler for node's `http.createServer`.

## Grouping Routes with define

When you group routes together, they can be re-used and can take a optional string prefix for routing.

```js
const {adapter} = require("spirit").node
const route = require("spirit-router")

const users = route.define("/users", [
  route.get("/", "Hello Users"),
  route.post("/", "You posted to /users")
])

const app = route.define([
  route.get("/", "Hello World"),
  users
])

const http = require("http")
http.createServer(adapter(app)).listen(3000)
```

In this example, our main group `app` also includes routes from `users`. And `users` has a string prefix "/users", which specifies that all routes inside the `users` group will only match if the request URL begins with "/users".

So a GET /users will return "Hello Users". But a GET / will return "Hello World". And additionally a POST /users will return "You posted to /users".

## Routes

Routes don't have to just return strings like the above examples with returning "Hello World". They can also be a function.

```js
const greet = () => {
  return "Hello World"
}

route.define([
  route.get("/", greet)
])
```

And the function will be run when the request matches, which produces the same result as `route.get("/", "Hello World")`.

Routes also can use a string, string pattern, or regexp to match a request's path. They are exactly like in Express.

So our greet function can be more interesting:

```js
const greet = (name) => {
  return "Hello, " + name
}

route.define([
  route.get("/:name", ["name"], greet)
])
```
Will match any GET request _except_ "/". So "/hello" works, "/test" will also work etc.
Which will produce a 200 response with "Hello, hello" and "Hello, test" respectively.

Notice that `["name"]` was added in as an additional argument to our route. This specifies that the value of "name" that was matched is needed in order to run `greet`, which is a form of dependency injection.

## Dependency Injection for Routes

Whenever a route needs additional information from a request in order to run a route's function, then using dependency injection is needed.

```js
const inspect = (method) => {
  return "You made a " + method + " request"
}

route.define([
  route.any("*", ["method"], inspect)
])
```

`route.any` would match any request method for "*" which is any path.
`["method"]` states that the request's method is needed for running `inspect`.
Which would produces "You made a GET request" for GET /.

If we also wanted to include the path (url) of the request, then the example becomes:
```js
const inspect = (method, url) => {
  return "You made a " + method + " " + url + " request"
}

route.define([
  route.any("*", ["method", "url"], inspect)
])
```

## Async Route functions

When a route function needs to do async work like reading a file, calling a web api, etc. then you would return a promise.

```js
const readfile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

route.define([
  route.get("/:filename", ["filename"], readfile)
])
```

Or using async/await:

```js
const readfile = async (filename) => {
  return await fs.readFile(filename) TODO this is not valid
}

route.define([
  route.get("/:filename", ["filename"], readfile)
])
```

## Returning a response from Routes

response, file_response

## Middleware

