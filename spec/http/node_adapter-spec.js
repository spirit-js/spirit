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

      const middleware = (handler) => (request) => {
          return handler(request)
      }

      const app = adp(handler, [middleware, middleware])
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
        expect(result.headers["Content-Length"] > 20).toBe(true)
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
        expect(result.headers).toEqual({ "Content-Length": 0 })
        expect(result.body).toBe(undefined)
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

    it("middleware argument accepts a function", (done) => {
      const handler = (request) => {
        expect(request.a).toBe(1)
        return "ok"
      }
      const mw = (handler) => (request) => handler({a:1})
      const app = adp(handler, mw)

      const res = mock_response(done)
      app({}, res)
    })

    it("middleware are initialized once only", (done) => {
      let init = 0
      let called = 0

      const handler = (request) => {
        return { status: 200, headers: {}, body: "ok" }
      }
      const middleware = (handler) => {
        init += 1
        return (request) => {
          called += 1
          return handler(request)
        }
      }
      const app = adp(handler, [middleware, middleware])

      const fake_request = (test_val, cb) => {
        app({}, mock_response(() => {
          expect(init).toBe(2)
          expect(called).toBe(test_val)
          cb()
        }))
      }

      const a = fake_request.bind(undefined, 8, done)
      const b = fake_request.bind(undefined, 6, a)
      const c = fake_request.bind(undefined, 4, b)
      fake_request(2, c)
    })
  })

  describe("send", () => {
    it("writes a response map (string)", (done) => {
      const res = mock_response((result) => {
        expect(result.status).toBe(123)
        expect(result.body).toBe("hi")
        expect(result.headers).toEqual({
          a: 1,
          "Content-Length": 2
        })
        done()
      })

      send(res, {
        status: 123,
        headers: {"a": 1},
        body: "hi"
      })
    })

    it("sets Content-Length header if prop exists but undefined", (done) => {
      const res = mock_response((result) => {
        expect(Object.keys(result.headers).length).toBe(1)
        expect(result.headers["Content-Length"]).toBe(2)
        done()
      })
      send(res, { status: 200, headers: { "Content-Length": undefined }, body: "ok" })
    })

    it("no Content-Length when body is equivalent to empty", (done) => {
      const res = mock_response((result) => {
        expect(Object.keys(result.headers).length).toBe(1)
        expect(result.headers["Content-Length"]).toBe(0)

        const res2 = mock_response((result) => {
          expect(Object.keys(result.headers).length).toBe(1)
          expect(result.headers["Content-Length"]).toBe(0)
          done()
        })
        send(res2, { status: 200, headers: {}, body: undefined })
      })
      send(res, { status: 200, headers: {}, body: "" })
    })

    it("does not set Content-Length header if already set", (done) => {
      const res = mock_response((result) => {
        expect(Object.keys(result.headers).length).toBe(1)
        expect(result.headers["Content-lEnGth"]).toBe("abc")
        done()
      })
      send(res, { status: 200, headers: { "Content-lEnGth": "abc" }, body: "ok" })
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
          a: 1,
          "Content-Length": 0
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
          "Content-Length": 0,
          "Blah": 10
        })
        done()
      })

      send(res, {
        status: 123,
        headers: {
          "Blah": 10,
          "Content-Type": undefined
        }
      })
    })

    it("supports http2 api")
  })

})
