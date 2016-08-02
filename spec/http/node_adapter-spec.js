const adp = require("../../index").node.adapter
const send = require("../../lib/http/node_adapter").send
const mock_response = require("../support/mock-response")

const stream = require("stream")

describe("node adapter", () => {

  describe("adapter", () => {
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

    it("middleware argument is optional", (done) => {
      const handler = (request) => {
        return "ok"
      }
      const res = mock_response(done)
      const app = adp(handler)
      app({}, res)
    })
  })

  describe("send", () => {
    it("writes a response map (string)", (done) => {
      const res = mock_response((result) => {
        expect(result.status).toBe(123)
        expect(result.body).toBe("hi")
        expect(result.headers).toEqual({
          A: 1
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
          A: 2
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
          A: 1
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

    it("response headers are capitalized properly", (done) => {
      const res = mock_response((result) => {
        expect(result.headers).toEqual({
          "Content-Length": 10,
          "Content-Type": "abc",
          "Aa": 123
        })
        done()
      })

      send(res, {
        status: 123,
        headers: {
          "coNtent-LEngTh": 10,
          "ConTENT-tYpe": "abc",
          "aa": 123
        }
      })
    })

    it("duplicate response headers are overwritten with the last instance", (done) => {
      const res = mock_response((result) => {
        expect(result.headers).toEqual({
          "Content-Length": 3,
          "A": 2
        })
        done()
      })

      send(res, {
        status: 123,
        headers: {
          // the following are unique properties in JS
          // but they are the same header field
          "Content-length": 1,
          "Content-LEngth": 2,
          "Content-LeNgth": 3,
          "A": 1,
          "a": 2
        }
      })
    })

    it("supports http2 api")
  })

})
