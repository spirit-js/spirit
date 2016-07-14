- [adapter](#adapter)
- [is_Response](#is_Response)
- [is_response](#is_response)
- [response](#response)
- [file_response](#file_response)
- [err_response](#err_response)
- [redirect](#redirect)
- [not_found](#not_found)

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
# is_Response
##### (spirit.node.is_Response)

description

[Source: src/core/promise_utils.js (callp)](../../src/core/promise_utils.js#L20)

#### Arguments
* fn {*} xxx
* args {array} xxx

#### Return
{Promise} xxx



-------------------------------------------
# is_response
##### (spirit.node.is_response)

description

[Source: src/core/promise_utils.js (callp)](../../src/core/promise_utils.js#L20)

#### Arguments
* fn {*} xxx
* args {array} xxx

#### Return
{Promise} xxx



-------------------------------------------
# response
##### (spirit.)

description

[Source: src/core/promise_utils.js (callp)](../../src/core/promise_utils.js#L20)

#### Arguments
* fn {*} xxx
* args {array} xxx

#### Return
{Promise} xxx



-------------------------------------------
# file_response
##### (spirit.)

description

[Source: src/core/promise_utils.js (callp)](../../src/core/promise_utils.js#L20)

#### Arguments
* fn {*} xxx
* args {array} xxx

#### Return
{Promise} xxx



-------------------------------------------
# err_response
##### (spirit.)

description

[Source: src/core/promise_utils.js (callp)](../../src/core/promise_utils.js#L20)

#### Arguments
* fn {*} xxx
* args {array} xxx

#### Return
{Promise} xxx



-------------------------------------------
# redirect
##### (spirit.)

description

[Source: src/core/promise_utils.js (callp)](../../src/core/promise_utils.js#L20)

#### Arguments
* fn {*} xxx
* args {array} xxx

#### Return
{Promise} xxx



-------------------------------------------
# not_found
##### (spirit.)

description

[Source: src/core/promise_utils.js (callp)](../../src/core/promise_utils.js#L20)

#### Arguments
* fn {*} xxx
* args {array} xxx

#### Return
{Promise} xxx
