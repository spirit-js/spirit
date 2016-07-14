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

# response map

A response map is a map (object literal) that has __at least__ two properties and corresponding types, `status` (number), `headers` (object).

The `headers` property is a object literal representing key, value of HTTP headers.

It can _optionally_also have a `body` property which can be of type undefined, string, Buffer, or a readable stream.

A response map is considered a representation of what is intended to be written back for a http request.

##### Common example:
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
This is a valid response, as only a `status` and `headers` are needed, and `headers` can be empty object literal too.
