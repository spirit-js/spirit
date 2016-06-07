/*
 * Helper for setting up a mock http Response object
 */

const stream = require("stream")

module.exports = (done) => {
  const result = {
    status: undefined, headers: undefined, body: undefined
  }

  const ws = new stream.Writable({
    write(chunk, encoding, next) {
      const c = chunk.toString()
      if (typeof result.body === "undefined") {
        result.body = ""
      }
      result.body = result.body + c
      next()
    }
  })

  ws.writeHead = (status, headers) => {
    result.status = status
    result.headers = headers
  }

  ws.on("finish", () => {
    ws._result = result
    if (done) done(result)
  })

  return ws
}

