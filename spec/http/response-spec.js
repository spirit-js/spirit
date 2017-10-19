const response = require("../../index").node
const Response = require("../../lib/http/response-class").Response
const fs = require("fs")

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

    it("alias", () => {
      expect(response.is_response).toBe(response.isResponse)
    })
  })

  const stream = require("stream")
  describe("make_stream", () => {
    it("returns a writable stream", (done) => {
      const buf = []
      const t = new stream.Transform({
        transform(chunk, enc, cb) {
          buf.push(chunk.toString())
          if (buf.join("") === "test123") done()
          cb()
        }
      })

      const s = response.make_stream()
      s.write("test")
      s.write("1")
      s.write("2")
      s.end("3")
      s.pipe(t)
    })

    it("using with a response is ok", () => {
      const s = response.make_stream()
      const resp = response.response(s)
      expect(resp.status).toBe(200)
      expect(resp.headers).toEqual({})
      expect(resp.body).toBe(s)
    })

    it("alias", () => {
      expect(response.make_stream).toBe(response.makeStream)
    })
  })

  describe("response", () => {
    it("returns a response map from value", () => {
      const r = response.response("hey")
      expect(r).toEqual(jasmine.objectContaining({
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8"
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

  describe("file_response", () => {

    const test_file = __dirname + "/../../package.json"

    const test_expect = (resp) => {
      expect(resp.status).toBe(200)
      // file is probably greater than 500 bytes
      expect(resp.headers["Content-Length"] > 500).toBe(true)
      expect(resp.headers["Content-Type"]).toBe("application/json; charset=utf-8")
      expect(Object.keys(resp.headers).length).toBe(3)
      expect(typeof resp.body.pipe).toBe("function")

      // also attaches file information to ._file
      expect(resp._file.filepath).toMatch(/package.json$/)
      expect(resp._file instanceof fs.Stats).toBe(true)
    }

    it("creates response from file path string with a body stream", (done) => {
      response.file_response(test_file)
        .then((resp) => {
          test_expect(resp)
          done()
        })
    })

    it("creates response from a file stream", (done) => {
      const f = fs.createReadStream(test_file)
      response.file_response(f).then((resp) => {
        test_expect(resp)
        done()
      })
    })

    it("errors are catchable", (done) => {
      response.file_response("no_exist.txt").catch((err) => {
        expect(err).toMatch(/no_exist.txt/)
        done()
      })
    })

    it("sets Last-Modified headers to the file's mtime", (done) => {
      fs.stat(test_file, (err, stat) => {
        response.file_response(test_file)
          .then((resp) => {
            test_expect(resp)
            expect(resp.headers["Last-Modified"]).toBe(stat.mtime.toUTCString())
            done()
          })
      })
    })

    it("alias", () => {
      expect(response.file_response).toBe(response.fileResponse)
    })

    it("throws when called with non-string or non-file stream argument", () => {
      expect(() => {
        response.file_response(123)
      }).toThrowError(/Expected a file/)

      expect(() => {
        response.file_response({})
      }).toThrowError(/Expected a file/)

      expect(() => {
        response.file_response({ path: "hi" })
      }).toThrowError(/Expected a file/)
    })

    it("throws when argument is not a file", (done) => {
      response.file_response("lib/").catch((err) => {
        expect(err).toMatch(/not a file/)
        done()
      })
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

  describe("err_response", () => {
    it("returns a response map with status 500", () => {
      expect(response.err_response("test 123")).toEqual(jasmine.objectContaining({
        status: 500,
        headers: {},
        body: "test 123"
      }))
    })

    it("returns a default message if no body", () => {
      const resp = response.err_response()
      expect(resp).toEqual(jasmine.objectContaining({
        status: 500,
        headers: {}
      }))
      expect(resp.body).toMatch(/no error message/)
    })

    it("accepts a Error and will output the err.stack", () => {
      const err = new Error("err")
      expect(response.err_response(err).body).toMatch(/response-spec/)
    })

    it("alias", () => {
      expect(response.err_response).toBe(response.errResponse)
    })
  })

})
