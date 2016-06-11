/*
 * an chainable helper for making response maps
 */

const core_response = require("../core/response")

const ContentTypes = {
  "json": "application/json",
  "html": "text/html; charset=utf-8"
}

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
    let t = ContentTypes[content_type]
    if (!t) {
      t = content_type
    }
    this.headers["Content-Type"] = t
    return this
  }

  safeType(content_type) {
    if (!this.headers["Content-Type"]) {
      return this.type(content_type)
    }
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

module.exports = {
  ContentTypes,
  ResponseMap,
  create,
  is_response_map
}
