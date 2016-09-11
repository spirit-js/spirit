## spirit API
This covers spirit's exported API.

- [compose](spirit.md#compose)
- [callp](spirit.md#callp)

node http adapter (`spirit.node`) requires you to be familiar with [request map](request-response-map.md#request-map) and [response map](request-response-map.md#response-map).

- node
  * [adapter](node.md#adapter)
  * [make_stream](node.md#make_stream)
  * [response](node.md#response)
  * [file_response](node.md#file_response)
  * [err_response](node.md#err_response)
  * [redirect](node.md#redirect)
  * [Response](Response.md)
  * [is_response](node.md#is_response)


#### Internal API
The following are internal API that are exported and documented.

`spirit.node.utils` namespace:

- [is_Response](internal.md#is_Response)
- [size_of](internal.md#size_of)
- [type_of](internal.md#type_of)
- [resolve_response](internal.md#resolve_response)]
