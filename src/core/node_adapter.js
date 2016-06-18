/**
 * node adapter
 * for interfacing with spirit
 */


const request = (request) => {
  return {}
}

/**
 * writes a http response map to a node HTTP response object
 *
 * It only knows how to write string/buffer and of course stream
 *
 * NOTE: There is no guards or type checking
 *
 * @param {http.Response} res - node http response object
 * @param {response-map} resp - a leaf response map
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
    const request = create_request(req)
    const spirit = main(handler, middleware)
    spirit(request)
      .then((resp) => {
        res.writeHead()
        res.end()
      })
      .catch((err) => {
        // error for http write
      })
  }
}

module.exports = {
  request,
  adapter,
  send
}
