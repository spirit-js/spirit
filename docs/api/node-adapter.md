- [adapter](#adapter)
- [response](#response)

# adapter
##### (spirit.node.adapter)
Interfaces with node's http, https, http2 modules.

Takes a `handler` function and a array of spirit compatible `middlewares`.

Returns a node compatible http handler, which is a function with the signature `(req, res)`.

Normally the returned function is passed to a module that requires a node http handler, for example:

```js
http.createServer(spirit.node.adapter(handler, middleware))
```

It will abstract the node http IncomingRequest object (`req`) into a [Request Map](request-map.md).

And pass the Request Map through `middlewares` and then to `handler`. The returned value from those will flow back to the adapter. And the adapter will write to the underlying `req`.

The returned value is expected to be [Response Map](response-map.md).

[Source: src/http/node_adapter.js (adapter)](../../src/http/node_adapter.js#L34)

#### Arguments
* handler {function} A handler function that takes a request map and returns a response map
* middlewares {array} An array of spirit compatible function

#### Return
{function} A node http compatible handler

# response

Exports the following functions:

### is_response
###### (spirit.node.response.is_response)
Returns true if the `val` passed in is a valid response map, otherwise false.

##### Arguments
* val {*} Value to check
#### Return
{boolean}

### internal_err
###### (spirit.node.response.internal_err)
Returns a response map with a 500 status code and `err` set as it's body

When running with NODE_ENV set to production, it will not set a body.

##### Arguments
* err {string|Error} A string or Error to be used as the response map' body
#### Return
{response-map}
