const core = require("../../../lib/core/core")

describe("reduce_mw", () => {
  const reduce = core.reduce_mw

  it("order", (done) => {
    const handler = (request) => {
      expect(request.called).toBe(".cba")
      return Promise.resolve({ resp: "." })
    }

    const middleware = [
      (handler) => {
        return (request) => {
          request.called += "a"
          return handler(request).then((response) => {
            response.resp += "1"
            return response
          })
        }
      },
      (handler) => {
        return (request) => {
          request.called += "b"
          return handler(request).then((response) => {
            response.resp += "2"
            return response
          })
        }
      },
      (handler) => {
        return (request) => {
          request.called += "c"
          return handler(request).then((response) => {
            response.resp += "3"
            return response
          })
        }
      }
    ]

    const mock_req = { called: "." }

    const route = reduce(handler, middleware)
    const resp = route(mock_req)
    resp.then((response) => {
      expect(response).toEqual({
        resp: ".123"
      })
      done()
    })
  })
})

