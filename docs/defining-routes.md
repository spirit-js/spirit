As mentioned in previous chapters, a route just describes _when_ and _how_ to call the function we passed in.

In the previous chapters we focused on how it calls our function, now we will talk more about when a route is matched.

> Remember when you see `route`, it's imported from `spirit-router` from our very first example.

```js
const route = require("spirit-router")
```

## Creating Routes

Routes are _always_ grouped with `define`, even if we only have 1 route:

```js
route.define([
  route.get("/", [], some_function)
])
```

This specifies the route will match and call our `some_function` with no arguments `[]`. It will match when the incoming request is a `GET /` request. That is, the request is a GET method, for path /.

Since there are no arguments, we can optionally omit it and write the above example as:
```js
route.define([
  route.get("/", some_function)
])
```

Routes are tried in the order they first appear, and are considered matched when the incoming request's method and path matches the routes. Once this happens, the function for the route will be called with any arguments defined.

However, the router will only consider the routing is over _if_ the function of the route returns a value that isn't `undefined`. 

If `undefined` is returned, the router will keep trying until a route finally has a response.

```js
// #=> GET /

route.define([
  // matches but returns undefined, the router continues
  route.get("/", () => undefined),
  // matches and returns a value, routing ends
  route.get("/", () => "Hello")
])
```

#### Method

`spirit-router` exports common methods besides just `get`.

It also exports: `put`, `post`, `delete`, `head`, `options`, `patch`:

```js
route.define([
  route.post(...),
  route.delete(...)
])
```

If we wanted a route to match _any_ http method, we use `any`:
```js
  route.any("/test", ...)
```
Which would would match any http request for path "/test".

For custom http methods that aren't pre-defined we can use `method`:
```js
  route.method("custom", "/", ...)
```
Which would match for a http request with CUSTOM method for path "/".

#### Path

The path of a route doesn't have to always be a string.

They can be a _string pattern_, or regexp. (They work exactly the same way as Express and other web libraries.)

```js
const greet = (name) => {
  return "Hello, " + name
}

route.define([
  route.get("/:name", ["name"], greet)
])
// #=> GET /bob
// { status: 200, 
//   headers: { "Content-Type": "text/html; charset=utf-8" }, 
//   body: "Hello, bob" }
```

As shown in the comment, the result is "Hello, bob" when we make a `GET /bob` request.

It's able to pass in `name` because of dependency injection (discussed also in [Request](request.md)).

When the route matches, it'll see `"/:name"` means to hold on to the value in the path. The `["name"]` signals `greet` depends on the value of `"name"` before we can call it. So `"name"` is looked up on the request and `greet` is called with it.

We can also use regexp itself, or regexp characters such as "*" (which matches any path):

```js
const inspect = (url) => {
  return "You made a request to: " + url
}

route.define([
  route.get("*", ["url"], inspect)
])
// #=> GET /test-test
// { status: 200, 
//   headers: { "Content-Type": "text/html; charset=utf-8" }, 
//   body: "You made a request to: /test-test" }
```