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
/*const strip = (headers) => {
  const keys = Object.keys(headers)
  for (var i = 0; i < keys.length; i++) {
    if (typeof headers[keys[i]] === "undefined") {
      delete headers[keys[i]]
    }
  }
  return headers
}*/

const strip = (obj, k) => {
  if (typeof obj[k] === "undefined") {
    return true
  }
  return false
}

const fix_case = (k) => {
  return k.split("-").map((p) => {
    return p[0].toUpperCase() + p.substr(1).toLowerCase()
  }).join("-")
}

const proper = (headers) => {
  const keys = Object.keys(headers)
  if (keys.length === 0) {
    return undefined
  }

  const new_headers = {}
  for (var i = 0; i < keys.length; i++) {
    if (strip(headers, keys[i]) === false) {
      new_headers[fix_case(keys[i])] = headers[keys[i]]
    }
  }
  return new_headers
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
  res.writeHead(resp.status, proper(resp.headers))
  if (resp.body === undefined) {
    return res.end()
  }

  if (typeof resp.body.pipe === "function") {
    resp.body.pipe(res)
  } else {
    res.write(resp.body)
    res.end()
  }
}

const adapter = (handler, middleware) => {
  if (typeof middleware === "undefined") middleware = []

  return (req, res) => {
    const request_map = request.create(req)
    const adp = core.compose(handler, middleware)
    adp(request_map)
      .then((resp) => {
        if (!response.is_response(resp)) {
          throw new Error("Error: node.js adapter did not receive a proper response (response map). Got: " + JSON.stringify(resp))
        }
        send(res, resp)
      })
      .catch((err) => {
        const resp = response.err_response(err)
        if (process.env.NODE_ENV === "production") {
          resp.body = ""
        }
        send(res, resp)
      })
  }
}

module.exports = {
  adapter,
  send
}
