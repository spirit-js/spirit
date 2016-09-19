/**
 * node adapter for spirit
 */
const core = require("../core/core")
const request = require("./request")
const response = require("./response")

const Response = require("./response-class.js").Response
const size_of = require("./utils.js").size_of
/**
 * Detects if 'Content-Length' headers are set
 * If not set, it sets the header
 * Only possible for string, buffer
 * stream type will usually not have a length and need
 * to be closed manually with `.end()`
 *
 * For file-stream, it's possible to fs.stat for a length
 * But this function is more of a simple fail-safe
 *
 * @param {response} resp - response
 * @return {object} response headers
 */
const content_length = (resp) => {
  if (resp.body === undefined) {
    resp.headers["Content-Length"] = 0
    return resp.headers
  }
  const h = Response.get(resp, "Content-Length")
  if (h === undefined) resp.headers["Content-Length"] = size_of(resp.body)
  return resp.headers
}

/**
 * strips all undefined values from `headers`
 *
 * this is needed because node `res.writeHead` will still write
 * headers with undefined values
 *
 * @param {object} headers - response headers
 * @return {object} response headers
 */
const strip = (headers) => {
  const keys = Object.keys(headers)
  for (var i = 0; i < keys.length; i++) {
    if (typeof headers[keys[i]] === "undefined") {
      delete headers[keys[i]]
    }
  }
  return headers
}

/**
 * writes a http response map to a node HTTP response object
 *
 * It only knows how to write string/buffer and of course stream
 *
 * NOTE: There is no guards or type checking
 *
 * @param {http.Response} res - node http response object
 * @param {response-map} resp - response map
 */
const send = (res, resp) => {
  res.writeHead(resp.status, strip(content_length(resp)))
  if (resp.body === undefined) {
    return res.end()
  }

  // resp body is a stream
  if (typeof resp.body.pipe === "function") {
    resp.body.pipe(res)
  // resp body is a string or buffer
  } else {
    res.write(resp.body)
    res.end()
  }
}

const adapter = (handler, middleware) => {
  if (middleware === undefined) {
    middleware = []
  } else if (typeof middleware === "function") {
    middleware = [middleware]
  }
  const adp = core.compose(handler, middleware)

  return (req, res) => {
    const request_map = request.create(req)
    adp(request_map)
      .then((resp) => {
        if (!response.is_response(resp)) {
          throw new Error("node.js adapter did not receive a proper response (response map). Got: " + JSON.stringify(resp))
        }
        send(res, resp)
      })
      .catch((err) => {
        const resp = response.err_response(err)
        if (process.env.NODE_ENV === "production") {
          resp.body_()
        }
        send(res, resp)
      })
  }
}

module.exports = {
  adapter,
  send
}
