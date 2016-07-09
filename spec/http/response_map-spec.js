const response_map = require("../../lib/http/response-map")
const Response = response_map.Response

describe("response map", () => {
  describe("is_ResponseMap", () => {
    it("returns true if response map", () => {
      const t = new response_map.Response()
      const r = response_map.is_Response(t)
      expect(r).toBe(true)
    })

    it("returns false for {}response map", () => {
      const t = { status: 200, headers: {}, body: "" }
      const r = response_map.is_Response(t)
      expect(r).toBe(false)
    })
  })
  describe("ResponseMap", () => {
    const ResponseMap = response_map.Response

    it("initializes with a default response map", () => {
      const r = new Response()
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: ""
      }))
    })

    describe("statusCode", () => {
      it("sets the status code", () => {
        const r = new Response().statusCode(78)
        expect(r.status).toBe(78)
      })

      it("converts non-number arguments to number", () => {
        const r = new Response().statusCode("123")
        expect(r.status).toBe(123)
      })
    })

    describe("type", () => {
      it("sets the content type from known types", () => {
        const r = new Response().type("json")
        expect(r.headers["Content-Type"]).toBe("application/json")
      })

      it("nothing happens if content type is unknown", () => {
        const r = new Response().type("json123")
        expect(r.headers["Content-Type"]).toBe(undefined)
      })

      it("sets utf-8 charset by default for text/* content types", () => {
        const r = new Response().type("text")
        expect(r.headers["Content-Type"]).toBe("text/plain; charset=utf-8")
      })
    })

    describe("_type", () => {
      it("sets the content type from known types", () => {
        const r = new Response()._type("json")
        expect(r.headers["Content-Type"]).toBe("application/json")
      })

      it("nothing happens if the type is unknown", () => {
        const r = new Response()._type("json123")
        expect(r.headers["Content-Type"]).toBe(undefined)
      })

      it("will do nothing if content type already exists", () => {
        const r = new Response().type("html")
        expect(r.headers["Content-Type"]).toBe("text/html; charset=utf-8")
        r._type("json")
        expect(r.headers["Content-Type"]).toBe("text/html; charset=utf-8")
      })
    })

    describe("location", () => {
      it("")
    })

  })
})
