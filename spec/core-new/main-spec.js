const core = require("../../lib/core/core")
describe("core", () => {
  describe("main", () => {

  })

  describe("middleware_run", () => {
    const reduce = core.middleware_run

    it("works", (done) => {
      const handler = (request) => {
        expect(request.called).toBe(".cba")
        return new Promise((resolve, reject) => {
          resolve({ resp: "." })
        })
      }

      const middleware = [
        (handler) => {
          return (request) => {
            request.called += "a"
            const response = handler(request)
            response.resp += "1"
            return response
          }
        },
        (handler) => {
          return (request) => {
            request.called += "b"
            const response = handler(request)
            response.resp += "2"
            return response
          }
        },
        (handler) => {
          return (request) => {
            request.called += "c"
            const response = handler(request)
            response.resp += "3"
            return response
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

  describe("handler_run", () => {

  })

  describe("reducep", () => {
    
  })
})
