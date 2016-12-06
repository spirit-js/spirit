Internal API

Considered stable unless denoted with "**".

NOTE: Unlike the rest of the spirit API, there are no camelCase variants.

- [is_Response](#is_Response)
- [size_of](#size_of)
- [type_of **](#type_of)
- [resolve_response](#resolve_response)


-------------------------------------------


# is_Response
##### (spirit.node.utils.is_Response)

Returns `true` or `false` depending on if `v` is a instance of [Response](Response.md)

Does not return true for a response map, this is a specific check.

[Source: src/http/response-class.js (is_Response)](../../src/http/response-class.js#L4)

#### Arguments
* v {*} 

#### Return
{boolean} 


-------------------------------------------


# size_of
##### (spirit.node.utils.size_of)

Returns the size of `v` in bytes, utf-8 is assumed.

It only returns a size for a string or buffer. Otherwise it returns undefined.

This function is useful for determining the "Content-Length" of a response body that is a string or buffer.

[Source: src/http/utils.js (size_of)](../../src/http/utils.js#L1)

#### Arguments
* v {string|buffer} A string or buffer to check

#### Return
{number} The size of the `v` (string or buffer)


-------------------------------------------


# type_of
##### (spirit.node.utils.type_of)

** This function is expected to change in the future

Returns a string representation of the type of `v`. It is similar to `typeof` but it will also correctly detect and report types for: null, array, buffer, stream, file-stream.

As well as all types that `typeof` already identifies (undefined, string, number, etc.)

Example:
```js
type_of([1, 2, 3]) // "array"
type_of(new Buffer("hi")) // "buffer"
type_of(null) // "null"
```

[Source: src/http/utils.js (type_of)](../../src/http/utils.js#L18)

#### Arguments
* v {*} value or object to check

#### Return
{string} A string representation of the type of `v`


-------------------------------------------


# resolve_response
##### (spirit.node.utils.resolve_response)

Resolves a response's body if it's a Promise.

This is mostly used internally.

[Source: src/core/promise_utils.js (resolve_response)](../../src/core/promise_utils.js#L42)

#### Arguments
* p {Promise}

#### Return
{Promise}
