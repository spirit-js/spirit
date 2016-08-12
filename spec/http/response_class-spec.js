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

    it("returns false for invalid types", () => {
      const invalid = [null, undefined, "", 123, {}]
      invalid.forEach((notok) => {
        expect(is_Response(notok)).toBe(false)
      })
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
      it("will correct the field name on possible duplicate", () => {
        const r = new Response()

        r.set("content-length", 100)
        expect(r.headers["content-length"]).toBe(100)
        r.set("content-length", 10)
        expect(r.headers["content-length"]).toBe(10)

        r.set("conTent-length", 900)
        expect(r.headers["Content-Length"]).toBe(900)
      })

      it("replaces field names with proper one", () => {
        const r = new Response()
        r.headers["content-length"] = 1
        expect(r.headers["content-length"]).toBe(1)
        r.set("contenT-length", 100)
        expect(r.headers["Content-Length"]).toBe(100)
        expect(r.headers["content-length"]).toBe(undefined)
        expect(Object.keys(r.headers).length).toBe(1)
      })

      it("will overwrite an existing key (case-insensitive)", () => {
        const r = new Response()
        r.headers["Content-Length"] = 200
        r.set("content-length", 1)
        expect(r.headers["Content-Length"]).toBe(1)
        expect(r.headers["content-length"]).toBe(undefined)
      })

      it("avoids writing a header if it doesn't exist and the value to be set is undefined", () => {
        const r = new Response()
        r.set("Content-Length", undefined)
        expect(r.headers).toEqual({})
      })

      it("ETag has special handling to correct it's case", () => {
        const r = new Response()
        r.set("Etag", 123)
        expect(r.headers).toEqual({
          "Etag": 123
        })

        r.set("ETAG", 321)
        expect(r.headers).toEqual({
          "ETag": 321
        })
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
