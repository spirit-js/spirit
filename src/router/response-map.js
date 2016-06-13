/*
 * ResponseMap & related functions
 * ResponseMap is for making response maps
 * with chainable helper functions
 */

const core_response = require("../core/response")
const mime = require("send").mime
mime.default_type = undefined

class ResponseMap {
  constructor(body) {
    this.status = 200
    this.headers = {}
    this.body = body || ""
  }

  statusCode(n) {
    this.status = parseInt(n)
    return this
  }

  type(content_type) {
    let t = mime.lookup(content_type)
    if (!t) {
      return this
    }

    let charset = ""
    if (mime.charsets.lookup(t)) charset = "; charset=utf-8"

    this.headers["Content-Type"] = t + charset
    return this
  }

  _type(content_type) {
    if (!this.headers["Content-Type"]) {
      return this.type(content_type)
    }
    return this
  }

  location(url) {
    this.headers["Location"] = url
    return this
  }
}

const is_response_map = (obj) => {
  if (typeof obj === "object") {
    return obj instanceof ResponseMap
  }
  return false
}

const create = (body) => {
  let rmap
  if (core_response.is_response(body)) {
    rmap = new ResponseMap(body.body).statusCode(body.status)
    rmap.headers = body.headers
  } else {
    rmap = new ResponseMap(body)
  }
  return rmap
}

/**
 * returns a ResponseMap for a http redirect based
 * on status code and url, default status code is 302
 *
 * moved-permanently 301
 * found 302
 * see-other 303
 * temporary-redirect 307
 * permanent-redirect 308
 *
 * @param {number} status - http status code
 * @param {string} url - url to redirect to
 * @return {ResponseMap}
 */
const redirect = (status, url) => {
  if (!url) {
    url = status
    status = 302
  }

  if (typeof status !== "number" || typeof url !== "string") {
    throw TypeError("invalid arguments to `redirect`, need (number, string) or (string). number is a optional argument for a valid redirect status code, string is required for the URL to redirect")
  }

  return new ResponseMap()
    .statusCode(status)
    .location(url)
}

module.exports = {
  ResponseMap,
  create,
  is_response_map,
  redirect
}
