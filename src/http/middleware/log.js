/*
 * A simple logger for reporting the time in milliseconds
 * the amount of time elapsed in responding to a request
 */

module.exports = (handler) => {
  if (typeof process !== "undefined" && typeof process.env !== "undefined" && process.env.NODE_ENV === "production") {
    return (request) => {
      return handler(request)
    }
  }

  return (request) => {
    const t = new Date()
    return handler(request).then((response) => {
      const diff = new Date - t
      console.log(request.method, request.url, diff + "ms")
      return response
    })
  }
}
