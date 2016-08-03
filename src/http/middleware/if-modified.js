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
      let match = false

      const if_etag = request.headers["if-none-match"]
      const etag = Response.get(response, "ETag")
      if (if_etag !== undefined && if_etag === etag) match = true

      if (match === false) {
        const if_mod = request.headers["if-modified-since"]
        const last_mod = Response.get(response, "Last-Modified")
        if (if_mod !== undefined && if_mod === last_mod) match = true
      }

      if (match === true) {
        response.status = 304
        response.body = undefined
      }

      return response
    })
  }
}
