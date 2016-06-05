const router = require("../../lib/router/router")
const mock_response = require("../support/mock-response")
const CallError = require("../support/custom-errors")

describe("not_found", () => {

  beforeEach(() => {
    mock_response._reset()
  })

  it("returns 404 with string", (done) => {
    const nf = router.not_found("hi")

    mock_response._done = () => {
      expect(mock_response._map.status).toBe(404)
      expect(mock_response._map.body).toBe("hi")
      done()
    }

    nf({}, mock_response, () => {
      throw new CallError
    })
  })

  it("returns 404 with Promise", (done) => {
    const nf = router.not_found(new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(123)
      }, 1)
    }))

    mock_response._done = () => {
      expect(mock_response._map.status).toBe(404)
      expect(mock_response._map.body).toBe("123")
      done()
    }

    nf({}, mock_response, () => {
      throw new CallError
    })
  })

  it("returns 404 with function body", (done) => {
    const nf = router.not_found((req) => {
      expect(req.req).toBe(true)
      return Promise.resolve(123)
    })

    mock_response._done = () => {
      expect(mock_response._map.status).toBe(404)
      expect(mock_response._map.body).toBe("123")
      done()
    }

    nf({req: true}, mock_response, () => {
      throw new CallError
    })
  })

})
