const response = require("../../lib/http/response")

describe("http.response", () => {

  describe("is_response", () => {
    it("returns true for valid response maps", () => {
      const valid = [
        { status: 123, headers: {} },
        { status: 123, headers: {}, body: "" },
        { status: 123, headers: {"Content-Type": "hi"} },
      ]

      valid.forEach((v) => {
        expect(response.is_response(v)).toBe(true)
      })
    })

    it("returns false for invalid response maps", () => {
      const invalid = [
        "", 123, {}, [], null,
        { status: "hi", headers: {} },
        { status: 123, body: 123 },
        { status: 123, headers: [] }
      ]

      invalid.forEach((v) => {
        expect(response.is_response(v)).toBe(false)
      })
    })
  })

  describe("not_found", () => {
    it("returns a response map with 404 status", () => {
      expect(response.not_found("hi")).toEqual(jasmine.objectContaining({
        status: 404,
        headers: {
          "Content-Length": 2
        },
        body: "hi"
      }))
    })
  })

  describe("internal_err", () => {
    it("returns a response map with status 500", () => {
      expect(response.internal_err("test 123")).toEqual(jasmine.objectContaining({
        status: 500,
        headers: {
          "Content-Length": 8
        },
        body: "test 123"
      }))
    })

    it("accepts a Error and will output the err.stack", () => {
      const err = new Error("err")
      expect(response.internal_err(err).body).toMatch(/response-spec/)
    })
  })

})
