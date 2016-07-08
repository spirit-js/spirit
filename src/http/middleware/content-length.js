const fs = require("fs")
const Promise = require("bluebird")

module.exports = (handler) => {
  return (request) => {
    return handler(request).then((resp) => {
      // if there's already a content length, skip
      if (resp.headers["Content-Length"]) {
        return resp
      }

      // if the body is 0
      if (resp.body === undefined || resp.body === "") {
        resp.headers["Content-Length"] = 0
        return resp
      }

      // if it's a string, convert to a Buffer
      if (typeof resp.body === "string") {
        resp.body = new Buffer(resp.body)
      }

      // if it's a Buffer
      if (resp.body instanceof Buffer) {
        resp.headers["Content-Length"] = resp.body.length
        return resp
      }

      // if it's a file stream, use fs.stat and return a Promise
      if (resp.body && typeof resp.body.pipe === "function" && typeof resp.body.path === "string") {
        return new Promise((resolve, reject) => {
          fs.stat(resp.body.path, (err, file) => {
            if (!err) {
              resp.headers["Content-Length"] = file.size
            }
            resolve(resp)
          })
        })
      }

      // everything else, skip
      return resp
    })
  }
}
