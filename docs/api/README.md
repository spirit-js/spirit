## spirit API
This covers spirit's exported API. Be sure to become familiar with [request map]() and [response map]() as the terms come up in the API docs.

- [compose](spirit.md#compose) Composes together a handler and middleware into a single function
- utils
  * [callp]()
  * [is_promise]()
  * [resolve_response]()
- node
  * [adapter](node-adapter.md#adapter) The adapter for interfacing with node http, https, http2
  * [Response]()
  * [is_Response]()
  * [is_response]()
  * [response]()
  * [file_response]()
  * [err_response]() 
  * [redirect]()
  * [not_found]()
  * utils
    - [size_of]()
    - [type_of]()
  * middleware
    - [head]()
