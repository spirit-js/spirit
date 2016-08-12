- [request map](#request-map)
- [response map](#response-map)



# request map

A request map is a map (object literal) representation of a http request.

By default the node http adapter will populate the following properties:

- port {number} the port the request was made on
- host {string} either a hostname or ip of the server
- ip   {string} the requesting client's ip
- url  {string} the request URI (excluding query string)
- method   {string} the request method
- protocol {string} either "http" or "https"
- scheme   {string} the transport protocol ex: "HTTP/1.1"
- headers  {object} the request headers (as node delivers it)
- query {object} query string of request URI parsed as object (defaults to {})

And additionally a method:

- req {function} returns the original node IncomingRequest object

These properties should not be modified except under very rare circumstances where it is practical to do so.

Additional properties can be added. For example it is common to have the request body be parsed and included as a body property, (this is provided via middleware).

`headers` is as node.js delivers it, therefore all the header names are lower cased.

# response map

A response map is a map (object literal) that has __at least__ two properties and corresponding types, `status` (number), `headers` (object).

The `headers` property is a object literal representing key, value of HTTP headers.

It can _optionally_ also have a `body` property which can be of type undefined, string, Buffer, or stream (readable).

A response map is considered a simplified representation of what is intended to be written back for a http request.

Because of it's simple form, it provides an easy outlet for testing the proper response of functions.

#### Example:
```js
{
  status: 200,
  headers: {
    "Content-Type": "text/html; charset=utf-8"
  },
  body: "<h1>Hello World</h1>"
}
```
This would write back a 200 response with the Content-Type set with the body `"<h1>Hello World</h1>"`.

#### Minimal, but valid example:
```js
{
  status: 404,
  headers: {}
}
```
This is a valid response, as only a `status` and `headers` are needed, and `headers` can be an empty object (which just means no headers).


### Note about headers

Headers share exactly the same concept as headers in Node.js. That is, the header names should be unique regardless of case. And to set multiple values of the same header, use an array.

Example:
```js
{
  status: 200,
  headers: {
    "Set-Cookie": ["type=ninja", "language=javascript"]
  }
}
```

Header names __should__ (meaning strongly recommended) be capitalized per word. For example `"Content-Type"` and not `"Content-type"`.

There is a [Response](https://github.com/spirit-js/spirit/blob/master/docs/api/Response.md) object class that helps when working with response maps. It provides chainable helper functions to make it easier to work with headers. (You don't normally use it directly, but instead it's returned from `spirit.node.response`, `spirit.node.file_response`, `spirit.node.redirect`, `spirit.node.err_response`)

A Response is a valid response map, as it has `status`, `headers`, the optional `body` property.

