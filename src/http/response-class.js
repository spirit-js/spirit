const mime = require("mime")
mime.default_type = undefined

const utils = require("../http/utils")

const is_Response = (obj) => {
  if (obj !== null && typeof obj === "object") {
    return obj instanceof Response
  }
  return false
}

/*
 * Response is for making response maps
 * with chainable helper functions
 */

class Response {
  constructor(body) {
    this.status = 200
    this.headers = {}
    this.body = body
  }

  static field(response, k) {
    // if k is correct, then just return
    if (response[k] !== undefined) {
      return k
    }

    k = k.toLowerCase()
    const keys = Object.keys(response.headers)
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === k) {
        return keys[i]
      }
    }
  }

  static get(response, k) {
    return response.headers[Response.field(response, k)]
  }

  static set(response, k, v) {
    const kk = k.split("-").map((p) => {
      const c = p[0].toUpperCase() + p.substr(1).toLowerCase()
      if (c === "Etag") {
        return "ETag"
      }
      return c
    }).join("-")

    // remove any existing fields with the same name
    // if the case isn't correct
    // this enforces a standard for the case of field names
    // also can avoid
    // duplicate headers that are in different cases
    const existk = Response.field(response, k)
    if (existk !== undefined) {
      if (existk !== kk) delete response.headers[existk]
    } else {
      // nothing to set
      if (v === undefined) return response
    }

    response.headers[kk] = v
    return response
  }

  set(k, v) {
    Response.set(this, k, v)
    return this
  }

  get(k) {
    return Response.get(this, k)
  }

  status_(n) {
    this.status = parseInt(n)
    return this
  }

  body_(body) {
    this.body = body
    this.len(utils.size_of(body))
    return this
  }

  type(content_type) {
    let t = mime.lookup(content_type)
    if (!t) t = content_type

    let charset = ""
    if (mime.charsets.lookup(t)) charset = "; charset=utf-8"

    return this.set("Content-Type", t + charset)
  }

  location(url) {
    return this.set("Location", url)
  }

  len(size) {
    const typ_size = typeof size
    if (typ_size !== "undefined" && typ_size !== "number") {
      throw new TypeError("Expected number for Response len() instead got: " + size)
    }
    if (size === 0) size = undefined
    return this.set("Content-Length", size)
  }

  attachment(filename) {
    let v
    if (typeof filename === "string") {
      v = "attachment"
      if (filename !== "") v = v + "; filename=" + filename
    }
    this.set("Content-Disposition", v)
  }

}

module.exports = {
  Response,
  is_Response
}
