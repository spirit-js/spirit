const router = require("../../lib/router/router")
const {compile} = require("../../lib/router/routes")
const _route_handler = router._route_handler

process.on('unhandledRejection', function(reason, p) {
  throw("unhandled rejection for Promise: " + reason)
});

/**
 * integration test, it hits multiple functions
 *
 * usually `_route_handler` is called on each item of a List
 * that was compiled first by `list_to_routes` and then wrapped
 * over each item with `mapl`
 *
 */
describe("router._route_handler", () => {

  it("on non-matching route, returns undefined", () => {
    const Route = compile("get", "/no-match", [], () => {
      throw "should not run"
    })

    const h = _route_handler(Route)
    const req = { method: "get", url: "/" }
    const r = h(req, {})

    expect(r).toBe(undefined)
  })

  it("on matching route, returns result of Route function as Promise", (done) => {
    const Route = compile("get", "/", [], () => {
      return "hi"
    })

    const h = _route_handler(Route)
    const req = { method: "get", url: "/" }
    const r = h(req, {})

    r.then((result) => {
      expect(result).toBe("hi")
      done()
    })
  })

  it("on matching route, returns Promise of Route function ok", (done) => {
    const Route = compile("get", "/", [], () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("ok")
        }, 1)
      })
    })

    const h = _route_handler(Route)
    const req = { method: "get", url: "/" }
    const r = h(req, {})

    r.then((result) => {
      expect(result).toBe("ok")
      done()
    })
  })

  it("on matching route, returns Promise of value when Route body is not a function", (done) => {
    const Route = compile("get", "/test", [], "hello world")
    const handler = _route_handler(Route)
    // req, res
    const r = handler({ method: "GET", url: "/test" }, {})
    // r is wrapped as a promise
    r.then((result) => {
      expect(result).toBe("hello world")
      done()
    })
  })

  it("on matching route, handles reject Promise of Route function ok", (done) => {
    const Route = compile("get", "/", [], () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("not_ok")
        }, 1)
      })
    })

    const h = _route_handler(Route)
    const req = { method: "get", url: "/" }
    const r = h(req, {})

    r
      .then((result) => {
        throw "should never get here"
      })
      .catch((err) => {
        expect(err).toBe("not_ok")
        done()
      })
  })

  it("on matching route, calls Route function with correct arguments", (done) => {
    const Route = compile("get", "/", ["method", "a", "b"],
                          (method,a, b) => {
                            return [method, a, b]
                          })

    const h = _route_handler(Route)
    const req = { method: "get", url: "/", a: "hi", b: 2}
    const r = h(req, {})

    r.then((result) => {
      expect(result[0]).toBe("get")
      expect(result[1]).toBe("hi")
      expect(result[2]).toBe(2)
      done()
    })
  })

  it("handles express middleware ok", (done) => {
    const mw = (request, res, next) => {
      request.a = "changed"
      next()
    }

    const h = _route_handler(mw)
    const req = { method: "get", url: "/", a: "hi"}
    const r = h(req, {})

    r.then((result) => {
      expect(result).toBe(undefined)
      expect(req.a).toBe("changed")
      done()
    })
  })
})
