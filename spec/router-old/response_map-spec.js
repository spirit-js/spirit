const response_map = require("../../lib/router/response-map")

describe("response map", () => {

  describe("create", () => {
    it("returns a response map from value", () => {
      const r = response_map.create("hey")
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: "hey"
      }))
      expect(r instanceof response_map.ResponseMap).toBe(true)
    })

    it("returns a response map from {}response map", () => {
      const r = response_map.create({
        status: 123,
        headers: { a: 1 }
      })
      expect(r).toEqual(jasmine.objectContaining({
        status: 123,
        headers: { a: 1 },
        body: ""
      }))
      expect(r instanceof response_map.ResponseMap).toBe(true)
    })

    // response.response already checks if it's a ResponseMap
    // but if for some reason it's called with one
    // it just creates a new similar one
    it("returns response map if already response map", () => {
      const t = new response_map.ResponseMap("hi")
      const r = response_map.create(t)
      expect(r instanceof response_map.ResponseMap).toBe(true)
      expect(r).not.toBe(t)
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: "hi"
      }))
    })
  })

  describe("is_response_map", () => {
    it("returns true if response map", () => {
      const t = new response_map.ResponseMap()
      const r = response_map.is_response_map(t)
      expect(r).toBe(true)
    })

    it("returns false for {}response map", () => {
      const t = { status: 200, headers: {}, body: "" }
      const r = response_map.is_response_map(t)
      expect(r).toBe(false)
    })
  })

  describe("redirect", () => {
    it("generates a response map for redirecting", () => {
      let rmap = response_map.redirect(123, "google")
      expect(rmap).toEqual(jasmine.objectContaining({
        status: 123,
        body: "",
        headers: { "Location": "google" }
      }))
      expect(rmap instanceof response_map.ResponseMap).toBe(true)

      // defaults status to 302
      rmap = response_map.redirect("blah")
      expect(rmap).toEqual(jasmine.objectContaining({
        status: 302,
        body: "",
        headers: { "Location": "blah" }
      }))
      expect(rmap instanceof response_map.ResponseMap).toBe(true)
    })

    it("throws an error for invalid arguments", () => {
      const test = (status, url) => {
        expect(() => {
          response_map.redirect(status, url)
        }).toThrowError(/invalid arguments/)
      }

      test(123)
      test("blah", 123)
      test("hi", "blah")
    })
  })

  describe("ResponseMap", () => {
    const ResponseMap = response_map.ResponseMap

    it("initializes with a default response map", () => {
      const r = new ResponseMap()
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {},
        body: ""
      }))
    })

    describe("statusCode", () => {
      it("sets the status code", () => {
        const r = new ResponseMap().statusCode(78)
        expect(r.status).toBe(78)
      })

      it("converts non-number arguments to number", () => {
        const r = new ResponseMap().statusCode("123")
        expect(r.status).toBe(123)
      })
    })

    describe("type", () => {
      it("sets the content type from known types", () => {
        const r = new ResponseMap().type("json")
        expect(r.headers["Content-Type"]).toBe("application/json")
      })

      it("nothing happens if content type is unknown", () => {
        const r = new ResponseMap().type("json123")
        expect(r.headers["Content-Type"]).toBe(undefined)
      })

      it("sets utf-8 charset by default for text/* content types", () => {
        const r = new ResponseMap().type("text")
        expect(r.headers["Content-Type"]).toBe("text/plain; charset=utf-8")
      })
    })

    describe("_type", () => {
      it("sets the content type from known types", () => {
        const r = new ResponseMap()._type("json")
        expect(r.headers["Content-Type"]).toBe("application/json")
      })

      it("nothing happens if the type is unknown", () => {
        const r = new ResponseMap()._type("json123")
        expect(r.headers["Content-Type"]).toBe(undefined)
      })

      it("will do nothing if content type already exists", () => {
        const r = new ResponseMap().type("html")
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
