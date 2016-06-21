/**
 * node adapter for spirit
 */

const core = require("../core/core")
const response = require("./response")

const request = (request) => {
  return {
    method: request.method,
    url: request.url
  }
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
    req = request(req)
    const adp = core.main(handler, middleware)

    adp(req)
      .then((resp) => {
        if (!response.is_response(resp)) {
          throw "Error: handler did not return a proper response map"
        }
        send(res, resp)
      })
      .catch((err) => {
        // error for http write

        // TODO warn via log

        // TODO if production, don't bother sending a body

        // instead of crashing, just send back a 500
        send(res, response.internal_err(err))
      })
  }
}

module.exports = {
  request,
  adapter,
  send
}
