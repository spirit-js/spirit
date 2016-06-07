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

  describe("json", () => {
    it("")
  })

  describe("content_type", () => {
    it("")
  })

  describe("not_found", () => {
    it("")
  })

  describe("internal_err", () => {
    it("")
  })

  describe("response", () => {
    it("")
  })
})
