const {Response, is_Response}= require("../../lib/http/response-class")

describe("response-class", () => {
  describe("is_Response", () => {
    it("returns true if response map", () => {
      const t = new Response()
      const r = is_Response(t)
      expect(r).toBe(true)
    })

    it("returns false for {}response map", () => {
      const t = { status: 200, headers: {}, body: "" }
      const r = is_Response(t)
      expect(r).toBe(false)
    })
  })

  describe("Response", () => {
    it("initializes with a default response map", () => {
      let r = new Response()
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: undefined
      }))

      r = new Response(123)
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: 123
      }))
    })

    describe("statusCode", () => {
      it("sets the status code and returns this", () => {
        const r = new Response()
        const result = r.status_(78)
        expect(r.status).toBe(78)
        expect(result).toBe(r)
      })

      it("converts non-number arguments to number", () => {
        const r = new Response().status_("123")
        expect(r.status).toBe(123)
      })
    })

    describe("get", () => {
      it("returns value of the passed in key from headers", () => {
        const r = new Response()
        expect(r.get("BlAh")).toBe(undefined)
        r.headers["blah"] = 4
        expect(r.get("BlAh")).toBe(4)
      })
    })

    describe("set", () => {
      it("sets the value to key in headers", () => {
        const r = new Response()
        r.set("content-length", 100)
        expect(r.headers["content-length"]).toBe(100)
      })

      it("will overwrites an existing key (case-insensitive)", () => {
        const r = new Response()
        r.headers["Content-Length"] = 200
        r.set("content-length", 1)
        expect(r.headers["Content-Length"]).toBe(1)
      })
    })

    describe("type", () => {
      it("sets the content type from known types and returns this", () => {
        const r = new Response()
        const result = r.type("json")
        expect(r.headers["Content-Type"]).toBe("application/json")
        expect(result).toBe(r)
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

    it("will do nothing if content type already exists and overwrite is false", () => {
      const r = new Response().type("html")
      expect(r.headers["Content-Type"]).toBe("text/html; charset=utf-8")
      r.type("json", false)
      expect(r.headers["Content-Type"]).toBe("text/html; charset=utf-8")
    })

    describe("location", () => {
      it("")
    })

    describe("len", () => {
      it("")
    })
  })
})
