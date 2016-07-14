const mime = require("mime")
mime.default_type = undefined

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

  code(n) {
    return this.status_(n)
  }

  status_(n) {
    this.status = parseInt(n)
    return this
  }

  get(k) {
    k = k.toLowerCase()
    const keys = Object.keys(this.headers)
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === k) {
        return this.headers[keys[i]]
      }
    }
  }

  set(k, v, overwrite=true) {
    const typ_v = typeof v
    // if overwrite is false, and v is undefined
    // there is never anything to set
    if (overwrite !== true && typ_v === "undefined") {
      return this
    }

    const lk = k.toLowerCase()
    const keys = Object.keys(this.headers)
    let exists = false

    for (let i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === lk) {
        if (overwrite !== true) { // since a existing key is found, just exit
          return this
        }
        exists = true
        k = keys[i]
        break
      }
    }

    if (exists === false && typ_v === "undefined") {
      return this
    }

    this.headers[k] = v
    return this
  }

  type(content_type, _overwrite) {
    let t = mime.lookup(content_type)
    if (!t) t = content_type

    let charset = ""
    if (mime.charsets.lookup(t)) charset = "; charset=utf-8"

    return this.set("Content-Type", t + charset, _overwrite)
  }

  location(url, _overwrite) {
    return this.set("Location", url, _overwrite)
  }

  len(size, _overwrite) {
    const typ_size = typeof size
    if (typ_size !== "undefined" && typ_size !== "number") {
      throw new TypeError("Expected number for Response len() instead got: " + size)
    }
    if (size === 0) size = undefined
    return this.set("Content-Length", size, _overwrite)
  }

  attachment(filename, _overwrite) {
    let v
    if (typeof filename === "string") {
      v = "attachment"
      if (filename !== "") v = v + "; filename=" + filename
    }
    this.set("Content-Disposition", v, _overwrite)
  }

}

module.exports = {
  Response,
  is_Response
}
