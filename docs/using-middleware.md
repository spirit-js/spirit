// TODO not finished yet

Middlewares are functions to transform the request __and__ response.

They can be added through `spirit.node.adapter` which will apply to _every_ web request (and it's response):

```js
const {adapter} = require("spirit")
const route = require("spirit-router")

const app = route.define(...) // define routes

const middlewares = [ ... ] // array of middlewares

http.createServer(adapter(app, middlewares))
```

They can also be applied to group of routes or routes through `spirit-router.wrap`:
```js
const route = require("spirit-router")

const app = route.define([
  route.wrap(route.get("/"), [ ... ]) // middleware single route
])

route.wrap(app, [ ... ]) // middleware group of routes
```


### Middlewares Flow Back


### Common Middlewares
In our very first example in [Getting Started]() we also included `spirit-common` as a middleware to adapter.

`spirit-common` provides many default middleware that most people will need

### Express Middlewares
Most Express middleware can be used as-is in spirit through [spirit-express](https://github.com/spirit-js/spirit-express) library.

For example to use the passport:
```js
... TODO
```



