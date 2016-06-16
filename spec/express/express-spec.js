const compat = require("../../lib/express/compat")

describe("express compat", () => {

  describe("adapter", () => {
    it("wraps express middleware as Promise", (done) => {
      const express_mw = (req, res, next) => {
        req.a = 123
        next()
      }

      const wrapped_fn = compat.adapter(express_mw)
      expect(wrapped_fn.length).toBe(2)

      const mock_req = { a: 1 }
      wrapped_fn(mock_req, {})
        .then((result) => {
          expect(mock_req.a).toBe(123)
          expect(result).toBe(undefined)
          done()
        })
    })

    it("handles express middleware errors as rejected Promise", (done) => {
      const express_mw = (req, res, next) => {
        next("an error")
      }
      const wrapped_fn = compat.adapter(express_mw)

      wrapped_fn({}, {})
        .then((result) => {
          throw "should never get here"
        })
        .catch((err) => {
          expect(err).toBe("an error")
          done()
        })
    })
  })

  describe("res", () => {
    it("sets `req` on to `res.req`", () => {
      const req = { a: 1 }
      const res = {}

      compat.res(req, res)

      expect(res.req.a).toBe(1)
      expect(res.req).toBe(req)
    })

    const express_res = require("../../lib/express/res")
    it("attaches all exported functions of src/express/res to `res`", () => {
      const res = {}
      compat.res({}, res)
      expect(typeof res.redirect).toBe("function")
      Object.keys(express_res).forEach((key) => {
        expect(typeof express_res[key]).toBe("function")
      })
    })
  })
})
