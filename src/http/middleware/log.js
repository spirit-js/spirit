/*
 * A simple logger for reporting the time in milliseconds
 * the amount of time elapsed in responding to a request
 *
 * It is meant purely for development
 */

//const arrow_in = "\u001b[33m=\u001b[93m>\u001b[39m"
//const arrow_out = "\u001b[92m<\u001b[32m=\u001b[39m"

const prefix_in = "⇢ "
const prefix_out = "↩︎ "
const prefix_err = "⚠︎ "

module.exports = (handler) => {
  if (typeof process !== "undefined"
      && typeof process.env !== "undefined"
      && process.env.NODE_ENV === "production") {
    return (request) => {
      return handler(request)
    }
  }

  return (request) => {
    const t = new Date()
    console.log(prefix_in, request.method, request.url)

    return handler(request)
      .then((response) => {
        const diff = new Date - t
        console.log(prefix_out, request.method, request.url, response.status, diff + "ms")
        return response
      })
      .catch((err) => {
        const diff = new Date - t
        console.log(prefix_err, request.method, request.url, "ERR", diff + "ms")
        throw err
      })
  }
}
