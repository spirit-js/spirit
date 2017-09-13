const url = require("url")

function parseUrl(req) {
  if (!req.url) {
    return { query: {} }
  }

  return url.parse(req.url, true)
}

function getHostAndPort(req) {
  if (!req.headers || !req.headers.host) return {};

  let host = req.headers.host
  // ipv6
  let offset = 0
  if (host[0] === "[") {
    offset = host.indexOf("]") + 1
  }

  let port;
  const index = host.indexOf(":", offset);
  if (index !== -1) {
    // host is modified so do port first
    port = parseInt(host.substring(index + 1, host.length))
    host = host.substring(0, index)
  }

  return { host, port };
}

function getProtocol(req) {
  if(req.connection && req.connection.encrypted) {
    return 'https';
  }

  return 'http';
}
/**
 * create a request map
 *
 * A request map most likely contains the following:
 * - port {number} the port the request was made on
 * - host {string} either a hostname or ip of the server
 * - ip   {string} the requesting client's ip
 * - url  {string} the request URI (excluding query string)
 * - path {string} the request URI (including query string)
 * - method   {string} the request method
 * - protocol {string} transport protocol, either "http" or "https"
 * - scheme   {string} the protocol version ex: "1.1"
 * - headers  {object} the request headers (as node delivers it)
 * - query {object} query string of request URI parsed as object (defaults to {})
 *
 * - req {function} returns the node IncomingRequest object
 *
 *** TODO, add a body if possible
 * - body  {Stream} raw unparsed request body, this is just `req`, as it is the easiest way to pass the 'raw' body, which would be a node stream
 * NOTE: this may change, treat it as a stream only
 *
 * @param {http.Request} req - a node http IncomingRequest object
 * @return {request-map}
 */
const create = (req) => {
  const parsedUrl = parseUrl(req);
  const { host, port } = getHostAndPort(req)
  const request = {
    method: typeof req.method === 'string' ? req.method.toUpperCase() : req.method,
    headers: req.headers,
    scheme: req.httpVersion,
    path: req.url,
    //body: req
    req: function() {
      return req
    },
    host,
    port,
    url: parsedUrl.pathname,
    pathname: parsedUrl.pathname,
    query: parsedUrl.query,
    protocol: getProtocol(req),
    ip: req.connection ? req.connection.remoteAddress : undefined
  }

  return request;
}

module.exports = {
  getHostAndPort,
  getProtocol,
  parseUrl,
  create
}
