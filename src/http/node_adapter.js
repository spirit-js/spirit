/**
 * node adapter for spirit
 */
const core = require("../core/core")
const request = require("./request")
const response = require("./response")


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
  res.writeHead(resp.status, strip(resp.headers))
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
  if (middleware === undefined) middleware = []

  return (req, res) => {
    const request_map = request.create(req)
    const adp = core.compose(handler, middleware)
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
