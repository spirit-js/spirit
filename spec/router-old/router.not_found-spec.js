const router = require("../../lib/router/router")
const mock_response = require("../support/mock-response")
const CallError = require("../support/custom-errors")

describe("not_found", () => {

  it("returns 404 with string", (done) => {
    const nf = router.not_found("hi")

    const res = mock_response((result) => {
      expect(result.status).toBe(404)
      expect(result.body).toBe("hi")
      done()
    })

    nf({}, res, () => {
      throw new CallError
    })
  })

  it("returns 404 with Promise & non-string value", (done) => {
    const nf = router.not_found(new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(123)
      }, 1)
    }))

    const res = mock_response((result) => {
      expect(result.status).toBe(404)
      expect(result.body).toBe("123")
      done()
    })

    nf({}, res, () => {
      throw new CallError
    })
  })

  it("returns 404 with function body", (done) => {
    const nf = router.not_found((req) => {
      expect(req.req).toBe(true)
      return Promise.resolve(123)
    })

    const res = mock_response((result) => {
      expect(result.status).toBe(404)
      expect(result.body).toBe("123")
      done()
    })

    nf({req: true}, res, () => {
      throw new CallError
    })
  })

  it("returns 404 with {}response map", (done) => {
    const nf = router.not_found((req) => {
      expect(req.req).toBe(true)
      return { status: 200, headers: {"a": 123 }, body: "hi" }
    })

    const res = mock_response((result) => {
      expect(result.status).toBe(404)
      expect(result.headers.a).toBe(123)
      expect(result.body).toBe("hi")
      done()
    })

    nf({req: true}, res, () => {
      throw new CallError
    })
  })

  const response_map = require("../../lib/router/response-map")
  it("returns 404 with response map", (done) => {
    const nf = router.not_found((req) => {
      return response_map.create("!hi").statusCode(200)
    })

    const res = mock_response((result) => {
      expect(result.status).toBe(404)
      expect(result.body).toBe("!hi")
      done()
    })

    nf({req: true}, res, () => {
      throw new CallError
    })
  })

})
