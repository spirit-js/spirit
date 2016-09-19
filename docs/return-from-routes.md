In chapter [Response](response.md), we discussed how return values from a route's function get converted to a response if it already isn't one.

```js
const hello = () => {
  return "Hello World!"
}

const app = route.define([
  route.get("/", [], hello)
])
// #=> GET /
// { status: 200, 
//  headers: {
//    Content-Type: "text/html; charset=utf-8" },
//  body: "Hello World!" }
```

"Hello World!" by itself doesn't make sense in terms of a http response, so spirit makes smart assumptions about what we probably meant. And it fills out our status and content type for us.

### Custom Response

Sometimes we may want to customize our response, and as mentioned in the Response chapter, you can return your own response directly:

```js
const hello = () => {
  return { status: 123, headers: {}, body: "Custom response!" }
}

const app = route.define([
  route.get("/", [], hello)
])
// #=> GET /
// { status: 123, 
//  headers: {},
//  body: "Custom response!" }
```

And spirit will see it's already a response and send this back to the client directly without trying to render it into a response.

spirit has chainable helper function called `response()` for customizing a response that still try to fill in gaps for us to avoid errors:
```js
const {response} = require("spirit").node

const hello = () => {
  return response("Custom response!").status_(123)
}

const app = route.define([
  route.get("/", [], hello)
])
// #=> GET /
// { status: 123, 
//  headers: {
//    Content-Type: "text/html; charset=utf-8" }
//  },
//  body: "Custom response!" }
```

We get back the same response, but Content-Type are filled out for us.

We can continue changing our response by using methods on it:
```js
const resp = response("Custom response!")
  .status_(123)
  .type("text/plain")
  .set("Custom-Header", "test")
  .len(5)
  
// resp = { status: 123, 
//  headers: {
//    Content-Length: 5,
//    Content-Type: "text/plain; charset=utf-8" },
//    Custom-Header: "test"
//  },
//  body: "Custom response!" }

// we can still access properties of a response
resp.status // 123
resp.body   // "Custom response!"
```

### File Response
Often you will want to read from a file and send it back.

You can of course send the file data back directly:

```js
const fs = require("fs")

const readfile = () => {
  return fs.createReadStream("my-file.txt")
}

route.define([
  route.get("/", [], readfile)
])
// #=> GET /
// { status: 200,
//   headers: {
//     Content-Length: <file's size>,
//     Content-Type: <based on file's extension, .txt so text/plain>,
//     Last-Modified: <modtime of file>
//   },
//   body: <file's content>
// }
```

As you can see spirit will make smart assumptions for generating our response here too.

We could've also used `fs.readFile()` instead of creating a stream, but spirit understands a node.js stream and what we mean.

You can also use `spirit.node.file_response`:

```js
const {file_response} = require("spirit").node

const readfile = () => {
  return file_response("my-file.txt")
}

route.define([
  route.get("/", [], readfile)
])
```

And if we wanted to customize the response for the file:
```js
const readfile = () => {
  return file_response("my-file.txt").then((resp) => {
    return resp.status_(123).type("html").len(100)
  })
}
```

__NOTE:__ `file_response()` returns a Promise of the response unlike `response()`, this is because `file_response()` is async when reading the file.

### Other response helpers

There are other helper functions for creating a response, such as `redirect()`:
```js
() => {
  return redirect("http://google.com")
}
```
More can be found at [spirit API](https://github.com/spirit-js/spirit/tree/master/docs/api) docs.

For more info on the chainable methods see the [Response API](https://github.com/spirit-js/spirit/blob/master/docs/api/Response.md) doc.

