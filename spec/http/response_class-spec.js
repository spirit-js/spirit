const {Response, is_Response}= require("../../index").node

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

    describe("status_ , code", () => {
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

    describe("body_", () => {
      it("sets the body of the response, but also adjusts the content length", () => {
        const r = new Response("hello")
        expect(r.headers["Content-Length"]).toBe(undefined)

        const result = r.body_("hello world")
        expect(r.headers["Content-Length"]).toBe(11)
        expect(r.body).toBe("hello world")

        expect(result).toBe(r)
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

      it("if overwrite is false, will not overwrite a key", () => {
        const r = new Response()
        r.set("Content-Length", 123)
        r.set("Content-Length", 0, false)
        expect(r.headers).toEqual({
          "Content-Length": 123
        })
      })

      it("avoids writing a header if it doesn't exist and the value to be set is undefined", () => {
        const r = new Response()
        r.set("Content-Length", undefined)
        expect(r.headers).toEqual({})
      })
    })

    describe("type", () => {
      it("sets the content type from known types and returns this", () => {
        const r = new Response()
        const result = r.type("json")
        expect(r.headers["Content-Type"]).toBe("application/json")
        expect(result).toBe(r)
      })

      it("if content type is unknown sets the content type to be argument passed in", () => {
        const r = new Response().type("json123")
        expect(r.headers["Content-Type"]).toBe("json123")
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
      it("sets 'Location' header to url passed in", () => {
        const r = new Response()
        r.location("hi.cOm")
        expect(r.headers).toEqual({
          "Location": "hi.cOm"
        })
      })
    })

    describe("len", () => {
      it("sets the 'Content-Length'", () => {
        const r = new Response()
        r.len(154)
        expect(r.headers).toEqual({
          "Content-Length": 154
        })
      })

      it("size of 0 is considered undefined", () => {
        const r = new Response()
        r.len(0)
        expect(r.headers).toEqual({})

        r.len(123)
        expect(r.headers).toEqual({
          "Content-Length": 123
        })

        r.len(0)
        expect(r.headers).toEqual({
          "Content-Length": undefined
        })

        r.len(123).len()
        expect(r.headers).toEqual({
          "Content-Length": undefined
        })
      })

      it("will throw for non-number", () => {
        const r = new Response()
        expect(() => {
          r.len(null)
        }).toThrowError(/Expected number/)
      })
    })

    describe("attachment", () => {
      it("sets 'Content-Disposition'", () => {
        const r = new Response()
        r.attachment("")
        expect(r.headers).toEqual({
          "Content-Disposition": "attachment"
        })

        r.attachment("blah.txt")
        expect(r.headers).toEqual({
          "Content-Disposition": "attachment; filename=blah.txt"
        })

        r.attachment()
        expect(r.headers).toEqual({
          "Content-Disposition": undefined
        })
      })
    })

    describe("cookie", () => {
      it("")
    })

    describe("charset", () => {
      it("")
    })
  })

})
