# handler 
Returns a http handler that supports node's http module (req, res). It is passed as the handler when creating a http, https, http2 server.

It takes an array or "List" (as returned by [define](define.md)) of Express middlewares.

Each middleware (req, res, next) will be ran in order, unless a middleware does not call `next()`. In which case it is assumed the middleware sent a response as is the same case in Express.

[Source: src/core/core.js (handler)](../../src/core/core.js#L264)

#### Arguments
* middlewares {array|List} An array or "List" of Express middlewares.

#### Return
{function} http handler

