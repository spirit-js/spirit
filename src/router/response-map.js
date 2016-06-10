/*
 * an chainable helper for making response maps
 */

const core_response = require("../core/response")

const ContentTypes = {
  "json": "application/json",
  "html": "text/html; charset=utf-8",
  "text": "text/plain"
}

const ResponseMap = {
  status: 200,
  headers: {},
  body: "",

  statusCode(n) {
    this.status = parseInt(n)
    return this
  },

  type(content_type) {
    const t = ContentTypes[content_type]
    this.headers["Content-Type"] = t
    return this
  },

  safeType(content_type) {
    if (!this.headers[content_type]) {
      return this.type(content_type)
    }
    return this
  }
}

const is_response_map = (obj) => {
  return obj.isPrototypeOf(ResponseMap)
}

const create = (body) => {
  const rmap = Object.create(ResponseMap)
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
