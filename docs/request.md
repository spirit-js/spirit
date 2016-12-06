If a web request can be simply thought of as a function, that is it takes an input (request) and returns an output (response), then how do we get the input (the request) into our function?

In the previous chapter our hello function did not need any information from the request and took no arguments, but what if our function looked like this:
```js
const hello = (url) => {
  return "Hello from " + url
}
```

Remember a route can be thought of as a definition, describing _when_ a route is considered matched (more on this in Defining Routes) and _how_ to call our function when it is matched.

So therefore we can tell it _how_ to call our function, that is with what arguments.

### Dependency Injection

In order to run our new hello function above we define our routes like so:

```js
route.define([
  route.get("/", ["url"], hello)
])
```

Notice the `["url"]`, this tells our route that in order for our `hello` function to run successfully, we depend on "url" being passed into our `hello` function.

And "url" is looked up off the request (which is an object) for us and `hello` is called with it's value. This is a form of dependency injection.

To expand on this further and to include more dependencies:

```js
const hello = (url, method) => {
  return "Hello from " + method + " " + url
}
route.define([
  route.get("/", ["url", "method"], hello)
])
```

Which would produce "Hello from GET /".

### Why Dependency Injection?

You may be wondering why use dependency injection over just passing the entire request into our function.

After all when working with node.js and other web libraries previously you may have gotten use to something like this:
```js
const hello = (req, res) => {
  res.send("Hello from " + req.method + " " + req.url) 
}
```

This goes against spirit's philosophy of being re-usuable, testable and readable! 

Even if we went half way where our function still returned by the request was always passed in, this breaks our re-usuable philosophy! 

We can no longer re-use `hello()` in some other part of our code that doesn't have a request to give it. 

It also breaks testability! If we wanted to test our `hello()` function, we would have to mock an entire request object.

_Besides_, if our function only needs 2 arguments (both strings), why pass it more information than it needs to run?

And when we re-use our function, all we are concerned about now is satisfying it's arguments of providing it with 2 values that are strings.

As mentioned in the previous chapter, do __not__ think of routes as having "routing functions". spirit tries to avoid http from leaking into your code and wants you to avoid writing bloated functions with complex dependencies.

Instead think of them as normal functions that return a value and have real functional signatures.

> Or if you are familiar with functional programming, think of them more in that sense. Writing leaner and more pure functions.

### request is not req

`req` has been abstracted and simplified in spirit, and is called a request (or sometimes called request map).

request and `req` are __not__ the same thing, but have a similar purpose in that they both represent and hold data from an incoming http request.

It can be thought of as a "JSON-like" object. Or can be thought of as a hash, dict, or map in other programming languages.

Unlike `req` it only has a few properties (or keys) with simple values associated with them.

A request always has the following properties: port, host, ip, url, method, protocol, scheme, headers, query. See the [API doc](https://github.com/spirit-js/spirit/blob/master/docs/api/request-response-map.md#request-map) for more info.

More properties can be added to the request (usually through middleware, such as a 'body'). `spirit-router` also adds the property 'param' to request. More on this in [Defining Routes](defining-routes.md).

Sometimes you might need the request or `req` object for a route, which you can also inject it in:

```js
const inspect = (request) => {
  return JSON.stringify(request)
}
route.define([
  route.get("/", ["request"], inspect)
])
```
