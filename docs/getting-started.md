Install spirit and spirit-router: 
```bash
$ npm install spirit spirit-router
```

Start off with a simple app:

```js
const {adapter} = require("spirit").node
const route = require("spirit-router")

const hello = () => {
  return "Hello World!"
}

const app = route.define([
  route.get("/", [], hello)
])

const http = require("http")
const server = http.createServer(adapter(app))
server.listen(3000)
```

If we run our example and visit `http://localhost:3000` in a browser, you will be greeted with Hello World!

### Separation of code
Our `hello()` function is just a normal javascript function, what gets returned is what is sent back as the response.

It does __not__ need to deal with a `req` or `res` object.

Separation of concerns is a central concept to spirit.

If we think about a web request in it's simpliest form, it's basically a function, it takes a input (request) and returns an output (response). So why not write web applications this way?

spirit simplifies everything by abstracting away the complexity of `req` and `res` that normally resulted in impure and complex functions.

### Routes as definitions
Routes in spirit should be thought of as _definitions_ and not some proprietary operation to perform.

```js
  route.get("/", [], hello)
```

When we defined this route, do not think of `hello` as a "routing function". 

When we define a route, we are simply describing the __when__ and __how__. When should we call `hello`, and how to call it.

Routes in spirit serve as a boundary between http related ideas and regular javascript.

### Adapter
```js
const server = http.createServer(adapter(app))
server.listen(3000)
```
spirit has a concept of an adapter where most of the abstractions happen. 

spirit comes with an adapter already for node.js. It converts our routes and app into something node.js's http module can understand.

It can optionally take middlewares `adapter(app, _middleware_)` (more on that in [Using Middleware](using-middleware.md)).




