const mime = require("mime")
mime.default_type = undefined

/*
 * Response is for making response maps
 * with chainable helper functions
 */

class Response {
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

const is_Response = (obj) => {
  if (obj !== null && typeof obj === "object") {
    return obj instanceof Response
  }
  return false
}

module.exports = {
  Response,
  is_Response
}
