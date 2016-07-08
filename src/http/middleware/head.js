module.exports = (handler) => {
  return (request) => {
    if (request.method === "head") request.method = "get"
    return handler(request).then((resp) => {
      request.method = "head"
      resp.body = undefined
      return resp
    })
  }
}
