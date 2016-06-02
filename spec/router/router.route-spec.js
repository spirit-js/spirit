/**
 * integration tests for the router middleware returned by
 * (router.route)
 */

const router = require("../../lib/router/router")

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
  it("calls next() when no more routes or middlewares to try")

  // tests `_next` var
  it("calls next(err) only when there was a result but user's then 'ate' the result and returned back nothing")

  it("calls user's then when there is a result")

  it("calls user's catch when there is an error")

  it("continues without error trying to find a matching route when initial match returns undefined")
})

