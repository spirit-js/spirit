As mentioned previously in chapter [Response](response.md) whenever a route's function returns a non response map it will be converted into one in a process called _rendering_.

We can extend or modify how values are rendered.

For example, by default strings are rendered to a response with a 200 status code, and Content-Type set to "text/html", as well as Content-Length set. Lets replace it:

```js
const {response} = require("spirit").node

route.render.string = (request, body) => {
  return response(body).type("text")
}

const app = route.define([
  route.get("/", "Hello World!")
])
```

This would apply to __every__ _string_ value returned from a route's function to have a Content-Type of "text/plain".

NOTE: Rendering is applies to __every__ route. If you wanted to transform a response, or do so conditionally based on certain routes, it's better to use a middleware and wrap that specific route or group of routes.

In our example we use `spirit.node.response`, which is just a helper function that helps create a response with chainable helpers with Content-Length pre-filled for us, but we could have just returned a response manually.


### Renderable Types
`render` understands and can be extended with the following types: "string", "number", "null", "buffer", "stream", "file-stream", "array", "object".

NOTE: If a value is already a response map, it will skip the rendering process. Because the sole purpose of rendering is to convert a value to a response map.


### Templates
In other web libraries there is a concept of "template engine". This notion is not http related, template rendering be different things depending on the template used.

Instead spirit provides tools for helping you do what you want, instead of pre-defining what you need to do.

Following that idea, we can build our own rendering for whatever template we like through the rendering process.

By default, "objects" are rendered as a JSON response. We can extend it to also understand a custom object type for rendering. 

Let's say our custom object looks like `{ file: <filepath>, local: <optional variables for template> }` and we are using `jade` templates:

```js
const cache = {}

route.render.object = (request, body) => {
  if (body.file) {
    const f = __dirname + "/" + body.file
    const temp = cache[f] = cache[f] || jade.compileFile(f)
    return response(temp(body.local))
  }
  // otherwise render object type as json
  return response(JSON.stringify(body)).type("json")
}

const app = route.define([
  route.get("/", () => { file: "index.jade" }),
  route.get("/contact", () => { file: "contact.jade", local: { email: "blah@example.com" } }),
  route.get("/home", () => { file: "home.jade" })
])
```
