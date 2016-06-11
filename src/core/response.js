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

/**
 * checks if `resp` is a valid response
 *
 * @param {*} resp - object to check
 * @return {boolean}
 */
const is_response = (resp) => {
  if (typeof resp === "object"
      && typeof resp.status === "number"
      && typeof resp.headers === "object"
      && !Array.isArray(resp.headers)) {
    return true
  }
  return false
}

/**
 * returns a 404 response map with `body`
 *
 * @param {*} body - the body of a response-map
 * @return {response-map}
 */
const not_found = (body) => {
  return { status: 404, headers: {}, body }
}

/**
 * returns a 500 response map with `body`
 *
 * @param {*} body - the body of a response-map
 * @return {response-map}
 */
const internal_err = (body) => {
  return { status: 500, headers: {}, body }
}

module.exports = {
  internal_err,
  not_found,
  is_response,
  send
}
