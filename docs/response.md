```js
const hello = () => {
  return "Hello World!"
}

const app = route.define([
  route.get("/", [], hello)
])
```

When we ran our very first example above, it worked, we see "Hello World!" in our browser. 

But you may wonder how it's possible since a http response requires more information such as a status code or headers.

## Response

In the previous chapter [Request](request.md), you saw how a request is abstracted to be a simple JSON-like object, the same applies to a response (or sometimes called response map).

A response is a JSON-like object (or can be thought of as a hash, dict, map in other programming languages) representing the response intended to be sent back to a client (browser).

A response is basically an object literal with 3 properties: status, headers, body (optional).

Just like a request can be passed around in spirit, so can a response. This is in contrast to other web libraries. You will see this more in later chapters dealing with middleware.

`status` would be a number corresponding to the http status code of the response.

`headers` is a object with key, value pairs for it's respective http response header.

`body` is the response body to write back to the client, it is optional. If it exists, it __must__ be either string, buffer, stream, file stream, or undefined.

### Route as a gateway

As mentioned previously routes act as a boundary or gateway between http related code and your code.

When a route is matched and calls your function, it will check the return value in a process called _rendering_. If the value is not a response map, it will render it to be one with some smart assumptions.

The above `hello()` returns "Hello World!" which gets converted to a response:
```js
{ status: 200, 
  headers: {
    Content-Type: "text/html; charset=utf-8" },
  body: "Hello World!" }
```

To spirit both of the following functions are equivalent:
```js
const hello = () => {
  return "Hello World!"
}

const hello2 = () => {
  return { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" }, body: "Hello World!" }
}
```

If we wanted to test or re-use the second function (`hello2()`) and get our original value "Hello World!", we can just read the 'body' property:
```js
hello2().body // "Hello World!"
```
Which is still easier than mocking a `res` object to pass in and extract information from it.

Often times you will not need to write out a response map, but it's important to understanding how spirit works.

### Content Length
If you noticed our response map examples above are missing an important response header: "Content-Length". `spirit.node.adapter` will automatically fill this property for us when the response body is a string or buffer __and__ we did not specify our own "Content-Length". 

So we can leave this out of our response when working with a response body that is a string or a buffer.

A undefined body will result in "Content-Length" being 0.

### Custom Responses & Extending

There are helper functions for creating responses when you want a more custom response. Explained in [Return From Routes](return-from-routes.md).

Rendering in spirit (the process of converting return values to a response map) can be extended as well! So any return value can customized to suit your web application.

Even custom return values can be created, such as an returning an object like `{ file: "my_file.md", html: true }`.

This is explained in [Rendering Routes](rendering-routes.md).


