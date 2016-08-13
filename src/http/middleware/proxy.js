/*
 * Middleware for handling Forwarded and X-Forwarded-For
 * headers, currently it sets the request.ip to be the value
 * set by the above headers, Forwarded has priority if both exist
 *
 */

const forwarded = (request) => {
  const f = request.headers["forwarded"]
  if (f) {
    return f.split(";").reduce((o, kv) => {
      const t = kv.split("=")
      if (!o[t[0]]) { // if key doesn't already exist
        o[t[0]] = t[1].split(",")[0]
      }
      return o
    }, {})
  }
}

const x_forwarded = (request) => {
  const f = request.headers["x-forwarded-for"]
  if (f) {
    const v = f.split(",")
    const r = {
      for: v[0]
      //by: v[1],
      //proto: "http"
    }
    //const proto = request.headers["x-forwarded-proto"]
    //if (proto) r.proto = proto
    return r
  }
}

module.exports = (handler) => {
  return (request) => {
    let v = forwarded(request)
    if (v === undefined) {
      v = x_forwarded(request)
    }

    if (v !== undefined) request.ip = v.for
    return handler(request)
  }
}
