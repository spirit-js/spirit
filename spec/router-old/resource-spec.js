const rewire = require("rewire")
//const resources = require("../../lib/router/resource")
const resources = rewire("../../lib/router/resource")

describe("router/resources", () => {
  let mock_req
  let mock_res

  beforeEach(() => {
    mock_req = {
      method: "GET", // serve static only responds to GET & HEAD
      url: "/src/core/core.js"
    }

    mock_res = {}
  })

  it("returns a express middleware fn", () => {
    const fn = resources()
    expect(typeof fn).toBe("function")
    expect(fn.length).toBe(3)
  })

  it("no-match: just calls next()", (done) => {
    const middleware = resources("/yum")

    resources.__set__("serve_static", () => {
      throw "should not be called"
    })


    middleware(mock_req, mock_res, () => {
      expect(mock_req.originalUrl).toBe(undefined)
      expect(mock_req.url).toBe("/src/core/core.js")
      done()
    })
  })

  it("match all: calls serve-static, req.originalUrl", (done) => {
    const middleware = resources("", {
      root: "./",
      a: 1,
      b: 2
    })

    resources.__set__("serve_static", (path, opts) => {
      expect(path).toBe("./")
      expect(opts).toEqual({
        root: "./",
        a: 1,
        b: 2
      })
      return (req, res, next) => {
        expect(mock_req.originalUrl).toBe("/src/core/core.js")
        expect(mock_req.url).toBe("/src/core/core.js")
        done()
      }
    })

    middleware(mock_req, mock_res, () => {
      // next
      throw "should not be called"
    })
  })

  it("match on set path also modifies req.url", (done) => {
    const middleware = resources("/static", {})

    mock_req.url = "/static/abc/123"

    resources.__set__("serve_static", (path, opts) => {
      expect(path).toBe("public/")
      expect(opts).toEqual({})

      return (req, res, next) => {
        expect(mock_req.originalUrl).toBe("/static/abc/123")
        expect(mock_req.url).toBe("/abc/123")

        // serve-static will try to serve "public/abc/123"
        done()
      }
    })

    middleware(mock_req, mock_res, () => {
      // next
      throw "should not be called"
    })
  })

  it("match takes into account req._named_route when matching", (done) => {
    // as set by the leaf router
    mock_req._named_route = "/private"
    mock_req.url = "/private/static/abc/123"

    const middleware = resources("/static", {})
    resources.__set__("serve_static", (path, opts) => {
      expect(path).toBe("public/")
      expect(opts).toEqual({})

      return (req, res, next) => {
        expect(mock_req.originalUrl).toBe("/private/static/abc/123")
        expect(mock_req.url).toBe("/abc/123")
        done()
      }
    })

    middleware(mock_req, mock_res, () => {
      // next
      throw "should not be called"
    })
  })

  it("on match but serve-static errors, it resets req.url", (done) => {
    // as set by the leaf router
    mock_req._named_route = "/private"
    mock_req.url = "/private/static/abc/123"

    const middleware = resources("/static", {})
    resources.__set__("serve_static", (path, opts) => {
      expect(path).toBe("public/")
      expect(opts).toEqual({})

      return (req, res, next) => {
        expect(mock_req.originalUrl).toBe("/private/static/abc/123")
        expect(mock_req.url).toBe("/abc/123")
        // call next here to simulate serve-static calling next
        // when there is an error sending the file
        // such as the case when file is not found
        next()
      }
    })

    middleware(mock_req, mock_res, () => {
      // next
      // when the next middleware is called `req.url` should
      // return to normal
      expect(mock_req.url).toBe("/private/static/abc/123")
      done()
    })
  })

})
