const adapter = require("../../lib/http/node_adapter")
const mock_response = require("../support/mock-response")

const stream = require("stream")

describe("node adapter", () => {

  describe("adapter", () => {
    const adp = adapter.adapter

    it("returns a (req, res) fn that wraps core.compose", (done) => {
      const handler = (request) => {
        return { status: 200, headers: {}, body: "ok" }
      }

      const middleware = [
        (handler) => {
          return (request) => {
            return handler(request)
          }
        },
        (handler) => {
          return (request) => {
            return handler(request)
          }
        }
      ]
      const app = adp(handler, middleware)
      const res = mock_response((result) => {
        expect(result.body).toBe("ok")
        done()
      })
      app({}, res)
    })

    it("abstracts node's `req` by creating a request map", (done) => {
      const handler = (request) => {
        expect(request).toEqual(jasmine.objectContaining({
          method: "GET",
          url: "/hi",
          headers: { a: 1 }
        }))
        expect(typeof request.req).toBe("function")
        return "ok"
      }

      const app = adp(handler, [])
      const res = mock_response(done)
      app({
        method: "GET",
        url: "/hi",
        headers: { a: 1 }
      }, res)
    })

    it("throws an err when a response map is not returned from handler + middleware, as it relies on a response map to write back to node's `res`", (done) => {
      const handler = (request) => {
        return "ok"
      }

      const app = adp(handler, [])
      const res = mock_response((result) => {
        expect(result.status).toBe(500)
        expect(result.body).toMatch(/node.js adapter did not/)
        done()
      })
      app({}, res)
    })

    it("errors are surpressed when in NODE_ENV 'production'", (done) => {
      const handler = (request) => {
        return "ok"
      }
      const app = adp(handler, [])
      const res = mock_response((result) => {
        expect(result.status).toBe(500)
        expect(result.body).toBe("")
        done()
      })
      process.env.NODE_ENV = "production"
      app({}, res)
    })
  })

  describe("send", () => {
    const send = adapter.send

    it("writes a response map (string)", (done) => {
      const res = mock_response((result) => {
        expect(result.status).toBe(123)
        expect(result.body).toBe("hi")
        expect(result.headers).toEqual({
          a: 1
        })
        done()
      })

      send(res, {
        status: 123,
        headers: {"a": 1},
        body: "hi"
      })
    })

    it("writes a response map with piping (stream)", (done) => {
      const res = mock_response((result) => {
        expect(result.status).toBe(100)
        expect(result.headers).toEqual({
          a: 2
        })
        expect(result.body).toBe("hi from streamhi from stream")
        done()
      })

      const rs = new stream.Readable({
        read(n) {
          this.push("hi from stream")
          this.push("hi from stream")
          this.push(null)
        }
      })

      send(res, {
        status: 100,
        headers: {"a": 2},
        body: rs
      })
    })

    it("buffer ok", (done) => {
      const res = mock_response((result) => {
        expect(result.status).toBe(1)
        expect(result.body).toBe("hi from buffer")
        done()
      })

      const buf = new Buffer("hi from buffer")
      send(res, {
        status: 1, headers: {}, body: buf
      })
    })

    it("undefined body ok", (done) => {
      const res = mock_response((result) => {
        expect(result.status).toBe(1)
        expect(result.headers).toEqual({
          a: 1
        })
        expect(result.body).toBe(undefined)
        done()
      })

      send(res, {
        status: 1, headers: {a: 1}, body: undefined
      })
    })

    it("strips headers with undefined values before writing", (done) => {
      const res = mock_response((result) => {
        expect(result.headers).toEqual({
          "Content-Length": 10
        })
        done()
      })

      send(res, {
        status: 123,
        headers: {
          "Content-Length": 10,
          "Content-Type": undefined
        }
      })
    })

    it("supports http2 api")
  })

})
