## spirit API
This covers spirit's exported API.

When using the node http adapter (`spirit.node`) be sure to become familiar with [request map](request-response-map.md#request-map) and [response map](request-response-map.md#response-map).

- [compose](spirit.md#compose)
- [callp](spirit.md#callp)
- [is_promise](spirit.md#is_promise)

- node
  * [adapter](node.md#adapter)
  * [make_stream](node.md#make_stream)
  * [response](node.md#response)
  * [file_response](node.md#file_response)
  * [err_response](node.md#err_response)
  * [redirect](node.md#redirect)
  * [Response](Response.md)
  * [is_Response](node.md#is_Response)
  * [is_response](node.md#is_response)
  
  * utils
    - [size_of](node-utils.md#size_of)
    - [type_of](node-utils.md#type_of)
    - [resolve_response](node-utils.md#resolve_response)
    
  * middleware
    - [if-modified](node-middleware.md#if-modified)
    - [log](node-middleware.md#log)
    - [proxy](node-middleware.md#proxy)
