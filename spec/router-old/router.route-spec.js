/**
 * integration tests for the router middleware returned by
 * (router.route)
 */

const router = require("../../lib/router/router")
const Promise = require("bluebird")
const mock_response = require("../support/mock-response")
const CallError = require("../support/custom-errors")

describe("router.route (middleware)", () => {
  let list

  beforeEach(() => {
    list = {
      name: "",
      list: []
    }
  })

  it("calls a route's function when matched", (done) => {
    const route = (blah) => {
      expect(blah).toBe("abc")
   }

    list.list = [
      ["get", "/path/:blah", ["blah"], route]
    ]
    const router_middleware = router.route(list)

    // req, res, next
    router_middleware({ method: "get", url: "/path/abc" }, {}, () => {
      done()
    })
  })

  it("it accepts compiled Routes and express middleware", (done) => {
    const route = (blah, stuff) => {
      expect(blah).toBe("abc")
      expect(stuff).toBe(123)
    }

    list.list = [
      (req, res, next) => {
        req.stuff = 123
        next()
      },
      ["get", "/path/:blah", ["blah", "stuff"], route]
    ]

    const middleware = router.route(list)

    middleware({ method: "get", url: "/path/abc" }, {}, () => {
      done()
    })
  })

  /*
   * it respects a List's name and never iterates if the name
   * does not match
   */
  it("exits early if url does not match list's name", (done) => {
    list.list = [
      (req, res, next) => {
        next("shouldn't be called")
      }
    ]
    list.name = "/test"
    const middleware = router.route(list)

    const mock_req = {
      method: "get",
      url: "/blah/123"
    }

    // req, res, next
    middleware(mock_req, {}, (err) => {
      if (err) {
        throw err
      }
      done()
    })
  })

  // safe to remove when `resources` or middlewares are re-designed
  it("sets a variable on `req` with the list's name and unsets when router is done", (done) => {
    list.list = [
      (req, res, next) => {
        expect(req._named_route).toBe("/testtest")
        next()
      }
    ]
    list.name = "/testtest"
    const middleware = router.route(list)

    const mock_req = {
      method: "get", url: "/testtest/abc"
    }

    middleware(mock_req, {}, () => {
      expect(mock_req._named_route).toBe("")
      done()
    })
  })

  // tests `_next` var
  it("calls next() when no more routes or middlewares to try", (done) => {
    // none of these handle the current request
    list.list = [
      (req, res, next) => { req.called += 1; next()},
      (req, res, next) => { req.called += 1; next()},
      ["get", "/", [], () => { return undefined }],
      (req, res, next) => { req.called += 1; next()}
    ]
    const middleware = router.route(list)

    const mock_req = {
      method: "get", url: "/", called: 0
    }

    middleware(mock_req, {}, () => {
      expect(mock_req.called).toBe(3)
      done()
    })
  })

  // tests `_next` var
  it("calls next(err) only when there was a result but user's then 'ate' the result and returned back nothing", (done) => {
    list.list = [
      (req, res, next) => { req.called += 1; next()},
      (req, res, next) => { req.called += 1; next()},
      ["get", "/", [], () => { return "hi" }],
      (req, res, next) => { req.called += 1; next()}
    ]
    list._then = (result) => {
      expect(result).toBe("hi")
      // not returning anything is an error here
      // since a route successfully returned something
      // but this `then` doesn't return anything
    }
    const middleware = router.route(list)
    const mock_req = {
      method: "get", url: "/", called: 0
    }
    middleware(mock_req, {}, (err) => {
      expect(err).toBe("Expected `then` to return a valid response")
      done()
    })
  })

  it("calls user's then when there is a result", (done) => {
    list.list = [
      (req, res, next) => { req.called += 1; next()},
      ["get", "/123", [], () => { return "result123" }],
      ["get", "/", [], () => { return "result" }],
    ]

    list._then = (result) => {
      expect(result).toBe("result")
      return "resultresult"
    }

    const res = mock_response((result) => {
      expect(mock_req.called).toBe(1)
      expect(result.body).toBe("resultresult")
      done()
    })

    const middleware = router.route(list)

    const mock_req = {
      method: "get", url: "/", called: 0
    }

    middleware(mock_req, res, (err) => {
      throw new CallError
    })
  })

  it("user's catch accepts promise", (done) => {
    list.list = [
      ["get", "/", [], () => { return "result" }],
    ]

    list._then = (result) => {
      expect(result).toBe("result")
      return Promise.resolve("resultresult")
    }

    const res = mock_response((result) => {
      expect(result.body).toBe("resultresult")
      done()
    })

    const middleware = router.route(list)
    const mock_req = { method: "get", url: "/" }
    middleware(mock_req, res, (err) => {
      throw new CallError
    })
  })

  it("user's catch accepts promise", (done) => {
    list.list = [
      ["get", "/", [], () => { throw "error" }],
    ]

    list._catch = (err) => {
      expect(err).toBe("error")
      return Promise.reject("new error")
    }

    const middleware = router.route(list)
    const mock_req = { method: "get", url: "/" }
    middleware(mock_req, mock_response(), (err) => {
      expect(err).toBe("new error")
      done()
    })
  })

  it("calls user's catch when there is an error", (done) => {
    list.list = [
      (req, res, next) => { req.called += 1; next()},
      ["get", "/", [], () => { throw 123 }],
    ]

    list._catch = (err) => {
      expect(mock_req.called).toBe(1)
      expect(err).toBe(123)
      throw "new err"
    }

    const middleware = router.route(list)

    const mock_req = {
      method: "get", url: "/", called: 0
    }

    middleware(mock_req, mock_response(), (err) => {
      expect(err).toBe("new err")
      done()
    })
  })

  it("can recover from a user's catch", (done) => {
    list.list = [
      ["get", "/", [], () => { throw 123 }],
    ]

    list._catch = (err) => {
      expect(err).toBe(123)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("recover")
        }, 1)
      })
    }

    const middleware = router.route(list)

    const res = mock_response((result) => {
      expect(result.status).toBe(200)
      expect(result.body).toBe("recover")
      done()
    })

    const mock_req = {
      method: "get", url: "/"
    }

    middleware(mock_req, res, () => {
      throw new CallError
    })
  })

  // a route handler can return undefined to pass on the current route
  // similar to Express's next()
  it("continues without error trying to find a matching route when initial match returns undefined", (done) => {
    list.list = [
      (req, res, next) => { req.called += 1; next()},
      ["get", "/", [], () => { return undefined }],
      ["get", "/", [], () => { return undefined }],
      ["get", "/", [], () => { return 123 }],
      ["get", "/", [], () => { return undefined }],
    ]

    list._then = (result) => {
      expect(result).toBe(123)
      done()
    }

    const middleware = router.route(list)

    const mock_req = {
      method: "get", url: "/", called: 0
    }

    middleware(mock_req, mock_response(), () => {
      // it errors, since _then doesn't return a result
      // ignore since its out of scope of this test
    })
  })
})

