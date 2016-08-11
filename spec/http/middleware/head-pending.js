const head = require("../../../index").node.middleware.head
const Promise = require("bluebird")

describe("Middleware: head", () => {

  it("modifies any HEAD request to be a GET, stripping response body, and changing back to GET when done", (done) => {
    const handler = (request) => {
      expect(request.method).toBe("GET")
      return Promise.resolve({
        status: 200,
        headers: { a: 123 },
        body: "Hi"
      })
    }
    const req = { method: "HEAD" }
    head(handler)(req).then((response) => {
      expect(req.method).toBe("HEAD")
      expect(response.status).toBe(200)
      expect(response.headers).toEqual({
        a: 123
      })
      expect(response.body).toBe(undefined)
      done()
    })
  })

  it("when stripping, it closes a stream body", () => {
    pending()
  })

  it("doesn't touch other requests", (done) => {
    const handler = (request) => {
      return {
        status: 200,
        headers: { a: 123 },
        body: "ok"
      }
    }

    let result = head(handler)({ method: "GET" })
    expect(result).toEqual({ status: 200, headers: { a: 123 }, body: "ok" })

    result = head(handler)({ method: "hEad" })
    expect(result).toEqual({ status: 200, headers: { a: 123 }, body: "ok" })

    result = head(handler)({ method: "POST" })
    expect(result).toEqual({ status: 200, headers: { a: 123 }, body: "ok" })

    done()
  })

})
