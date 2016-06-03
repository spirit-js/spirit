- response.respond needs implementation that makes smart assumptions
  * like passing a Buffer or pipe in :body, auto switch to chunked response
  * response.repond should understand short hands like: { status: 200, type: "json" }
  * extensible in a middleware like way of handling different responses

- even better performance (tracer)
  - can speed up literal string paths and skip regexp on them
    (does path-to-regexp) already do this?

- handling request "freshness" Not Modified

- log output middleware / should be tied into tracer

- development mode has a pretty 500 server error

- test web sockets

- test https / http2

- test passport

- test gzip compression

- fill out Express support (res.redirect, res.sendFile, etc)
