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
    // if k exists, then just return
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
    const existk = Response.field(response, k)

    if (existk !== undefined) {
      // if the header already exists, and does not match
      // in case, resolve the duplicate headers by correcting
      // the case
      if (existk !== k) {
        k = k.split("-").map((p) => {
          const c = p[0].toUpperCase() + p.substr(1).toLowerCase()
          if (c === "Etag") {
            return "ETag"
          }
          return c
        }).join("-")

        // if existk is not the correct case compared to k
        // then delete existk and use k instead
        if (existk !== k) delete response.headers[existk]
      }
    } else {
      // if header doesnt exist & the value is empty
      // then there is nothing to do
      if (v === undefined) return response
    }

    response.headers[k] = v
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
