const response = require("../../lib/http/response")
const Response = require("../../lib/http/response-class").Response

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

  describe("response", () => {
    it("returns a response map from value", () => {
      const r = response.response("hey")
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Length": 3
        },
        body: "hey"
      }))
      expect(r instanceof Response).toBe(true)
    })

    it("returns a response map from {}response map", () => {
      const r = response.response({
        status: 123,
        headers: { a: 1 }
      })
      expect(r).toEqual(jasmine.objectContaining({
        status: 123,
        headers: { a: 1 },
        body: undefined
      }))
      expect(r instanceof Response).toBe(true)
    })

    it("returns a new Response if already Response", () => {
      const t = new Response("hi")
      const r = response.response(t)
      expect(r instanceof Response).toBe(true)
      expect(r).not.toBe(t)
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: "hi"
      }))
    })
  })

  describe("redirect", () => {
    it("generates a response map for redirecting", () => {
      let rmap = response.redirect(123, "google")
      expect(rmap).toEqual(jasmine.objectContaining({
        status: 123,
        body: undefined,
        headers: { "Location": "google" }
      }))
      expect(rmap instanceof Response).toBe(true)

      // defaults status to 302
      rmap = response.redirect("blah")
      expect(rmap).toEqual(jasmine.objectContaining({
        status: 302,
        body: undefined,
        headers: { "Location": "blah" }
      }))
      expect(rmap instanceof Response).toBe(true)
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

  describe("err_response", () => {
    it("returns a response map with status 500", () => {
      expect(response.err_response("test 123")).toEqual(jasmine.objectContaining({
        status: 500,
        headers: {
          "Content-Length": 8
        },
        body: "test 123"
      }))
    })

    it("accepts a Error and will output the err.stack", () => {
      const err = new Error("err")
      expect(response.err_response(err).body).toMatch(/response-spec/)
    })
  })

})
