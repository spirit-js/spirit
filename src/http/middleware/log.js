/*
 * A simple logger for reporting the time in milliseconds
 * the amount of time elapsed in responding to a request
 *
 * It is meant purely for development
 */

//const prefix_in = "⇢ "
//const prefix_out = "↩︎ "
//const prefix_err = "⚠︎ "

const prefix_in = "->"
const prefix_out = "<-"

module.exports = (handler) => {
  if (typeof process !== "undefined"
      && typeof process.env !== "undefined"
      && process.env.NODE_ENV === "production") {
    return (request) => {
      return handler(request)
    }
  }

  const reqtag = (str) => {
    const tag = str.split("").reduce((h, c) => {
      let n = parseInt(c)
      if (isNaN(n)) n = c.charCodeAt()
      n += 1
      return h * n
    }, 0)
    const seed = Math.floor(Math.random() * 100000)
    return tag + seed
  }

  return (request) => {
    const t = new Date()

    const tag = reqtag(t.getTime() + request.method + request.url)

    console.log(prefix_in, tag, request.method, request.url)

    return handler(request)
      .then((response) => {
        const diff = new Date - t
        console.log(prefix_out, tag, response.status, diff + "ms")
        return response
      })
      .catch((err) => {
        const diff = new Date - t
        console.log(prefix_out, tag, "err", diff + "ms")
        throw err
      })
  }
}
