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
    // avoid doing this song and dance if there's nothing
    // to even do
    if (v === undefined) {
      return this
    }

    const lk = k.toLowerCase()
    const keys = Object.keys(this.headers)
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === lk) {
        if (overwrite !== true) { // since a existing key is found, just exit
          return this
        }
        k = keys[i]
        break
      }
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
    // there is no point in setting 0
    if (size === 0) return this
    return this.set("Content-Length", size, _overwrite)
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
