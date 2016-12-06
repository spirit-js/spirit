HTTP related middleware

- [if-modified](#if-modified)
- [log](#log)
- [proxy](#proxy)


# if-modified
##### (spirit.node.middleware.ifmod)

The middleware will compare If-Modified-Since and If-None-Match request headers to the corresponding response headers (Last-Modified and ETag). 

If the response status is 2xx and the headers match, it will override the response status to 304.

Last-Modified response header _should_ be a Date object or a string that can converted to a accurate Date object.

NOTE: This middleware does not generate Last-Modified and ETag headers.
However Last-Modified headers are automatically generated for you when you use [file_response](node.md#file_response).


An example (not using spirit-router) of writing out custom ETag headers:
```js
const {response, middleware, adapter} = require("spirit").node

const example = () => {
  return response("Hello").set("ETag", "123")
}

adapter(example, middleware.ifmod)
```
If the request has If-None-Match header populated with "123", then this will match and your response will be converted to a 304 response.

It is important to point out when it matches and a 304 response status is set, the response body will be intact as it flows through spirit. 

Merely setting the response status to 304 will cause the response body to not be sent to the client.

[Source: src/http/middleware/if_modified.js](../../src/http/middleware/if-modified.js)


-------------------------------------------


# log
##### (spirit.node.middleware.log)

Logs to console basic request information for when a request comes in and when it returns, and the time in milliseconds it took to complete.


[Source: src/http/middleware/log.js](../../src/http/middleware/log.js)


-------------------------------------------


# proxy
##### (spirit.node.middleware.proxy)

Middleware for handling "Forwarded" and "X-Forwarded-For" request headers. It will set the request map ip `request.ip` to the value specified by these headers. "Forwarded" has priority if both headers exist.


[Source: src/http/middleware/proxy.js](../../src/http/middleware/proxy.js)

