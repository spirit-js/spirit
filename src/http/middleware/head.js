module.exports = (handler) => {
  return (request) => {
    if (request.method === "HEAD") {
      request.method = "GET"
      return handler(request).then((resp) => {
        request.method = "HEAD"
        resp.body = undefined // strip body
        return resp
      })
    }

    return handler(request)
  }
}
