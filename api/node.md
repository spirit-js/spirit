- [adapter](#adapter) node http adapter

- [make_stream](#make_stream) creates a writable stream (useful for creating a streaming response)

Functions for creating common responses with chainable helpers:
- [response](#response)
- [file_response](#file_response)
- [err_response](#err_response)
- [redirect](#redirect)

For checking if an object is a valid response:
- [is_response](#is_response)



# adapter
##### (spirit.node.adapter)
Interfaces with node's http, https, http2 modules.

Takes a `handler` function and a array of spirit compatible `middlewares`.

Returns a node compatible http handler, which is a function with the signature `(req, res)`.

Normally the returned function is passed to a module that requires a node http handler, for example:

```js
http.createServer(spirit.node.adapter(handler, middleware))
```

It will abstract the node http IncomingRequest object (`req`) into a [request map](request-response-map.md#request-map).

And pass the request map through `middlewares` and then to `handler`. The returned value from those will flow back to the adapter. And the adapter will write back to the connection the response.

The returned value or response is expected to be a [response map](request-response-map.md#response-map).

For the order of execution, given a `middlewares` that looks like: `[middleware1, middleware2]`

Then the flow of a request would look like this:

`(request) -> adapter -> middleware1 -> middleware2 -> handler`

And a response would flow backwards in the same order:

`adapter <- middleware1 <- middleware2 <- handler <- (response)`

[Source: src/http/node_adapter.js (adapter)](../../src/http/node_adapter.js#L34)

#### Arguments
* handler {function} A handler function that takes a request map and returns a response map
* middlewares {array} An array of spirit compatible function

#### Return
{function} A node http compatible handler


-------------------------------------------


# make_stream
##### (spirit.node.make_stream)
##### Added 0.1.1
##### Alias makeStream

It is meant as a helper to create a generic writable stream for when you need to stream a response body.

It is a __must__ to end() the stream once you are done.

__Note__, if you already have a stream, you do not need to use this function. It is meant to quickly create a generic writable stream if you do not have one already.

Example:
```js
const res = make_stream()

// pass res to some async function, or can do some async here
setTimeout(() => {
  res.write("streaming")
  
  setTimeout(() => {
    res.write("streaming still")
    res.end()
  }, 1000)
  
}, 1000)

return response(res) // 'return res' is ok if you are using spirit-router
```

In the example:

1. before the setTimeouts are called, the function returns the response with the stream as it's body.

2. The response goes through any middlewares, then the headers and status are written. This is similar to res.writeHead(). The body has not been written yet as the stream still has no body.

3. 1000ms later, the first setTimeout is triggered and the first chunk of the response body is written and sent to the client.

4. another 1000ms later, the final chunk of the response body is written to the client, and the stream has ended, thus ending the response.

[Source: src/http/response.js (make_stream)](../../src/http/response.js#L57)

#### Arguments
None

#### Return
{Stream} 


-------------------------------------------


# response
##### (spirit.node.response)

Returns a [Response](Response.md) with `body` as the response's body.

A 200 status code would be set by default.

If `body` is a string, "Content-Length" will be populated appropriately with the size of the body. And "Content-Type" will be set to "text/html; charset=utf-8".


[Source: src/http/response.js (response)](../../src/http/response.js#L26)

#### Arguments
* body {undefined|string|buffer|stream} the body of the response

#### Return
{Response}


-------------------------------------------


# file_response
##### (spirit.node.file_response)
##### Alias fileResponse

`file` is either a string of the path of a file or a readable file stream (usually from `fs.createReadStream`).

Returns a Promise of a [Response](Response.md) where the body is set to the stream of `file`.

By default the Response is set to a 200 status code.

A "Content-Type" will be set and be based on the file extension.

"Content-Length" header will also be set to the file's size as well as "Last-Modified" will be set based on the file's mtime, both headers are based _on the time the returned Promise is resolved_.

[Source: src/http/response.js (file_response)](../../src/http/response.js#L55)

#### Arguments
* file {string|file stream} A string of the path of a file, or a readable file stream

#### Return
{Promise} A Promise of a Response


-------------------------------------------


# redirect
##### (spirit.node.redirect)

Returns a [Response](Response.md) for a redirect. A 302 status code is assumed if not specified.

Example:
```js
redirect("http://www.google.com")

redirect(301, "http://www.google.com")
```

[Source: src/http/response.js (redirect)](../../src/http/response.js#L110)

#### Arguments
* status {number} status code, 302 is the default
* url {string} the URL to redirect to

#### Return
{Response}


-------------------------------------------


# err_response
##### (spirit.node.err_response)
##### Alias errResponse

Returns a [Response](Response.md) with a 500 status code and it's body set as `body`.

`body` can be undefined, string, buffer, or stream, but also it can be an Error object.

Example:
```js
err_response(new Error("oops"))
```

[Source: src/http/response.js (err_response)](../../src/http/response.js#L153)

#### Arguments
* body {undefined|string|buffer|stream|Error} the body of the response

#### Return
{Response}


-------------------------------------------


# is_response
##### (spirit.node.is_response)

Returns `true` or `false` depending on if `v` is a [response map](request-response-map.md#response-map)

It will also return `true` for a Response (instace of the class) as a Response is a valid response map.

[Source: src/http/response.js (is_response)](../../src/http/response.js#L8)

#### Arguments
* v {*} 

#### Return
{boolean} 

