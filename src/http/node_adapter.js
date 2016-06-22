/**
 * node adapter for spirit
 */

const core = require("../core/core")
const request = require("./request")
const response = require("./response")

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
  // TODO handle http2
  res.writeHead(resp.status, resp.headers)
  if (typeof resp.body !== "undefined") {
    if (resp.body && resp.body.pipe) {
      resp.body.pipe(res)
    } else {
      res.write(resp.body)
      res.end()
    }
  } else {
    res.end()
  }
}

const adapter = (handler, middleware) => {
  return (req, res) => {
    const request_map = request.create(req)
    const adp = core.main(handler, middleware)
    adp(request_map)
      .then((resp) => {
        if (!response.is_response(resp)) {
          throw "Error: node.js http adapter did not receive a proper response map"
        }
        send(res, resp)
      })
      .catch((err) => {
        const resp = response.internal_err(err)
        if (process.env.NODE_ENV === "production") {
          resp.body = ""
        }
        send(res, resp)
      })
  }
}

module.exports = {
  request,
  adapter,
  send
}
