# response 
Creates and returns a [ResponseMap](response-map.md) with the passed in argument set to ResponseMap's body.

HTTP responses contain a status code, and response headers. It may or may not contain a body though. The purpose of `response` is to make setting the status code and headers easier.

When you return a value as part of a route:
```js
() => {
  return "Hello World"
}
```

`"Hello World"` would be the body of the HTTP response you intend to send back. A status code of 200 is assumed. And a content type of html too.

If you wanted to change these defaults, you can wrap it as a ResponseMap and use it's chainable methods:
```js
() => {
  return response("Hello World").statusCode(500).type("text")
}
```
Which sends back a HTTP response with a 500 status code and text/plain content type and of course the body "Hello World".

For more information on the chainable methods available, see [ResponseMap](response-map.md)

Internally, all returned values of a route get converted to a ResponseMap eventually.

[Source: src/router/response-map.js (create)](../../src/router/response-map.js#L56)

#### Arguments
* body {*} A value you expect to send back as part of your HTTP response's body

#### Return
{ResponseMap} A newly created [ResponseMap](response-map.md)

