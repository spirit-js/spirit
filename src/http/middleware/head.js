/*
 * Strips the response body from HEAD requests
 *
 */

module.exports = (handler) => {
  return (request) => {
    if (request.method === "HEAD") {
      return handler(request).then((resp) => {
        //resp.body = undefined // strip body
        return resp
      })
    }

    return handler(request)
  }
}
