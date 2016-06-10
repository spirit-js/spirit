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
    const t = ContentTypes[content_type]
    this.headers["Content-Type"] = t
    return this
  }

  safeType(content_type) {
    if (!this.headers[content_type]) {
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
  const rmap = new ResponseMap(body)
  if (core_response.is_response(body)) {
    rmap.status = body.status
    rmap.headers = body.headers
    rmap.body = body.body
  } else {
    rmap.body = body
  }
  return rmap
}

module.exports = {
  ContentTypes,
  ResponseMap,
  create,
  is_response_map
}
