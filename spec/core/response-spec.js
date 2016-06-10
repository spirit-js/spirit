const response = require("../../lib/core/response")
const res = require("../support/mock-response")

describe("core.response", () => {

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
        "", 123, {}, [],
        { status: "hi", headers: {} },
        { status: 123, body: 123 },
        { status: 123, headers: [] }
      ]

      invalid.forEach((v) => {
        expect(response.is_response(v)).toBe(false)
      })
    })
  })

  describe("redirect", () => {
    it("generates a response map for redirecting", () => {
      let rmap = response.redirect(123, "google")
      expect(rmap).toEqual({
        status: 123,
        body: "",
        headers: { "Location": "google" }
      })

      // defaults status to 302
      rmap = response.redirect("blah")
      expect(rmap).toEqual({
        status: 302,
        body: "",
        headers: { "Location": "blah" }
      })
    })

    it("throws an error for invalid arguments", () => {
      const test = (status, url) => {
        expect(() => {
          response.redirect(status, url)
        }).toThrowError(/invalid arguments/)
      }

       test(123)
       test("blah", 123)
       test("hi", "blah")
    })
  })

  describe("content_type", () => {
    it("sets a response map to content type", () => {
      // doesn't check if valid response map
      const t = { headers: {} }
      let result = response.content_type(t, "123")
      expect(result).toEqual({ headers: {
        "Content-Type": "123"
      }})

      // overrides
      result = response.content_type(result, "abc")
      expect(result).toEqual({ headers: {
        "Content-Type": "abc"
      }})
    })

    it("throws if `type` argument is not a string", () => {
      const t = { headers: {} }
      expect(() => {
        response.content_type(t, 123)
      }).toThrowError(/must be a string/)
    })
  })

  describe("not_found", () => {
    it("returns a response map with 404 status", () => {
      expect(response.not_found("hi")).toEqual({
        status: 404,
        headers: {},
        body: "hi"
      })
    })
  })

  describe("internal_err", () => {
    it("returns a response map with status 500", () => {
      expect(response.internal_err("test 123")).toEqual({
        status: 500,
        headers: {},
        body: "test 123"
      })
    })
  })

  describe("response", () => {
    it("returns a response map with status 200", () => {
      expect(response.response("123 abc")).toEqual({
        status: 200,
        headers: {},
        body: "123 abc"
      })
    })
  })
})
