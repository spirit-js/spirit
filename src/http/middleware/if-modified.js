/*
 * A middleware for handling requests with headers:
 * - If-Modified-Since
 * - If-None-Match
 *
 * If the response has a Last-Modified and matches, or
 * If the response has ETag header and matches,
 *
 * Then a 304 status is sent with the response body stripped
 *
 * NOTE: this does not generate the response headers, as
 * Last-Modified can vary depending on the resource. Also true
 * for etags, and the method of generating ETags can vary
 * depending on implementation.
 *
 * However matching is always the same.
 *
 */

const Response = require("../response-class").Response

module.exports = (handler) => {
  return (request) => {
    return handler(request).then((response) => {
      // typically if the response is not a 200 or 2xx response
      // then this should not 304 even if match
      if (response.status < 200
          || response.status > 299) {
        return response
      }

      let match = false

      const if_etag = request.headers["if-none-match"]
      const etag = Response.get(response, "ETag")
      if (if_etag !== undefined) {
        if (if_etag === etag) {
          match = true
        } else {
          // request etag provided, but mismatch
          // means ignore if-modified header, so return here
          return response
        }
      }

      if (match === false) {
        const if_mod = new Date(request.headers["if-modified-since"]).getTime()
        const mod = new Date(Response.get(response, "Last-Modified")).getTime()
        if (isNaN(if_mod) === false && mod === if_mod) match = true
      }

      if (match === true) {
        response.status = 304
        response.body = undefined
      }

      return response
    })
  }
}
