const spirit = require("../../index")
const Response = spirit.node.Response
const is_Response = spirit.node.utils.is_Response

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
      it("sets the body of the response, but also adjusts the content length when it is a string or buffer", () => {
        const r = new Response("hello")
        expect(r.headers["Content-Length"]).toBe(undefined)

        let result = r.body_("hello world")
        r.len(11)
        expect(r.body).toBe("hello world")

        const buf = new Buffer("hello")
        result = r.body_(buf)
        expect(r.headers["Content-Length"]).toBe(undefined)
        expect(r.body).toBe(buf)

        expect(result).toBe(r) // returns this
      })

      it("for undefined or a stream (or non string / buffer), removes previous content-length",() => {
        const r = new Response("hello")
        r.headers["Content-Length"] = 5
        expect(r.body).toBe("hello")
        r.body_(undefined)
        expect(r.body).toBe(undefined)
        expect(r.headers["Content-Length"]).toBe(undefined)

        r.body_("hello")
        expect(r.headers["Content-Length"]).toBe(undefined)

        r.len(100)
        r.body_({}) // pretend this object is stream
        expect(r.headers["Content-Length"]).toBe(undefined)
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
        expect(r.headers["Content-Type"]).toBe("application/json; charset=utf-8")
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

      const stream = require("stream")
      const fs = require("fs")

      it("if type is set to 'json', the body will automatically be converted to JSON", () => {
        const tester = (arr, expect_json) => {
          arr.forEach((t) => {
            const r = new Response(t).type("json")
            expect(r.headers["Content-Type"]).toBe("application/json; charset=utf-8")
            if (expect_json) {
              expect(r.body).toBe(JSON.stringify(t))
            } else {
              expect(r.body).toBe(t)
            }
          })
        }
        // not ok -> string, buffer, stream, file-stream
        // will not convert even if "json" set
        tester([
          "hi",
          new Buffer([1, 2, 3]),
          new stream.Readable(),
          new fs.ReadStream("./package.json")
        ], false)
        // ok -> array, null, undefined, object (that doesn't
        // match the above)
        tester([[1,2,3], null, undefined, { a: 1, b: 2 }], true)

        // doesn't trigger conversion
        const r = new Response([1,2,3]).type("JS ON")
        expect(r.body).toEqual([1,2,3])
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

        // but undefined is ok
        r.len(undefined)
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

        const ret = r.attachment()
        expect(r.headers).toEqual({
          "Content-Disposition": undefined
        })

        expect(ret).toBe(r)
      })
    })

    describe("cookie", () => {
      it("sets a cookie in headers", () => {
        const r = new Response()
        r.cookie("test", "123")
        expect(r.headers["Set-Cookie"]).toEqual(["test=123"])

        const t = r.cookie("another", "hi")
        expect(r.headers["Set-Cookie"]).toEqual([
          "test=123",
          "another=hi"
        ])

        expect(t).toBe(r) // returns this
      })

      it("non-string values are converted to string", () => {
        const r = new Response()
        r.cookie("test", 123)
        expect(r.headers["Set-Cookie"]).toEqual(["test=123"])
      })

      it("values are always encoded with encodeURIComponent", () => {
        const r = new Response()
        r.cookie("test", "hi ! á")
        expect(r.headers["Set-Cookie"]).toEqual(["test=hi%20!%20%C3%A1"])
      })

      it("duplicates are not handled in any way", () => {
        const r = new Response()
        r.cookie("test", 123)
        expect(r.headers["Set-Cookie"]).toEqual(["test=123"])
        r.cookie("test", 123)
        expect(r.headers["Set-Cookie"]).toEqual(["test=123", "test=123"])
      })

      it("path option", () => {
        const r = new Response()
        r.cookie("test", "123", { path: "/" })
        expect(r.headers["Set-Cookie"]).toEqual(["test=123;Path=/"])
        r.cookie("aBc", "123", { path: "/test" })
        expect(r.headers["Set-Cookie"]).toEqual([
          "test=123;Path=/",
          "aBc=123;Path=/test"
        ])
      })

      it("domain, httponly, maxage, secure options", () => {
        const r = new Response()
        // domain
        r.cookie("test", "123", { domain: "test.com" })
        expect(r.headers["Set-Cookie"]).toEqual(["test=123;Domain=test.com"])
        // httponly
        r.cookie("a", "b", { httponly: true })
        expect(r.headers["Set-Cookie"][1]).toBe("a=b;HttpOnly")
        // maxage
        r.cookie("a", "b", { maxage: "2000" })
        expect(r.headers["Set-Cookie"][2]).toBe("a=b;Max-Age=2000")
        // secure
        r.cookie("a", "b", { secure: true })
        expect(r.headers["Set-Cookie"][3]).toBe("a=b;Secure")

        // all together
        r.cookie("a", "b", {
          httponly: true,
          secure: true,
          maxage: 4000,
          domain: "test.com"
        })
        expect(r.headers["Set-Cookie"][4]).toBe("a=b;Domain=test.com;Max-Age=4000;Secure;HttpOnly")
      })

      it("expires option", () => {
        // date object ok
        const date = new Date()
        const r = new Response()
        r.cookie("c", "d", { expires: date })
        expect(r.headers["Set-Cookie"][0]).toBe("c=d;Expires=" + date.toUTCString())

        // string ok
        r.cookie("c", "d", { expires: "hihihi" })
        expect(r.headers["Set-Cookie"][1]).toBe("c=d;Expires=hihihi")
      })

      describe("deleting cookies", () => {
        it("setting an undefined value means to delete any previous cookie matching the same name & path", () => {
          const r = new Response()
          r.cookie("test", "123", { path: "/" })
          expect(r.headers["Set-Cookie"]).toEqual(["test=123;Path=/"])
          r.cookie("test", undefined, { path: "/" })
          expect(r.headers["Set-Cookie"]).toEqual([])

          r.cookie("test", "123", { path: "/" })
          r.cookie("test", "123", { path: "/" })
          r.cookie("test", "123", { path: "/" })
          expect(r.headers["Set-Cookie"].length).toBe(3)
          const t = r.cookie("test", { path: "/" })
          expect(r.headers["Set-Cookie"]).toEqual([])

          expect(t).toBe(r) // returns this
        })
      })

      it("path always defaults to '/' and options do not affect matching", () => {
        const r = new Response()
        r.cookie("test", "123", { path: "/", httponly: true })
        r.cookie("test", "123")
        r.cookie("test", "123", { path: "/", domain: "hi.com" })
        expect(r.headers["Set-Cookie"].length).toBe(3)
        r.cookie("test")
        expect(r.headers["Set-Cookie"]).toEqual([])
      })

      it("doesn't touch non-matching cookies", () => {
        const r = new Response()
        r.cookie("test", "123", { path: "/" })
        r.cookie("test", "123", { path: "/test" })
        r.cookie("tesT", "123", { path: "/" })
        expect(r.headers["Set-Cookie"].length).toBe(3)
        r.cookie("test", undefined)
        expect(r.headers["Set-Cookie"].length).toBe(2)
        expect(r.headers["Set-Cookie"]).toEqual([
          "test=123;Path=/test",
          "tesT=123;Path=/"
        ])
      })
    })

  })

})
