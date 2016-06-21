const adapter = require("../../lib/http/node_adapter")
const mock_response = require("../support/mock-response")

const stream = require("stream")

describe("node adapter", () => {

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

    it("supports http2 api")
  })

})
