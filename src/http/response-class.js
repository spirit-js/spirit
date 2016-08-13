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

  _clear_cookies(cookies, name, path) {
    path = path || "/"
    return cookies.filter((ck) => {
      // get cookie name
      const _name = ck.slice(0, ck.indexOf("="))
      let _path = "/"

      if (_name === name) {
        // if name matches, check path
        const ck_lower = ck.toLowerCase()
        const _begin = ck_lower.indexOf("path=")

        if (_begin !== -1) {
          ck = ck.slice(_begin + 5)
          const _end = ck.indexOf(";")

          if (_end === -1) {
            _path = ck
          } else {
            _path = ck.slice(0, _end)
          }
        }

        return _path !== path
      }

      return true
    })
  }

 /**
  * Sets a cookie to headers, if the header already exists
  * It will append to the array (and be converted to one, if
  * it isn't already one)
  *
  * No encoding is done, if needed, encode the value before
  * calling this method
  *
  * If value is undefined, then the cookie will not be set
  * And if it already exists, then all instances of it
  * will be removed
  *
  * Possible duplicate cookies of the same name & path
  * are not handled
  * NOTE: cookies are considered unique to it's name & path
  *
  * Options: {
  *   path {string}
  *   domain {string}
  *   httponly {boolean}
  *   maxage {string}
  *   secure {boolean}
  *   expires {Date}
  * }
  *
  * @param {string} name - cookie name
  * @param {string} value - cookie value
  * @param {object} opts - an object of options
  * @return {this}
  */
  cookie(name, value, opts) {
    // get current cookies (as an array)
    let curr_cookies = this.get("Set-Cookie")
    if (curr_cookies === undefined) {
      curr_cookies = []
    } else {
      if (Array.isArray(curr_cookies) === false) {
        curr_cookies = [curr_cookies]
      }
    }

    // optional arguments & default values
    if (typeof value === "object") {
      opts = value
      value = undefined
    } else if (opts === undefined) {
      opts = {}
    }

    // is this for deletion?
    if (value === undefined) {
      const _filtered_cookies = this._clear_cookies(curr_cookies, name, opts.path)
      return this.set("Set-Cookie", _filtered_cookies)
    }

    // begin constructing cookie string
    value = [value]
    // * set optional values *
    if (opts.path) value.push("Path=" + opts.path)
    if (opts.domain) value.push("Domain=" + opts.domain)
    if (opts.maxage) value.push("Max-Age=" + opts.maxage)
    if (opts.secure === true) value.push("Secure")
    if (opts.expires) {
      if (typeof opts.expires.toUTCString === "function") {
        value.push("Expires=" + opts.expires.toUTCString())
      } else {
        value.push("Expires=" + opts.expires)
      }
    }
    if (opts.httponly === true) value.push("HttpOnly")

    curr_cookies.push(name + "=" + value.join("; "))
    return this.set("Set-Cookie", curr_cookies)
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
