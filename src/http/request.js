const url = require("url")

const urlquery = (req, request) => {
  if (!req.url) return
  const result = url.parse(req.url, true)
  request.url = req.url
  request.query = result.query
}

const hostport = (req, request) => {
  if (req.headers && req.headers.host) {
    const host = req.headers.host
    // ipv6
    let offset = 0
    if (host[0] === "[") {
      offset = host.indexOf("]") + 1
    }
    const index = host.indexOf(":", offset);
    request.host = host
    if (index !== -1) {
      request.host = host.substring(0, index)
      request.port = parseInt(host.substring(index + 1, host.length))
    }
  }
}

const protocol = (req, request) => {
  request.protocol = "http"
  if (req.connection && req.connection.encrypted) {
    request.protocol = "https"
  }
}

/**
 * create a request map
 *
 * A request map most likely contains the following:
 * - port {number} the port the request was made on
 * - host {string} either a hostname or ip of the server
 * - ip   {string} the requesting client's ip
 * - url  {string} the request URI (excluding query string)
 * - method   {string} the request method
 * - protocol {string} either "http" or "https"
 * - scheme   {string} the transport protocol ex: "HTTP/1.1"
 * - headers  {object} the request headers (as node delivers it)
 *
 * - req {function} returns the node IncomingRequest object
 *
 *** TODO, add a body?
 * - body  {Stream} raw unparsed request body, this is just `req`, as it is the easiest way to pass the 'raw' body, which would be a node stream
 * NOTE: this may change, treat it as a stream only
 *
 * - query {object} query string of request URI parsed as object (defaults to {})
 *
 * @param {http.Request} req - a node http IncomingRequest object
 * @return {request-map}
 */
const create = (req) => {
  const request = {
    method: req.method,
    headers: req.headers,
    scheme: req.httpVersion,
    //body: req
    req: function() {
      return req
    }
  }

  if (req.connection) {
    request.ip = req.connection.remoteAddress
  }

  protocol(req, request)
  hostport(req, request)
  urlquery(req, request)
  return request
}

module.exports = {
  hostport,
  protocol,
  urlquery,
  create
}
