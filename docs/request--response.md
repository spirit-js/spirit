In the previous chapter [Getting Started](getting-started.md), we created a initial web app that had a single route which outputted "Hello World!".

```js
// Getting Started example from previous chapter
// ...
const hello = () => {
  return "Hello World!"
}
const app = route.define([
  route.get("/", [], hello)
])
// ...
```

Notice our `hello()` function does __not__ have any understanding of a `req` or `res` object that most of us are familiar with when using node.js. It is simply a regular javascript function that returns something.

This allows for our functions to be more pure, less complex, and have less side of effects (such as dealing with a `res` object). More importantly, our function can return a value that's useful!

### How it works

When we create a route, it does _not_ have a special relationship with the function associated with it. __A route just describes _when_ and _how_ to call the function we pass in.__ 


spirit tries to take a more functional approach in how it does things rather than conforming to how the underlying web server works (node.js in this case).



In this guide they will be called "request" and "response" to differentiate them from the "req" and "res" object most people are familiar with.

The request and response are simplified to be easier to work with. They are no longer complex objects with inheritance, but instead plain simplify objects with 

## Request


## Response