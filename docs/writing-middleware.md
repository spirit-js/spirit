A simple middleware in spirit looks like this:

```js
(handler) => {
  return (request) => {
    return handler(request)
  }
}

// or simply:
(handler) => (request) => handler(request)
```

You can think of `handler` as "next", the next function (middleware /or handler) to call.

It has access to the request that gets passed along. But it also has access to the return value when calling `handler(request)`, therefore we can modify _both_ the request (input) and response (output).


### Transform request

We can tranform the request by changing what we pass into the next handler:

```js
(handler) => (request) => {
  request.data = "some data to pass forward"
  return handler(request)
}
```


### Transform response

Notice in our examples above we `return` the result of `handler(request)`.

By unwinding and returning the response, middleware can also transform the response.

The return of `handler(request)` is _always_ a Promise for async compatibility.

```js
(handler) => (request) => {
  return handler(request).then((resp) => {
    if (request.headers["etag"] === resp.get("etag")) resp.status = 304
    return resp
  })
}
```

In this example we modify the response to have a 304 status code if certain conditions are met.

##### Recovering From Errors

In the same way we can recover from errors:
```js
const {response} = require("spirit").node

(handler) => (request) => {
  return handler(request).catch((err) => {
    return response("Recovered from " + err)
  })
}
```
Which we can use to send back some custom response.

##### Async/Await Example

If you have ES7 compatibility (via babeljs) then the above examples combined will look like:

```js
(handler) => async (request) => { 
  const resp = await handler(request)
  if (request.headers["etag"] === resp.get("etag")) resp.status = 304
  return resp
}
```

### Initializing
Usually it's not needed, but you can have initialization code for your middleware:

```js
(handler) => {
  // initialize middleware here

  return (request) => handler(request)
}
```

This code gets called __once__ for every time your middleware is loaded. This is useful when you want to do some special setup for each instance of your middleware.


### Testing

Notice middleware is just a closure function that takes a input (request) and returns an (output).

They do not deal with with `req` or `res` either, but instead a request map or response map (which are small JSON-like objects).

This makes testing very easy.

For example if we wanted to test a middleware that sets every HEAD request to be GET:
```js
const middleware = (handler) => (request) => {
  if (request.method === "HEAD") request.method = "GET"
  return handler(request)
}

// test
it("sets GET for every HEAD", () => {
  const test = (assertion) => (request) => expect(request.method).toBe(assertion)
  middleware(test("GET"))({ method: "HEAD" })
  middleware(test("GET"))({ method: "GET" })   // doesn't change if already GET
  middleware(test("POST"))({ method: "POST" }) // doesn't change if POST
})
```

We don't need to mock a `req` object at all, we only needed to pass in an object with the same properties the middleware actually uses.

### Composing
spirit's middleware signature may look familiar to some of you, as it's a common closure pattern.

It was purposely chosen because it's a natural way of composing functions together, following the motto of "it's just javascript". 

There is nothing magical that happens when spirit runs or sets up our middleware together, it's basically composing (or wrapping) functions together.

For example if we had 3 middlewares `a, b, c`:
```js
const final = (request) => { status: 200, headers: {}, body: "Hello World" }

// wrap the middlewares together with `final`
const app = a(b(c(final)))

// now we have a single function that runs through `a, b, c, final` returning the response along the way
app(web_request) 
```

> This is basically what spirit does. Except spirit also ensures a Promise is always returned.

You can compose manually this way, but spirit also provides a helper function to automatically do this for you in `spirit.compose`.

`spirit-router.wrap` also does this, but it has special handling for working with routes.