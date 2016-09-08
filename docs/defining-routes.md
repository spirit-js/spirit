When we create a route, it does _not_ have a special relationship with the function associated with it.

A route just describes _when_ and _how_ to call the function we pass in. In that way, think of routes as definitions and not a specialized "route handler".

In order to create routes, we have to import spirit-router (if you are following the example from Getting Started then we already did this):

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

As mentioned earlier, our route `route.get("/", [], some_function)` describes __when__ and __how__ to call our function "some_function". This route says when a http GET request for "/" is received, call our "some_function". What it returns from "some_function" is considered the response to the http GET request.

---------------
#### When a Route matches

A route is considered matched _when_ the incoming http request matches the route's http method and path.

##### Route method
We can create routes for different http methods, `get`, `put`, `post`, `delete`, `head`, `options`, `patch`:

```js
route.define([
  route.get(...),
  route.put(...),
  route.post(...),
  route.delete(...)
])
```

If we wanted a route to match _any_ http method, we use `any`:
```js
  route.any("/test", ...)
```
Which would would match any http request for "/test".

For custom http methods that aren't predefined we can use `method`:
```js
  route.method("custom", "/", ...)
```
Which would match for a http request with CUSTOM method for path "/".

##### Route path




--------------
#### How a Route is called

When a route is matched, it will then call the function associated with the route with any arguments it needs.


explain destructuring for routes

explain how to destructure nested arguments

#### Order of matching
spirit-router tries every route in order until a route matches _and_ the route's function returns a value.

```js
route.define([
  route.get("/", ...), // first
  route.get("/", ...), // second
  route.get("/", ...)  // third
])
```

If a `GET /` http request came in, all 3 routes _can_ match but it will go through them in order (first, second, third) and only if


> When a route matches and the route's function returns a value, then the router will consider it's job complete. However if the route's function returns `undefined`, it will continuing trying the next routes.

## Grouping Routes
Routes can be grouped together with `define`, and always belong to a group.

```js
route.define([
  route.get("/", ...),     // GET  /
  route.post("/new", ...)  // POST /new
])
```

Grouped routes can also take a prefix path, which will alter the path of the routes inside of it.

So if we take the above example except give our group route a path of "/users":

```js
route.define("/users", [
  route.get("/", ...),     // GET  /users
  route.post("/new", ...)  // POST /users/new
])
```

Now the routes defined inside will only match if the request path includes the prefix "/users".

#### Composing route groups

Grouping routes also can be used to compose on top of each other, separating different routes based on path but also their logic, for example:

```js
const api = route.define("/api", [
  ... // api specific routes
])

const store = route.define("/store", [
  ... // store specific routes
])

const app = route.define([
  route.get("/", homepage),
  api,
  store
])
```

The benefits of this is not only for readability and organization, but we can apply different middleware to different groups. This allows us to customize routes without hard coding or altering the way our individual routes work. More on this in [ TODO include link to wrapping middleware ](). (For example, if we wanted to handle and display errors differently for our "api" routes versus our "store" routes.)



