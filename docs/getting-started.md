## Getting Started

Let's start by setting up a starting app with common middlewares already loaded.

1. First setup a working dir, and install spirit and spirit-router: 

   `npm install spirit spirit-router spirit-common --save`

2. Create a file (example: app.js) with the following starting content:

```js
// import spirit libraries
// NOTE: the {adapter} we will import more from spirit.node
// in later examples, but for now just the adapter is fine
const {adapter} = require("spirit").node
const route = require("spirit-router")
const common = require("spirit-common").defaults

const hello = () => {
  return "Hello World!"
}

const app = route.define([  // defines a group of routes
  route.get("/", [], hello) // defines a route
])

const http = require("http")
const server = http.createServer(adapter(app, [
  common("site")            // sets up common middleware
]))
server.listen(3000)
```

To run our first spirit app, run `node app.js` (or whatever name you chose to save your file as).

Now visit `http://localhost:3000` in a browser, you will be greeted with Hello World!

### Separation of code
In our example, there are only two areas we really deal with http related ideas or code.

The first area is where we define our routes `route.define(...)`.

The second area is when setup the http server and call our node adapter `adapter(app, [...])`.

Our `hello()` function is just a _regular_ javascript function. It doesn't know what a `req` or `res` is and doesn't deal with writing to a socket. It simply runs and returns a value.

It's __important__ to understand this distinction, it will help in understanding how spirit works as we move on in this guide.

### The main entry point

In the next chapters we will go over how to write routes, and how they work. But for now a quick overview of how spirit gets started and using common middleware.


The main entry point to our app is setup when we called:
```js
adapter(app, [ common("site") ])
```
The adapter takes our routes (`app`) and middlewares (`[ common("site") ]`) and combines them together into a  handler for creating a http server.

The `[ common("site") ]` is an array of middlewares, in our example we only have one. They are ran on _every_ request.

#### Common Middleware

`common("site")` middleware sets up common functionality that a "site" will need, such as a body parser, proxy forwarding, handling 304 responses, as well as session support.

Session support is currently provided by [express-session](https://www.npmjs.com/package/express-session) module.

You can also customize how the middleware are setup by passing in an options object:
```js
common("site", {
  session: {
    key: "my-own-key",
    store: ..., // A compatible express-session store 
  }
})
```
If session support is not needed, we can instead do `common("api")` which sets up functionality that most "api" web apps will need.

For more info, see [spirit-common](https://github.com/spirit-js/spirit-common).

__NOTE:__ Our example is simple enough to not need any middleware, but in the real world, we will almost always need the common ones provided by `spirit-common` module.




